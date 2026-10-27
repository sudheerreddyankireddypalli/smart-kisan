package com.smartkisan.app.data.model

import java.util.UUID

enum class UserRole {
    FARMER,
    ADMIN
}

data class User(
    val id: String = UUID.randomUUID().toString(),
    val phone: String,
    val name: String,
    val role: UserRole = UserRole.FARMER,
    val village: String = "Tenali, Guntur",
    val authToken: String = "jwt_token_${System.currentTimeMillis()}"
)

data class Farm(
    val id: String = UUID.randomUUID().toString(),
    val userId: String,
    val name: String,
    val surveyNo: String,
    val totalAcres: Double,
    val soilType: String,
    val waterSource: String,
    val createdAt: Long = System.currentTimeMillis()
)

data class Plot(
    val id: String = UUID.randomUUID().toString(),
    val farmId: String,
    val userId: String,
    val name: String,
    val acres: Double,
    val irrigationType: String,
    val currentCrop: String = "Paddy (వరి)",
    val createdAt: Long = System.currentTimeMillis()
)

data class MarketPrice(
    val id: String = UUID.randomUUID().toString(),
    val commodity: String,
    val marketName: String,
    val minPrice: Double,
    val modalPrice: Double,
    val maxPrice: Double,
    val source: String = "AGMARKNET (Govt of India)",
    val freshnessLabel: String = "15 mins ago",
    val isStale: Boolean = false
)

data class SponsoredItem(
    val id: String = UUID.randomUUID().toString(),
    val titleEn: String,
    val titleTe: String,
    val descEn: String,
    val descTe: String,
    val sponsorName: String,
    val disclosureLabel: String = "ప్రాయోజితం / Sponsored",
    val actionUrl: String = "https://smartkisan.in/partners"
)

data class AuditLog(
    val id: Long = 0,
    val userId: String,
    val eventType: String,
    val details: String,
    val timestamp: Long = System.currentTimeMillis()
)

data class CropProfitInput(
    val cropName: String = "Chilli (మిరప)",
    val acres: Double = 2.0,
    val expectedYieldQtl: Double = 40.0,
    val sellingPricePerQtl: Double = 18500.0,
    val seedsCost: Double = 14000.0,
    val fertilizerCost: Double = 28000.0,
    val pesticideCost: Double = 22000.0,
    val laborCost: Double = 35000.0,
    val irrigationCost: Double = 6000.0,
    val machineryCost: Double = 12000.0,
    val transportCost: Double = 8000.0
)

data class ProfitResult(
    val grossRevenue: Double,
    val totalCost: Double,
    val netProfit: Double,
    val costPerQtl: Double,
    val costPerAcre: Double,
    val breakEvenPrice: Double,
    val roiPercent: Double,
    val isProfitable: Boolean
)

enum class AppLanguage(val code: String, val label: String) {
    ENGLISH("en", "English"),
    TELUGU("te", "తెలుగు")
}

data class CropDiagnosisResult(
    val id: String = UUID.randomUUID().toString(),
    val cropName: String,
    val diseaseNameEn: String,
    val diseaseNameTe: String,
    val pathogenType: String,
    val confidencePercent: Int,
    val severity: String,
    val symptomsTe: String,
    val symptomsEn: String,
    val organicTreatmentTe: String,
    val chemicalTreatmentTe: String,
    val dosagePerAcre: String,
    val safetyWithholdingDays: Int,
    val voiceAdvisoryTe: String,
    val timestamp: Long = System.currentTimeMillis()
)

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Dashboard : Screen("dashboard")
    object Farms : Screen("farms")
    object FarmForm : Screen("farm_form")
    object PlotList : Screen("plot_list")
    object Calculator : Screen("calculator")
    object CropDoctor : Screen("crop_doctor")
    object Market : Screen("market")
    object Admin : Screen("admin")
    object Settings : Screen("settings")
}
