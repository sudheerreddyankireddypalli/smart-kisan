package com.smartkisan.app.data.db

import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import com.smartkisan.app.data.model.*
import com.smartkisan.app.domain.security.AccessDeniedException
import com.smartkisan.app.domain.security.AccessPolicyGuard

class DatabaseRepository(context: Context) {

    private val dbHelper = SmartKisanDbHelper(context)

    // --- Authentication ---
    fun authenticate(identifier: String, pin: String, role: UserRole): User? {
        val db = dbHelper.readableDatabase
        val cursor: Cursor = if (role == UserRole.FARMER) {
            db.query(
                SmartKisanDbHelper.TABLE_USERS,
                null,
                "phone = ? AND role = ?",
                arrayOf(identifier.trim(), role.name),
                null, null, null
            )
        } else {
            db.query(
                SmartKisanDbHelper.TABLE_USERS,
                null,
                "phone = ? AND role = ?",
                arrayOf(identifier.trim(), role.name),
                null, null, null
            )
        }

        return cursor.use {
            if (it.moveToFirst()) {
                val user = mapUser(it)
                logAudit(user.id, "AUTH_LOGIN_SUCCESS", "User logged in with role: ${user.role}")
                user
            } else {
                // If farmer phone does not exist, auto-register for seamless smallholder onboarding
                if (role == UserRole.FARMER && identifier.isNotBlank() && identifier.length >= 10) {
                    val newUser = User(
                        phone = identifier.trim(),
                        name = "Farmer ${identifier.takeLast(4)}",
                        role = UserRole.FARMER,
                        village = "Amaravathi, AP"
                    )
                    insertUser(newUser)
                    logAudit(newUser.id, "AUTH_REGISTER_AUTO", "New farmer self-registered offline")
                    newUser
                } else {
                    logAudit("anonymous", "AUTH_LOGIN_FAILED", "Failed attempt for id: $identifier ($role)")
                    null
                }
            }
        }
    }

    private fun insertUser(user: User) {
        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put("id", user.id)
            put("phone", user.phone)
            put("name", user.name)
            put("role", user.role.name)
            put("village", user.village)
            put("auth_token", user.authToken)
            put("created_at", System.currentTimeMillis())
        }
        db.insertWithOnConflict(SmartKisanDbHelper.TABLE_USERS, null, values, android.database.sqlite.SQLiteDatabase.CONFLICT_REPLACE)
    }

    // --- Farms (User-Specific Access Policy Enforced) ---
    fun getFarms(currentUser: User): List<Farm> {
        AccessPolicyGuard.assertAuthenticated(currentUser)
        val db = dbHelper.readableDatabase

        val cursor = if (currentUser.role == UserRole.ADMIN) {
            // Admins can view all farms for audit and compliance
            db.query(SmartKisanDbHelper.TABLE_FARMS, null, null, null, null, null, "created_at DESC")
        } else {
            // Farmers strictly isolated to their own records
            db.query(
                SmartKisanDbHelper.TABLE_FARMS,
                null,
                "user_id = ?",
                arrayOf(currentUser.id),
                null, null, "created_at DESC"
            )
        }

        val list = mutableListOf<Farm>()
        cursor.use {
            while (it.moveToNext()) {
                list.add(mapFarm(it))
            }
        }
        return list
    }

    fun getFarmById(currentUser: User, farmId: String): Farm? {
        AccessPolicyGuard.assertAuthenticated(currentUser)
        val db = dbHelper.readableDatabase
        val cursor = db.query(
            SmartKisanDbHelper.TABLE_FARMS,
            null,
            "id = ?",
            arrayOf(farmId),
            null, null, null
        )
        return cursor.use {
            if (it.moveToFirst()) {
                val farm = mapFarm(it)
                AccessPolicyGuard.assertRecordOwnership(currentUser, farm.userId, "Farm")
                farm
            } else null
        }
    }

    fun saveFarm(currentUser: User, farm: Farm): Boolean {
        AccessPolicyGuard.assertAuthenticated(currentUser)
        val db = dbHelper.writableDatabase

        // If editing existing, verify ownership
        val existing = getFarmById(currentUser, farm.id)
        if (existing != null) {
            AccessPolicyGuard.assertRecordOwnership(currentUser, existing.userId, "Farm")
        }

        val values = ContentValues().apply {
            put("id", farm.id)
            put("user_id", currentUser.id)
            put("name", farm.name)
            put("survey_no", farm.surveyNo)
            put("total_acres", farm.totalAcres)
            put("soil_type", farm.soilType)
            put("water_source", farm.waterSource)
            put("created_at", farm.createdAt)
        }

        val result = db.insertWithOnConflict(
            SmartKisanDbHelper.TABLE_FARMS,
            null,
            values,
            android.database.sqlite.SQLiteDatabase.CONFLICT_REPLACE
        )

        val success = result != -1L
        if (success) {
            logAudit(currentUser.id, "FARM_SAVED", "Farm ${farm.name} (Acres: ${farm.totalAcres}) persisted")
        }
        return success
    }

    fun deleteFarm(currentUser: User, farmId: String): Boolean {
        AccessPolicyGuard.assertAuthenticated(currentUser)
        val existing = getFarmById(currentUser, farmId) ?: return false
        AccessPolicyGuard.assertRecordOwnership(currentUser, existing.userId, "Farm")

        val db = dbHelper.writableDatabase
        db.beginTransaction()
        return try {
            db.delete(SmartKisanDbHelper.TABLE_PLOTS, "farm_id = ?", arrayOf(farmId))
            val deleted = db.delete(SmartKisanDbHelper.TABLE_FARMS, "id = ?", arrayOf(farmId)) > 0
            db.setTransactionSuccessful()
            if (deleted) {
                logAudit(currentUser.id, "FARM_DELETED", "Deleted farm $farmId and associated plots")
            }
            deleted
        } finally {
            db.endTransaction()
        }
    }

    // --- Plots (User-Specific Access Policy Enforced) ---
    fun getPlotsForFarm(currentUser: User, farmId: String): List<Plot> {
        AccessPolicyGuard.assertAuthenticated(currentUser)
        val farm = getFarmById(currentUser, farmId) ?: return emptyList()

        val db = dbHelper.readableDatabase
        val cursor = db.query(
            SmartKisanDbHelper.TABLE_PLOTS,
            null,
            "farm_id = ? AND user_id = ?",
            if (currentUser.role == UserRole.ADMIN) arrayOf(farmId, farm.userId) else arrayOf(farmId, currentUser.id),
            null, null, "created_at ASC"
        )

        val list = mutableListOf<Plot>()
        cursor.use {
            while (it.moveToNext()) {
                list.add(mapPlot(it))
            }
        }
        return list
    }

    fun savePlot(currentUser: User, plot: Plot): Boolean {
        AccessPolicyGuard.assertAuthenticated(currentUser)
        val farm = getFarmById(currentUser, plot.farmId)
            ?: throw AccessDeniedException("Parent farm not accessible")
        AccessPolicyGuard.assertRecordOwnership(currentUser, farm.userId, "Farm for Plot")

        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put("id", plot.id)
            put("farm_id", plot.farmId)
            put("user_id", currentUser.id)
            put("name", plot.name)
            put("acres", plot.acres)
            put("irrigation_type", plot.irrigationType)
            put("current_crop", plot.currentCrop)
            put("created_at", plot.createdAt)
        }

        val result = db.insertWithOnConflict(
            SmartKisanDbHelper.TABLE_PLOTS,
            null,
            values,
            android.database.sqlite.SQLiteDatabase.CONFLICT_REPLACE
        )
        val success = result != -1L
        if (success) {
            logAudit(currentUser.id, "PLOT_SAVED", "Plot ${plot.name} saved under farm ${plot.farmId}")
        }
        return success
    }

    fun deletePlot(currentUser: User, plotId: String): Boolean {
        AccessPolicyGuard.assertAuthenticated(currentUser)
        val db = dbHelper.writableDatabase
        val cursor = db.query(
            SmartKisanDbHelper.TABLE_PLOTS,
            null,
            "id = ?",
            arrayOf(plotId),
            null, null, null
        )

        var ownerId: String? = null
        cursor.use {
            if (it.moveToFirst()) {
                ownerId = it.getString(it.getColumnIndexOrThrow("user_id"))
            }
        }

        if (ownerId == null) return false
        AccessPolicyGuard.assertRecordOwnership(currentUser, ownerId!!, "Plot")

        val deleted = db.delete(SmartKisanDbHelper.TABLE_PLOTS, "id = ?", arrayOf(plotId)) > 0
        if (deleted) {
            logAudit(currentUser.id, "PLOT_DELETED", "Deleted plot $plotId")
        }
        return deleted
    }

    // --- Market Prices with Freshness & Source Provenance ---
    fun getMarketPrices(): List<MarketPrice> {
        val db = dbHelper.readableDatabase
        val cursor = db.query(SmartKisanDbHelper.TABLE_MARKET, null, null, null, null, null, "commodity ASC")
        val list = mutableListOf<MarketPrice>()
        cursor.use {
            while (it.moveToNext()) {
                list.add(
                    MarketPrice(
                        id = it.getString(it.getColumnIndexOrThrow("id")),
                        commodity = it.getString(it.getColumnIndexOrThrow("commodity")),
                        marketName = it.getString(it.getColumnIndexOrThrow("market_name")),
                        minPrice = it.getDouble(it.getColumnIndexOrThrow("min_price")),
                        modalPrice = it.getDouble(it.getColumnIndexOrThrow("modal_price")),
                        maxPrice = it.getDouble(it.getColumnIndexOrThrow("max_price")),
                        source = it.getString(it.getColumnIndexOrThrow("source")),
                        freshnessLabel = it.getString(it.getColumnIndexOrThrow("freshness_label")),
                        isStale = it.getInt(it.getColumnIndexOrThrow("is_stale")) == 1
                    )
                )
            }
        }
        return list
    }

    // --- Clearly Labeled Sponsored Content ---
    fun getSponsoredItems(): List<SponsoredItem> {
        val db = dbHelper.readableDatabase
        val cursor = db.query(SmartKisanDbHelper.TABLE_SPONSORED, null, null, null, null, null, null)
        val list = mutableListOf<SponsoredItem>()
        cursor.use {
            while (it.moveToNext()) {
                list.add(
                    SponsoredItem(
                        id = it.getString(it.getColumnIndexOrThrow("id")),
                        titleEn = it.getString(it.getColumnIndexOrThrow("title_en")),
                        titleTe = it.getString(it.getColumnIndexOrThrow("title_te")),
                        descEn = it.getString(it.getColumnIndexOrThrow("desc_en")),
                        descTe = it.getString(it.getColumnIndexOrThrow("desc_te")),
                        sponsorName = it.getString(it.getColumnIndexOrThrow("sponsor_name")),
                        disclosureLabel = it.getString(it.getColumnIndexOrThrow("disclosure_label")),
                        actionUrl = it.getString(it.getColumnIndexOrThrow("action_url"))
                    )
                )
            }
        }
        return list
    }

    fun saveSponsoredItem(currentUser: User, item: SponsoredItem): Boolean {
        if (!AccessPolicyGuard.canAccessAdminPortal(currentUser)) {
            throw AccessDeniedException("Only admins can manage sponsored content")
        }
        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put("id", item.id)
            put("title_en", item.titleEn)
            put("title_te", item.titleTe)
            put("desc_en", item.descEn)
            put("desc_te", item.descTe)
            put("sponsor_name", item.sponsorName)
            put("disclosure_label", item.disclosureLabel)
            put("action_url", item.actionUrl)
        }
        val res = db.insertWithOnConflict(
            SmartKisanDbHelper.TABLE_SPONSORED,
            null,
            values,
            android.database.sqlite.SQLiteDatabase.CONFLICT_REPLACE
        )
        return res != -1L
    }

    // --- Audit & Security Logs (Admin Access Protected) ---
    fun getAuditLogs(currentUser: User): List<AuditLog> {
        if (!AccessPolicyGuard.canAccessAdminPortal(currentUser)) {
            throw AccessDeniedException("Admin role required to view security audit logs")
        }
        val db = dbHelper.readableDatabase
        val cursor = db.query(
            SmartKisanDbHelper.TABLE_AUDIT,
            null,
            null,
            null,
            null,
            null,
            "timestamp DESC",
            "50"
        )
        val list = mutableListOf<AuditLog>()
        cursor.use {
            while (it.moveToNext()) {
                list.add(
                    AuditLog(
                        id = it.getLong(it.getColumnIndexOrThrow("id")),
                        userId = it.getString(it.getColumnIndexOrThrow("user_id")),
                        eventType = it.getString(it.getColumnIndexOrThrow("event_type")),
                        details = it.getString(it.getColumnIndexOrThrow("details")),
                        timestamp = it.getLong(it.getColumnIndexOrThrow("timestamp"))
                    )
                )
            }
        }
        return list
    }

    fun logAudit(userId: String, eventType: String, details: String) {
        val db = dbHelper.writableDatabase
        val values = ContentValues().apply {
            put("user_id", userId)
            put("event_type", eventType)
            put("details", details)
            put("timestamp", System.currentTimeMillis())
        }
        db.insert(SmartKisanDbHelper.TABLE_AUDIT, null, values)
    }

    // --- Row Mappers ---
    private fun mapUser(c: Cursor): User {
        return User(
            id = c.getString(c.getColumnIndexOrThrow("id")),
            phone = c.getString(c.getColumnIndexOrThrow("phone")),
            name = c.getString(c.getColumnIndexOrThrow("name")),
            role = UserRole.valueOf(c.getString(c.getColumnIndexOrThrow("role"))),
            village = c.getString(c.getColumnIndexOrThrow("village")),
            authToken = c.getString(c.getColumnIndexOrThrow("auth_token"))
        )
    }

    private fun mapFarm(c: Cursor): Farm {
        return Farm(
            id = c.getString(c.getColumnIndexOrThrow("id")),
            userId = c.getString(c.getColumnIndexOrThrow("user_id")),
            name = c.getString(c.getColumnIndexOrThrow("name")),
            surveyNo = c.getString(c.getColumnIndexOrThrow("survey_no")),
            totalAcres = c.getDouble(c.getColumnIndexOrThrow("total_acres")),
            soilType = c.getString(c.getColumnIndexOrThrow("soil_type")),
            waterSource = c.getString(c.getColumnIndexOrThrow("water_source")),
            createdAt = c.getLong(c.getColumnIndexOrThrow("created_at"))
        )
    }

    private fun mapPlot(c: Cursor): Plot {
        return Plot(
            id = c.getString(c.getColumnIndexOrThrow("id")),
            farmId = c.getString(c.getColumnIndexOrThrow("farm_id")),
            userId = c.getString(c.getColumnIndexOrThrow("user_id")),
            name = c.getString(c.getColumnIndexOrThrow("name")),
            acres = c.getDouble(c.getColumnIndexOrThrow("acres")),
            irrigationType = c.getString(c.getColumnIndexOrThrow("irrigation_type")),
            currentCrop = c.getString(c.getColumnIndexOrThrow("current_crop")),
            createdAt = c.getLong(c.getColumnIndexOrThrow("created_at"))
        )
    }
}
