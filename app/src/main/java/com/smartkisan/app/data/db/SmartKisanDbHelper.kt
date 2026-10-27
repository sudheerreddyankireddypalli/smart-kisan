package com.smartkisan.app.data.db

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import com.smartkisan.app.data.model.UserRole

class SmartKisanDbHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        const val DATABASE_NAME = "smart_kisan.db"
        const val DATABASE_VERSION = 1

        const val TABLE_USERS = "users"
        const val TABLE_FARMS = "farms"
        const val TABLE_PLOTS = "plots"
        const val TABLE_MARKET = "market_prices"
        const val TABLE_SPONSORED = "sponsored_items"
        const val TABLE_AUDIT = "audit_logs"
    }

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(
            """
            CREATE TABLE $TABLE_USERS (
                id TEXT PRIMARY KEY,
                phone TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                village TEXT NOT NULL,
                auth_token TEXT NOT NULL,
                created_at INTEGER NOT NULL
            );
            """.trimIndent()
        )

        db.execSQL(
            """
            CREATE TABLE $TABLE_FARMS (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                survey_no TEXT NOT NULL,
                total_acres REAL NOT NULL,
                soil_type TEXT NOT NULL,
                water_source TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES $TABLE_USERS(id) ON DELETE CASCADE
            );
            """.trimIndent()
        )
        db.execSQL("CREATE INDEX idx_farms_user ON $TABLE_FARMS(user_id);")

        db.execSQL(
            """
            CREATE TABLE $TABLE_PLOTS (
                id TEXT PRIMARY KEY,
                farm_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                name TEXT NOT NULL,
                acres REAL NOT NULL,
                irrigation_type TEXT NOT NULL,
                current_crop TEXT NOT NULL,
                created_at INTEGER NOT NULL,
                FOREIGN KEY (farm_id) REFERENCES $TABLE_FARMS(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES $TABLE_USERS(id) ON DELETE CASCADE
            );
            """.trimIndent()
        )
        db.execSQL("CREATE INDEX idx_plots_farm ON $TABLE_PLOTS(farm_id);")
        db.execSQL("CREATE INDEX idx_plots_user ON $TABLE_PLOTS(user_id);")

        db.execSQL(
            """
            CREATE TABLE $TABLE_MARKET (
                id TEXT PRIMARY KEY,
                commodity TEXT NOT NULL,
                market_name TEXT NOT NULL,
                min_price REAL NOT NULL,
                modal_price REAL NOT NULL,
                max_price REAL NOT NULL,
                source TEXT NOT NULL,
                freshness_label TEXT NOT NULL,
                is_stale INTEGER NOT NULL
            );
            """.trimIndent()
        )

        db.execSQL(
            """
            CREATE TABLE $TABLE_SPONSORED (
                id TEXT PRIMARY KEY,
                title_en TEXT NOT NULL,
                title_te TEXT NOT NULL,
                desc_en TEXT NOT NULL,
                desc_te TEXT NOT NULL,
                sponsor_name TEXT NOT NULL,
                disclosure_label TEXT NOT NULL,
                action_url TEXT NOT NULL
            );
            """.trimIndent()
        )

        db.execSQL(
            """
            CREATE TABLE $TABLE_AUDIT (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                event_type TEXT NOT NULL,
                details TEXT NOT NULL,
                timestamp INTEGER NOT NULL
            );
            """.trimIndent()
        )

        seedInitialData(db)
    }

    private fun seedInitialData(db: SQLiteDatabase) {
        val now = System.currentTimeMillis()

        // 1. Seed Demo Farmer & Admin
        val farmerValues = ContentValues().apply {
            put("id", "farmer-101")
            put("phone", "9876543210")
            put("name", "Rami Reddy (రామిరెడ్డి)")
            put("role", UserRole.FARMER.name)
            put("village", "Kollipara, Tenali, Guntur")
            put("auth_token", "token_farmer_101_secure")
            put("created_at", now)
        }
        db.insert(TABLE_USERS, null, farmerValues)

        val adminValues = ContentValues().apply {
            put("id", "admin-999")
            put("phone", "admin@smartkisan.in")
            put("name", "Chief Agri Extension Officer")
            put("role", UserRole.ADMIN.name)
            put("village", "Rythu Bharosa Kendra, Vijayawada")
            put("auth_token", "token_admin_999_elevated")
            put("created_at", now)
        }
        db.insert(TABLE_USERS, null, adminValues)

        // 2. Seed Initial Farms for Farmer-101
        val farm1 = ContentValues().apply {
            put("id", "farm-01")
            put("user_id", "farmer-101")
            put("name", "Pedda Chenu (పెద్ద చేను)")
            put("survey_no", "142/3A")
            put("total_acres", 4.5)
            put("soil_type", "Black Regur Soil (నల్ల రేగడి)")
            put("water_source", "Canal + Borewell (కాలువ & బోరు)")
            put("created_at", now - 86400000L * 10)
        }
        db.insert(TABLE_FARMS, null, farm1)

        val farm2 = ContentValues().apply {
            put("id", "farm-02")
            put("user_id", "farmer-101")
            put("name", "Thota Chenu (తోట మడి)")
            put("survey_no", "89/1B")
            put("total_acres", 2.2)
            put("soil_type", "Red Sandy Loam (ఎర్ర నేల)")
            put("water_source", "Borewell Drip (బోరు డ్రిప్)")
            put("created_at", now - 86400000L * 5)
        }
        db.insert(TABLE_FARMS, null, farm2)

        // 3. Seed Plots
        val plot1 = ContentValues().apply {
            put("id", "plot-01")
            put("farm_id", "farm-01")
            put("user_id", "farmer-101")
            put("name", "Chilli Block A (మిరప ప్లాట్ 1)")
            put("acres", 2.5)
            put("irrigation_type", "Drip Irrigation (డ్రిప్)")
            put("current_crop", "Teja Chilli (తేజ మిరప)")
            put("created_at", now - 86400000L * 10)
        }
        db.insert(TABLE_PLOTS, null, plot1)

        val plot2 = ContentValues().apply {
            put("id", "plot-02")
            put("farm_id", "farm-01")
            put("user_id", "farmer-101")
            put("name", "Paddy Block B (వరి ప్లాట్ 2)")
            put("acres", 2.0)
            put("irrigation_type", "Flood Canal (కాలువ వరద నీరు)")
            put("current_crop", "BPT 5204 Samba Masuri")
            put("created_at", now - 86400000L * 10)
        }
        db.insert(TABLE_PLOTS, null, plot2)

        // 4. Seed AGMARKNET Verified Prices with freshness metadata
        val marketPrices = listOf(
            ContentValues().apply {
                put("id", "m1")
                put("commodity", "Chilli (తేజ మిరప)")
                put("market_name", "Guntur APMC Market Yard")
                put("min_price", 16500.0)
                put("modal_price", 18800.0)
                put("max_price", 21500.0)
                put("source", "AGMARKNET (Govt. of India)")
                put("freshness_label", "Live - Updated 20 mins ago")
                put("is_stale", 0)
            },
            ContentValues().apply {
                put("id", "m2")
                put("commodity", "Cotton (పత్తి - Medium Staple)")
                put("market_name", "Warangal Enamamula Mandi")
                put("min_price", 6900.0)
                put("modal_price", 7350.0)
                put("max_price", 7700.0)
                put("source", "AGMARKNET (Govt. of India)")
                put("freshness_label", "Live - Updated 45 mins ago")
                put("is_stale", 0)
            },
            ContentValues().apply {
                put("id", "m3")
                put("commodity", "Paddy (వరి - BPT / Common)")
                put("market_name", "Miryalaguda APMC Yard")
                put("min_price", 2183.0)
                put("modal_price", 2320.0)
                put("max_price", 2450.0)
                put("source", "AGMARKNET (MSP Verified)")
                put("freshness_label", "Live - Updated 1 hour ago")
                put("is_stale", 0)
            }
        )
        for (mp in marketPrices) {
            db.insert(TABLE_MARKET, null, mp)
        }

        // 5. Seed Clearly Labeled Sponsored Content (Monetization & Disclosure)
        val sponsor1 = ContentValues().apply {
            put("id", "sp-01")
            put("title_en", "Bio-NPK Liquid Fertilizer - 25% Govt Subsidy")
            put("title_te", "బయో-NPK ద్రవ ఎరువులు - 25% రాయితీ లభ్యం")
            put("desc_en", "Boost nitrogen fixation & reduce chemical urea costs by ₹1,800/acre. Certified organic input.")
            put("desc_te", "నత్రజని స్థిరీకరణను పెంచి రసాయనిక యూరియా ఖర్చును ఎకరానికి ₹1,800 తగ్గించండి.")
            put("sponsor_name", "Sri Rama Bio Agri Sciences Ltd.")
            put("disclosure_label", "ప్రాయోజిత భాగస్వామి ప్రకటన / SPONSORED PARTNER AD")
            put("action_url", "https://smartkisan.in/partners/sri-rama-bio")
        }
        db.insert(TABLE_SPONSORED, null, sponsor1)

        val sponsor2 = ContentValues().apply {
            put("id", "sp-02")
            put("title_en", "Drone Spraying Service - ₹450 / Acre Slot Booking")
            put("title_te", "డ్రోన్ పురుగుమందు పిచికారీ - ఎకరానికి ₹450 మాత్రమే")
            put("desc_en", "Precision canopy spraying in 12 minutes. Save 90% water and zero manual exposure.")
            put("desc_te", "12 నిమిషాల్లో కచ్చితమైన పిచికారీ. 90% నీరు ఆదా, తక్కువ రసాయన వృధా.")
            put("sponsor_name", "Garuda Kisan Drones Network")
            put("disclosure_label", "ప్రాయోజిత సేవ / SPONSORED SERVICE")
            put("action_url", "https://smartkisan.in/partners/garuda-drones")
        }
        db.insert(TABLE_SPONSORED, null, sponsor2)

        // 6. Initial Audit Log
        val auditLog = ContentValues().apply {
            put("user_id", "system")
            put("event_type", "SYSTEM_BOOT")
            put("details", "Smart Kisan Database initialized with Tenant Row-Level Security rules.")
            put("timestamp", now)
        }
        db.insert(TABLE_AUDIT, null, auditLog)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE_AUDIT")
        db.execSQL("DROP TABLE IF EXISTS $TABLE_SPONSORED")
        db.execSQL("DROP TABLE IF EXISTS $TABLE_MARKET")
        db.execSQL("DROP TABLE IF EXISTS $TABLE_PLOTS")
        db.execSQL("DROP TABLE IF EXISTS $TABLE_FARMS")
        db.execSQL("DROP TABLE IF EXISTS $TABLE_USERS")
        onCreate(db)
    }
}
