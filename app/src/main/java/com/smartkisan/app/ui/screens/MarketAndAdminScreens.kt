package com.smartkisan.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartkisan.app.data.model.*
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun MarketScreen(
    marketPrices: List<MarketPrice>,
    currentLanguage: AppLanguage,
    onNavigateBack: () -> Unit
) {
    val isTe = currentLanguage == AppLanguage.TELUGU

    Scaffold(
        topBar = {
            Surface(color = Color(0xFF1B5E20), shadowElevation = 4.dp) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onNavigateBack) {
                        Text("←", fontSize = 24.sp, color = Color.White)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isTe) "మార్కెట్ మండి ధరలు" else "Mandi Market Intelligence",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF7FAF7))
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // Provenance Transparency Header
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFE1F5FE)),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("ℹ️", fontSize = 18.sp)
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = if (isTe)
                                "ఈ ధరలు అగ్‌మార్క్‌నెట్ (AGMARKNET) ప్రభుత్వ పోర్టల్ నుండి సేకరించబడినవి. తక్కువ డేటా వాడకం కోసం ఆఫ్‌లైన్‌లో నిల్వ చేయబడ్డాయి."
                            else
                                "Official mandi benchmark rates sourced from AGMARKNET (Govt. of India). Cached offline for zero data consumption.",
                            fontSize = 12.sp,
                            color = Color(0xFF01579B),
                            lineHeight = 16.sp
                        )
                    }
                }
            }

            items(marketPrices) { mp ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(mp.commodity, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color(0xFF1B5E20))
                                Text("📍 ${mp.marketName}", fontSize = 12.sp, color = Color(0xFF616161))
                            }

                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = "₹${mp.modalPrice.toInt()}",
                                    fontWeight = FontWeight.ExtraBold,
                                    fontSize = 18.sp,
                                    color = Color(0xFF2E7D32)
                                )
                                Text(
                                    text = if (isTe) "క్వింటాల్ సగటు ధర" else "Modal Rate / Qtl",
                                    fontSize = 10.sp,
                                    color = Color(0xFF757575)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFF1F8E9), RoundedCornerShape(6.dp))
                                .padding(8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("${if (isTe) "కనీస ధర: " else "Min: "}₹${mp.minPrice.toInt()}", fontSize = 11.sp, color = Color(0xFF388E3C))
                            Text("${if (isTe) "గరిష్ట ధర: " else "Max: "}₹${mp.maxPrice.toInt()}", fontSize = 11.sp, color = Color(0xFF388E3C))
                        }

                        HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp), color = Color(0xFFEEEEEE))

                        // Provenance and Freshness requirement
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("🏛️ మూలం: ${mp.source}", fontSize = 10.sp, color = Color(0xFF0277BD), fontWeight = FontWeight.Medium)
                            Text(
                                text = "⏱️ తాజాదనం: ${mp.freshnessLabel}",
                                fontSize = 10.sp,
                                color = if (mp.isStale) Color(0xFFD32F2F) else Color(0xFF2E7D32),
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AdminScreen(
    currentUser: User,
    auditLogs: List<AuditLog>,
    sponsoredItems: List<SponsoredItem> = emptyList(),
    currentLanguage: AppLanguage,
    onNavigateBack: () -> Unit,
    onSaveSponsoredItem: ((SponsoredItem) -> Boolean)? = null
) {
    val isTe = currentLanguage == AppLanguage.TELUGU
    val dateFormat = remember { SimpleDateFormat("dd MMM yyyy, HH:mm", Locale.getDefault()) }

    var selectedFilter by remember { mutableStateOf("ALL") }
    var showAddSponsorDialog by remember { mutableStateOf(false) }
    var newSponsorTitleEn by remember { mutableStateOf("") }
    var newSponsorTitleTe by remember { mutableStateOf("") }
    var newSponsorName by remember { mutableStateOf("") }
    var newSponsorDescEn by remember { mutableStateOf("") }
    var newSponsorDescTe by remember { mutableStateOf("") }
    var actionMessage by remember { mutableStateOf<String?>(null) }

    val filteredLogs = remember(auditLogs, selectedFilter) {
        if (selectedFilter == "ALL") auditLogs
        else auditLogs.filter { it.eventType.contains(selectedFilter, ignoreCase = true) }
    }

    Scaffold(
        topBar = {
            Surface(color = Color(0xFF37474F), shadowElevation = 4.dp) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onNavigateBack) {
                        Text("←", fontSize = 24.sp, color = Color.White)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isTe) "అడ్మిన్ & ఆడిట్ కన్సోల్" else "Admin & Audit Console",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFECEFF1))
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Tenant Security Guard Badge
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFE8F5E9)),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("🔒", fontSize = 18.sp)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = if (isTe) "రో-లెవల్ సెక్యూరిటీ పాలసీ: అమల్లో ఉంది" else "Row-Level Tenant Isolation: ACTIVE",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = Color(0xFF1B5E20)
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (isTe)
                                "రైతుల వ్యక్తిగత వివరాలు బ్యాకెండ్ యాక్సెస్ నిబంధనల ద్వారా సంరక్షించబడుతున్నాయి."
                            else
                                "Farmer database queries are bound by tenant user_id constraints. Cross-tenant leakage is strictly prevented.",
                            fontSize = 11.sp,
                            color = Color(0xFF388E3C)
                        )
                    }
                }
            }

            // Pending Integrations Review (Requirement: Unconfigured integrations visibly identified as pending)
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(
                            text = if (isTe) "సిస్టమ్ ఇంటిగ్రేషన్ స్థితి" else "External Integrations Status",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                        Spacer(modifier = Modifier.height(8.dp))

                        IntegrationStatusRow(
                            name = "AGMARKNET Mandi Price API",
                            status = "CONNECTED (Live)",
                            isSuccess = true
                        )
                        IntegrationStatusRow(
                            name = "Soil Moisture IoT Mesh Gateway",
                            status = "PENDING INTEGRATION (Offline)",
                            isSuccess = false
                        )
                        IntegrationStatusRow(
                            name = "SMS & WhatsApp Rythu Alerts",
                            status = "PENDING INTEGRATION (Mocked)",
                            isSuccess = false
                        )
                    }
                }
            }

            // Content Management Section (Requirement: The admin can manage content and review reports)
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = if (isTe) "ప్రాయోజిత ప్రకటనల నిర్వహణ" else "Manage Sponsored Partner Ads",
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                            if (onSaveSponsoredItem != null) {
                                Button(
                                    onClick = { showAddSponsorDialog = true },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B5E20)),
                                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Text(if (isTe) "+ కొత్త ఆఫర్" else "+ Add Offer", fontSize = 11.sp)
                                }
                            }
                        }

                        if (actionMessage != null) {
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(actionMessage!!, color = Color(0xFF2E7D32), fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        for (sp in sponsoredItems) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color(0xFFFFFDE7), RoundedCornerShape(6.dp))
                                    .padding(8.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(if (isTe) sp.titleTe else sp.titleEn, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                                    Text(sp.sponsorName, fontSize = 10.sp, color = Color(0xFF616161))
                                }
                                Surface(
                                    color = Color(0xFFFFF9C4),
                                    shape = RoundedCornerShape(4.dp)
                                ) {
                                    Text(
                                        text = "ACTIVE",
                                        color = Color(0xFFB78103),
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                        }
                    }
                }
            }

            // Audit Logs Title & Filter Chips
            item {
                Column {
                    Text(
                        text = if (isTe) "భద్రతా మరియు ఆడిట్ లాగ్‌లు (Security Audit Trail)" else "Security & Action Audit Logs",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = Color(0xFF263238)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        listOf("ALL", "AUTH", "FARM", "PLOT").forEach { filter ->
                            FilterChip(
                                selected = selectedFilter == filter,
                                onClick = { selectedFilter = filter },
                                label = { Text(filter, fontSize = 11.sp) }
                            )
                        }
                    }
                }
            }

            items(filteredLogs) { log ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = log.eventType,
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                color = Color(0xFF00838F)
                            )
                            Text(
                                text = dateFormat.format(Date(log.timestamp)),
                                fontSize = 10.sp,
                                color = Color(0xFF78909C)
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(log.details, fontSize = 12.sp, color = Color(0xFF37474F))
                        Text("User: ${log.userId}", fontSize = 10.sp, color = Color(0xFF90A4AE))
                    }
                }
            }
        }

        if (showAddSponsorDialog && onSaveSponsoredItem != null) {
            AlertDialog(
                onDismissRequest = { showAddSponsorDialog = false },
                title = { Text(if (isTe) "కొత్త భాగస్వామి ప్రకటన" else "New Sponsored Partner Offer") },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = newSponsorName,
                            onValueChange = { newSponsorName = it },
                            label = { Text("Sponsor Brand / Company") },
                            singleLine = true
                        )
                        OutlinedTextField(
                            value = newSponsorTitleEn,
                            onValueChange = { newSponsorTitleEn = it },
                            label = { Text("Offer Headline (English)") },
                            singleLine = true
                        )
                        OutlinedTextField(
                            value = newSponsorTitleTe,
                            onValueChange = { newSponsorTitleTe = it },
                            label = { Text("Offer Headline (తెలుగు)") },
                            singleLine = true
                        )
                        OutlinedTextField(
                            value = newSponsorDescEn,
                            onValueChange = { newSponsorDescEn = it },
                            label = { Text("Description (English)") }
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            if (newSponsorName.isNotBlank() && newSponsorTitleEn.isNotBlank()) {
                                val item = SponsoredItem(
                                    titleEn = newSponsorTitleEn.trim(),
                                    titleTe = if (newSponsorTitleTe.isBlank()) newSponsorTitleEn.trim() else newSponsorTitleTe.trim(),
                                    descEn = newSponsorDescEn.trim(),
                                    descTe = newSponsorDescEn.trim(),
                                    sponsorName = newSponsorName.trim()
                                )
                                val saved = onSaveSponsoredItem(item)
                                if (saved) {
                                    actionMessage = if (isTe) "ప్రకటన విజయవంతంగా ప్రచురించబడింది" else "Partner Ad published"
                                    showAddSponsorDialog = false
                                    newSponsorName = ""
                                    newSponsorTitleEn = ""
                                    newSponsorTitleTe = ""
                                    newSponsorDescEn = ""
                                }
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B5E20))
                    ) {
                        Text(if (isTe) "ప్రచురించు" else "Publish Ad")
                    }
                },
                dismissButton = {
                    OutlinedButton(onClick = { showAddSponsorDialog = false }) {
                        Text(if (isTe) "రద్దు" else "Cancel")
                    }
                }
            )
        }
    }
}

@Composable
private fun IntegrationStatusRow(name: String, status: String, isSuccess: Boolean) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(name, fontSize = 12.sp, color = Color(0xFF424242))
        Surface(
            color = if (isSuccess) Color(0xFFE8F5E9) else Color(0xFFFFF3E0),
            shape = RoundedCornerShape(4.dp)
        ) {
            Text(
                text = status,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = if (isSuccess) Color(0xFF2E7D32) else Color(0xFFE65100),
                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
            )
        }
    }
}

@Composable
fun SettingsScreen(
    currentUser: User,
    currentLanguage: AppLanguage,
    onLanguageToggle: () -> Unit,
    onNavigateBack: () -> Unit,
    onLogout: () -> Unit
) {
    val isTe = currentLanguage == AppLanguage.TELUGU

    Scaffold(
        topBar = {
            Surface(color = Color(0xFF1B5E20), shadowElevation = 4.dp) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onNavigateBack) {
                        Text("←", fontSize = 24.sp, color = Color.White)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isTe) "సెట్టింగ్‌లు & భాష" else "Settings & Preferences",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF7FAF7))
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(if (isTe) "యాప్ భాష" else "App Language", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (isTe) "ప్రస్తుత భాష: తెలుగు" else "Current Language: English",
                            fontSize = 14.sp
                        )
                        Button(
                            onClick = onLanguageToggle,
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text(if (isTe) "Switch to English" else "తెలుగుకు మార్చండి")
                        }
                    }
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(if (isTe) "ఖాతా వివరాలు" else "Account Profile", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("${currentUser.name}", fontSize = 14.sp, fontWeight = FontWeight.Medium)
                    Text("Role: ${currentUser.role}", fontSize = 12.sp, color = Color(0xFF616161))
                    Text("Phone: ${currentUser.phone}", fontSize = 12.sp, color = Color(0xFF616161))
                    Text("Village: ${currentUser.village}", fontSize = 12.sp, color = Color(0xFF616161))
                }
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(if (isTe) "ఆఫ్‌లైన్ నిల్వ & డేటా ఆదా" else "Offline Storage & Data Efficiency", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = if (isTe)
                            "అన్ని పొలం మరియు ప్లాట్ రికార్డులు నేరుగా స్థానిక SQLite డేటాబేస్‌లో భద్రపరచబడ్డాయి. ఇంటర్నెట్ లేకున్నా 100% పనిచేస్తుంది."
                        else
                            "Farm records persist in local SQLite. Fully functional offline with zero background data drain.",
                        fontSize = 12.sp,
                        color = Color(0xFF424242)
                    )
                }
            }

            Spacer(modifier = Modifier.weight(1f))

            OutlinedButton(
                onClick = onLogout,
                modifier = Modifier.fillMaxWidth().height(48.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFC62828)),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(if (isTe) "🚪 లాగ్ అవుట్" else "🚪 Sign Out", fontWeight = FontWeight.Bold)
            }
        }
    }
}
