package com.smartkisan.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import com.smartkisan.app.data.db.DatabaseRepository
import com.smartkisan.app.data.model.*
import com.smartkisan.app.ui.screens.*
import com.smartkisan.app.ui.theme.SmartKisanTheme

class MainActivity : ComponentActivity() {

    private lateinit var repository: DatabaseRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        repository = (application as SmartKisanApplication).repository

        setContent {
            SmartKisanTheme {
                SmartKisanApp(repository = repository)
            }
        }
    }
}

@Composable
fun SmartKisanApp(repository: DatabaseRepository) {
    var currentLanguage by remember { mutableStateOf(AppLanguage.TELUGU) }
    var currentUser by remember {
        // Pre-authenticate with Demo Farmer for instantaneous verification
        mutableStateOf<User?>(
            repository.authenticate("9876543210", "1234", UserRole.FARMER)
        )
    }

    var currentScreen by remember {
        mutableStateOf<Screen>(if (currentUser != null) Screen.Dashboard else Screen.Login)
    }

    var selectedFarmForEdit by remember { mutableStateOf<Farm?>(null) }
    var selectedFarmForPlots by remember { mutableStateOf<Farm?>(null) }

    // Live state loaded from SQLite
    var farms by remember { mutableStateOf(emptyList<Farm>()) }
    var plots by remember { mutableStateOf(emptyList<Plot>()) }
    var marketPrices by remember { mutableStateOf(emptyList<MarketPrice>()) }
    var sponsoredItems by remember { mutableStateOf(emptyList<SponsoredItem>()) }
    var auditLogs by remember { mutableStateOf(emptyList<AuditLog>()) }

    fun refreshData() {
        marketPrices = repository.getMarketPrices()
        sponsoredItems = repository.getSponsoredItems()

        val user = currentUser
        if (user != null) {
            farms = repository.getFarms(user)
            if (selectedFarmForPlots != null) {
                plots = repository.getPlotsForFarm(user, selectedFarmForPlots!!.id)
            }
            if (user.role == UserRole.ADMIN) {
                auditLogs = repository.getAuditLogs(user)
            }
        } else {
            farms = emptyList()
            plots = emptyList()
            auditLogs = emptyList()
        }
    }

    LaunchedEffect(currentUser, selectedFarmForPlots) {
        refreshData()
    }

    val toggleLanguage: () -> Unit = {
        currentLanguage = if (currentLanguage == AppLanguage.TELUGU) {
            AppLanguage.ENGLISH
        } else {
            AppLanguage.TELUGU
        }
    }

    // Handle back button
    BackHandler(enabled = currentScreen != Screen.Dashboard && currentScreen != Screen.Login) {
        when (currentScreen) {
            Screen.PlotList -> currentScreen = Screen.Farms
            Screen.FarmForm -> currentScreen = Screen.Farms
            else -> currentScreen = Screen.Dashboard
        }
    }

    when (val screen = currentScreen) {
        Screen.Login -> {
            LoginScreen(
                currentLanguage = currentLanguage,
                onLanguageToggle = toggleLanguage,
                onLoginSuccess = { user ->
                    currentUser = user
                    currentScreen = Screen.Dashboard
                    refreshData()
                },
                onAuthenticate = { phone, pin, role ->
                    repository.authenticate(phone, pin, role)
                }
            )
        }

        Screen.Dashboard -> {
            val user = currentUser ?: return
            DashboardScreen(
                currentUser = user,
                farms = farms,
                marketPrices = marketPrices,
                sponsoredItems = sponsoredItems,
                currentLanguage = currentLanguage,
                onLanguageToggle = toggleLanguage,
                onNavigate = { dest ->
                    currentScreen = dest
                    refreshData()
                },
                onLogout = {
                    currentUser = null
                    currentScreen = Screen.Login
                }
            )
        }

        Screen.Farms -> {
            val user = currentUser ?: return
            FarmListScreen(
                currentUser = user,
                farms = farms,
                currentLanguage = currentLanguage,
                onNavigateBack = { currentScreen = Screen.Dashboard },
                onNavigateToAddFarm = {
                    selectedFarmForEdit = null
                    currentScreen = Screen.FarmForm
                },
                onNavigateToEditFarm = { farm ->
                    selectedFarmForEdit = farm
                    currentScreen = Screen.FarmForm
                },
                onNavigateToPlots = { farm ->
                    selectedFarmForPlots = farm
                    plots = repository.getPlotsForFarm(user, farm.id)
                    currentScreen = Screen.PlotList
                },
                onDeleteFarm = { farmId ->
                    val deleted = repository.deleteFarm(user, farmId)
                    if (deleted) refreshData()
                    deleted
                }
            )
        }

        Screen.FarmForm -> {
            val user = currentUser ?: return
            FarmFormScreen(
                currentUser = user,
                existingFarm = selectedFarmForEdit,
                currentLanguage = currentLanguage,
                onNavigateBack = {
                    currentScreen = Screen.Farms
                    refreshData()
                },
                onSaveFarm = { farmToSave ->
                    val saved = repository.saveFarm(user, farmToSave)
                    if (saved) refreshData()
                    saved
                }
            )
        }

        Screen.PlotList -> {
            val user = currentUser ?: return
            val farm = selectedFarmForPlots ?: return
            PlotListScreen(
                currentUser = user,
                farm = farm,
                plots = plots,
                currentLanguage = currentLanguage,
                onNavigateBack = { currentScreen = Screen.Farms },
                onSavePlot = { plotToSave ->
                    val saved = repository.savePlot(user, plotToSave)
                    if (saved) refreshData()
                    saved
                },
                onDeletePlot = { plotId ->
                    val deleted = repository.deletePlot(user, plotId)
                    if (deleted) refreshData()
                    deleted
                }
            )
        }

        Screen.Calculator -> {
            ProfitCalculatorScreen(
                currentLanguage = currentLanguage,
                onNavigateBack = { currentScreen = Screen.Dashboard }
            )
        }

        Screen.CropDoctor -> {
            CropDoctorScreen(
                currentLanguage = currentLanguage,
                onNavigateBack = { currentScreen = Screen.Dashboard }
            )
        }

        Screen.Market -> {
            MarketScreen(
                marketPrices = marketPrices,
                currentLanguage = currentLanguage,
                onNavigateBack = { currentScreen = Screen.Dashboard }
            )
        }

        Screen.Admin -> {
            val user = currentUser ?: return
            AdminScreen(
                currentUser = user,
                auditLogs = auditLogs,
                sponsoredItems = sponsoredItems,
                currentLanguage = currentLanguage,
                onNavigateBack = { currentScreen = Screen.Dashboard },
                onSaveSponsoredItem = { item ->
                    val saved = repository.saveSponsoredItem(user, item)
                    if (saved) refreshData()
                    saved
                }
            )
        }

        Screen.Settings -> {
            val user = currentUser ?: return
            SettingsScreen(
                currentUser = user,
                currentLanguage = currentLanguage,
                onLanguageToggle = toggleLanguage,
                onNavigateBack = { currentScreen = Screen.Dashboard },
                onLogout = {
                    currentUser = null
                    currentScreen = Screen.Login
                }
            )
        }
    }
}
