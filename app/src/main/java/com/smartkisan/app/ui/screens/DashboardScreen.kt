package com.smartkisan.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
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

@Composable
fun DashboardScreen(
    currentUser: User,
    farms: List<Farm>,
    marketPrices: List<MarketPrice>,
    sponsoredItems: List<SponsoredItem>,
    currentLanguage: AppLanguage,
    onLanguageToggle: () -> Unit,
    onNavigate: (Screen) -> Unit,
    onLogout: () -> Unit
) {
    val isTe = currentLanguage == AppLanguage.TELUGU
    val totalAcres = farms.sumOf { it.totalAcres }

    Scaffold(
        topBar = {
            Surface(
                color = Color(0xFF1B5E20),
                shadowElevation = 4.dp
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = if (isTe) "స్మార్ట్ కిసాన్" else "Smart Kisan",
                            color = Color.White,
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "${currentUser.name} (${if (currentUser.role == UserRole.ADMIN) "Admin" else if (isTe) "రైతు" else "Farmer"})",
                            color = Color(0xFFA5D6A7),
                            fontSize = 12.sp
                        )
                    }

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Button(
                            onClick = onLanguageToggle,
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF388E3C)),
                            shape = RoundedCornerShape(20.dp),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = if (isTe) "EN" else "తెలుగు",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }

                        Spacer(modifier = Modifier.width(8.dp))

                        IconButton(onClick = { onNavigate(Screen.Settings) }) {
                            Text("⚙️", fontSize = 18.sp)
                        }
                    }
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
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. KPI Stats Cards
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Card(
                        modifier = Modifier
                            .weight(1f)
                            .clickable { onNavigate(Screen.Farms) },
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFE8F5E9)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("🌾 " + if (isTe) "నా పొలాలు" else "My Farms", fontSize = 13.sp, color = Color(0xFF2E7D32))
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("${farms.size}", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1B5E20))
                            Text(if (isTe) "నమోదైనవి" else "Registered", fontSize = 11.sp, color = Color(0xFF66BB6A))
                        }
                    }

                    Card(
                        modifier = Modifier
                            .weight(1f)
                            .clickable { onNavigate(Screen.Farms) },
                        colors = CardDefaults.cardColors(containerColor = Color(0xFFE8F5E9)),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("📏 " + if (isTe) "మొత్తం విస్తీర్ణం" else "Total Land", fontSize = 13.sp, color = Color(0xFF2E7D32))
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("$totalAcres", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1B5E20))
                            Text(if (isTe) "ఎకరాలు" else "Acres", fontSize = 11.sp, color = Color(0xFF66BB6A))
                        }
                    }
                }
            }

            // 2. Pending Integration Banner (Requirement: Unconfigured integrations visibly identified as pending)
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF3E0)),
                    shape = RoundedCornerShape(12.dp),
                    border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Color(0xFFFFB74D)))
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.Top
                    ) {
                        Text("⏳", fontSize = 22.sp)
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = if (isTe) "పెండింగ్ అనుసంధానం" else "UNCONFIGURED INTEGRATION",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFFE65100),
                                    modifier = Modifier
                                        .background(Color(0xFFFFE0B2), RoundedCornerShape(4.dp))
                                        .padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("• " + if (isTe) "ఆఫ్‌లైన్ మోడ్" else "Offline Fallback", fontSize = 11.sp, color = Color(0xFFBF360C))
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = if (isTe)
                                    "నేల తేమ & NPK IoT సెన్సార్ గేట్‌వే ఇంకా కాన్ఫిగర్ కాలేదు. సిస్టమ్ మాన్యువల్ రికార్డులను ఉపయోగిస్తోంది."
                                else
                                    "Soil Moisture & NPK IoT Gateway not configured. System is operating in offline manual soil profile mode.",
                                fontSize = 12.sp,
                                color = Color(0xFF5D4037)
                            )
                        }
                    }
                }
            }

            // 3. Multimodal AI Crop Doctor Banner Feature
            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onNavigate(Screen.CropDoctor) },
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFE8F5E9)),
                    shape = RoundedCornerShape(14.dp),
                    border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Color(0xFF66BB6A)))
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("🩺", fontSize = 32.sp)
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = if (isTe) "ఏఐ క్రాప్ డాక్టర్" else "AI Crop Doctor",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF1B5E20)
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "AI 94%",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White,
                                    modifier = Modifier
                                        .background(Color(0xFF2E7D32), RoundedCornerShape(4.dp))
                                        .padding(horizontal = 5.dp, vertical = 1.dp)
                                )
                            }
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = if (isTe)
                                    "ఆకు ఫోటో స్కాన్ చేసి తెగుళ్లను గుర్తించండి & తెలుగులో వాయిస్ సలహా వినండి"
                                else
                                    "Scan leaf photo for instant pest diagnosis & Telugu audio advisory",
                                fontSize = 11.sp,
                                color = Color(0xFF33691E)
                            )
                        }
                        Text("➔", fontSize = 18.sp, color = Color(0xFF2E7D32), fontWeight = FontWeight.Bold)
                    }
                }
            }

            // 4. Quick Action Hub
            item {
                Text(
                    text = if (isTe) "త్వరిత సేవలు" else "Quick Actions",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF212121)
                )
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = { onNavigate(Screen.Farms) },
                        modifier = Modifier
                            .weight(1f)
                            .height(54.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text(if (isTe) "🌱 నా పొలాలు" else "🌱 My Farms", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    }

                    Button(
                        onClick = { onNavigate(Screen.Calculator) },
                        modifier = Modifier
                            .weight(1f)
                            .height(54.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B5E20)),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text(if (isTe) "🧮 లాభ నష్టాలు" else "🧮 Profit Calc", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = { onNavigate(Screen.Market) },
                        modifier = Modifier
                            .weight(1f)
                            .height(48.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF00695C)),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text(if (isTe) "📊 మార్కెట్ మండి ధరలు" else "📊 Mandi Prices", fontSize = 13.sp)
                    }

                    if (currentUser.role == UserRole.ADMIN) {
                        Button(
                            onClick = { onNavigate(Screen.Admin) },
                            modifier = Modifier
                                .weight(1f)
                                .height(48.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF455A64)),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text(if (isTe) "🛡️ అడ్మిన్ పోర్టల్" else "🛡️ Admin Portal", fontSize = 13.sp)
                        }
                    }
                }
            }

            // 4. Clearly Labeled Sponsored Content (Requirement: Sponsored content is clearly labeled)
            item {
                Text(
                    text = if (isTe) "భాగస్వామ్య వ్యవసాయ ఆఫర్లు" else "Partner Agri Offers",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF212121)
                )
            }

            items(sponsoredItems) { item ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFFFDE7)),
                    shape = RoundedCornerShape(12.dp),
                    border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Color(0xFFFBC02D)))
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "🏷️ ${item.disclosureLabel}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color(0xFFB78103),
                                modifier = Modifier
                                    .background(Color(0xFFFFF9C4), RoundedCornerShape(4.dp))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                            Text(
                                text = item.sponsorName,
                                fontSize = 11.sp,
                                color = Color(0xFF5D4037),
                                fontWeight = FontWeight.Medium
                            )
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = if (isTe) item.titleTe else item.titleEn,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF212121)
                        )

                        Spacer(modifier = Modifier.height(4.dp))

                        Text(
                            text = if (isTe) item.descTe else item.descEn,
                            fontSize = 12.sp,
                            color = Color(0xFF424242),
                            lineHeight = 18.sp
                        )
                    }
                }
            }

            // 5. External Market Data with Source & Freshness (Requirement: External data shows source and freshness information)
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (isTe) "మండి ధరల సరళి" else "Live Mandi Rates",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF212121)
                    )

                    Text(
                        text = if (isTe) "అన్నీ చూడండి →" else "View All →",
                        fontSize = 12.sp,
                        color = Color(0xFF1B5E20),
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.clickable { onNavigate(Screen.Market) }
                    )
                }
            }

            items(marketPrices.take(2)) { mp ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            Column {
                                Text(mp.commodity, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                Text(mp.marketName, fontSize = 11.sp, color = Color(0xFF757575))
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text("₹${mp.modalPrice.toInt()} / క్వింటాల్", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color(0xFF1B5E20))
                                Text("₹${mp.minPrice.toInt()} - ₹${mp.maxPrice.toInt()}", fontSize = 11.sp, color = Color(0xFF616161))
                            }
                        }

                        HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = Color(0xFFEEEEEE))

                        // Provenance & Freshness Bar
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "🏛️ ${mp.source}",
                                fontSize = 10.sp,
                                color = Color(0xFF0277BD),
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                text = "⏱️ ${mp.freshnessLabel}",
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
