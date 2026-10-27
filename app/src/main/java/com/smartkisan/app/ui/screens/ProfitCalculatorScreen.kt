package com.smartkisan.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartkisan.app.data.model.AppLanguage
import com.smartkisan.app.data.model.CropProfitInput
import com.smartkisan.app.data.model.ProfitResult
import com.smartkisan.app.domain.calculator.ProfitCalculator

@Composable
fun ProfitCalculatorScreen(
    currentLanguage: AppLanguage,
    onNavigateBack: () -> Unit
) {
    val isTe = currentLanguage == AppLanguage.TELUGU

    // Inputs with realistic defaults for South Indian agricultural crops
    var cropName by remember { mutableStateOf("Teja Chilli (తేజ మిరప)") }
    var acresText by remember { mutableStateOf("2.0") }
    var yieldText by remember { mutableStateOf("40.0") }
    var pricePerQtlText by remember { mutableStateOf("18500") }

    // Itemized costs
    var seedsCostText by remember { mutableStateOf("14000") }
    var fertilizerCostText by remember { mutableStateOf("28000") }
    var pesticideCostText by remember { mutableStateOf("22000") }
    var laborCostText by remember { mutableStateOf("35000") }
    var irrigationCostText by remember { mutableStateOf("6000") }
    var machineryCostText by remember { mutableStateOf("12000") }
    var transportCostText by remember { mutableStateOf("8000") }

    var result by remember {
        mutableStateOf<ProfitResult?>(
            ProfitCalculator.calculate(
                CropProfitInput(
                    cropName = "Teja Chilli",
                    acres = 2.0,
                    expectedYieldQtl = 40.0,
                    sellingPricePerQtl = 18500.0,
                    seedsCost = 14000.0,
                    fertilizerCost = 28000.0,
                    pesticideCost = 22000.0,
                    laborCost = 35000.0,
                    irrigationCost = 6000.0,
                    machineryCost = 12000.0,
                    transportCost = 8000.0
                )
            )
        )
    }

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
                        text = if (isTe) "పంట లాభ నష్టాల గణన" else "Crop Profitability Engine",
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
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Summary Result Card (Highlighted on Top)
            if (result != null) {
                item {
                    val res = result!!
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(
                            containerColor = if (res.isProfitable) Color(0xFFE8F5E9) else Color(0xFFFFEBEE)
                        ),
                        shape = RoundedCornerShape(16.dp),
                        border = CardDefaults.outlinedCardBorder().copy(
                            brush = androidx.compose.ui.graphics.SolidColor(
                                if (res.isProfitable) Color(0xFF4CAF50) else Color(0xFFE57373)
                            )
                        )
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = if (res.isProfitable)
                                        (if (isTe) "✅ నికర లాభం (Net Profit)" else "✅ Net Profit Margin")
                                    else
                                        (if (isTe) "⚠️ నష్టం (Net Loss)" else "⚠️ Net Loss"),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp,
                                    color = if (res.isProfitable) Color(0xFF1B5E20) else Color(0xFFC62828)
                                )

                                Surface(
                                    color = if (res.isProfitable) Color(0xFF2E7D32) else Color(0xFFC62828),
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Text(
                                        text = "${res.roiPercent}% ROI",
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = "₹${res.netProfit.toInt()}",
                                fontSize = 32.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = if (res.isProfitable) Color(0xFF1B5E20) else Color(0xFFC62828)
                            )

                            Spacer(modifier = Modifier.height(12.dp))
                            HorizontalDivider(color = Color(0x33000000))
                            Spacer(modifier = Modifier.height(12.dp))

                            // Key Metrics Grid
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column {
                                    Text(if (isTe) "స్థూల రాబడి" else "Gross Revenue", fontSize = 11.sp, color = Color(0xFF616161))
                                    Text("₹${res.grossRevenue.toInt()}", fontSize = 15.sp, fontWeight = FontWeight.Bold)
                                }
                                Column {
                                    Text(if (isTe) "మొత్తం ఖర్చు" else "Total Expenses", fontSize = 11.sp, color = Color(0xFF616161))
                                    Text("₹${res.totalCost.toInt()}", fontSize = 15.sp, fontWeight = FontWeight.Bold)
                                }
                                Column {
                                    Text(if (isTe) "ఎకరానికి ఖర్చు" else "Cost / Acre", fontSize = 11.sp, color = Color(0xFF616161))
                                    Text("₹${res.costPerAcre.toInt()}", fontSize = 15.sp, fontWeight = FontWeight.Bold)
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            // Break-Even Rate Notice
                            Surface(
                                color = Color(0x22FFFFFF),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Row(
                                    modifier = Modifier.padding(8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text("🎯 ", fontSize = 14.sp)
                                    Text(
                                        text = "${if (isTe) "నష్టం రాని కనీస ధర (Break-even): " else "Break-even Selling Price: "}₹${res.breakEvenPrice.toInt()} / క్వింటాల్",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Color(0xFF37474F)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Input Form Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    shape = RoundedCornerShape(12.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = if (isTe) "ప్రాంతీయ పంటల నమూనాలు (Quick Crop Presets)" else "Standard Regional Presets",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = Color(0xFF616161)
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            listOf(
                                Triple(if (isTe) "మిరప" else "Chilli", 40.0, 18500.0),
                                Triple(if (isTe) "పత్తి" else "Cotton", 22.0, 7350.0),
                                Triple(if (isTe) "వరి" else "Paddy", 50.0, 2320.0),
                                Triple(if (isTe) "మొక్కజొన్న" else "Maize", 45.0, 2100.0)
                            ).forEach { (name, yld, rate) ->
                                AssistChip(
                                    onClick = {
                                        cropName = name
                                        yieldText = yld.toString()
                                        pricePerQtlText = rate.toInt().toString()
                                        val input = CropProfitInput(
                                            cropName = name,
                                            acres = acresText.toDoubleOrNull() ?: 2.0,
                                            expectedYieldQtl = yld,
                                            sellingPricePerQtl = rate,
                                            seedsCost = seedsCostText.toDoubleOrNull() ?: 10000.0,
                                            fertilizerCost = fertilizerCostText.toDoubleOrNull() ?: 20000.0,
                                            pesticideCost = pesticideCostText.toDoubleOrNull() ?: 15000.0,
                                            laborCost = laborCostText.toDoubleOrNull() ?: 25000.0,
                                            irrigationCost = irrigationCostText.toDoubleOrNull() ?: 5000.0,
                                            machineryCost = machineryCostText.toDoubleOrNull() ?: 8000.0,
                                            transportCost = transportCostText.toDoubleOrNull() ?: 6000.0
                                        )
                                        result = ProfitCalculator.calculate(input)
                                    },
                                    label = { Text(name, fontSize = 11.sp) }
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        Text(
                            text = if (isTe) "పంట మరియు దిగుబడి అంచనా" else "Crop & Production Details",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = Color(0xFF1B5E20)
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        OutlinedTextField(
                            value = cropName,
                            onValueChange = { cropName = it },
                            label = { Text(if (isTe) "పంట పేరు" else "Crop Name") },
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            OutlinedTextField(
                                value = acresText,
                                onValueChange = { acresText = it },
                                label = { Text(if (isTe) "విస్తీర్ణం (ఎకరాలు)" else "Acres") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                                modifier = Modifier.weight(1f),
                                singleLine = true
                            )

                            OutlinedTextField(
                                value = yieldText,
                                onValueChange = { yieldText = it },
                                label = { Text(if (isTe) "దిగుబడి (క్వింటాళ్ళు)" else "Yield (Qtl)") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                                modifier = Modifier.weight(1f),
                                singleLine = true
                            )
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        OutlinedTextField(
                            value = pricePerQtlText,
                            onValueChange = { pricePerQtlText = it },
                            label = { Text(if (isTe) "అంచనా విక్రయ ధర (క్వింటాల్‌కు ₹)" else "Selling Rate (₹ / Qtl)") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                            modifier = Modifier.fillMaxWidth(),
                            singleLine = true
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        Text(
                            text = if (isTe) "పెట్టుబడి ఖర్చుల వివరాలు (₹)" else "Operational Expenses (₹)",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = Color(0xFF1B5E20)
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        CostField(if (isTe) "విత్తనాలు" else "Seeds", seedsCostText) { seedsCostText = it }
                        CostField(if (isTe) "రసాయన & సేంద్రీయ ఎరువులు" else "Fertilizers", fertilizerCostText) { fertilizerCostText = it }
                        CostField(if (isTe) "పురుగుమందులు & సస్యరక్షణ" else "Pesticides", pesticideCostText) { pesticideCostText = it }
                        CostField(if (isTe) "కూలీల ఖర్చులు" else "Labor Wages", laborCostText) { laborCostText = it }
                        CostField(if (isTe) "నీటిపారుదల & కరెంట్ బిల్లు" else "Irrigation & Power", irrigationCostText) { irrigationCostText = it }
                        CostField(if (isTe) "ట్రాక్టర్ & యంత్రాల అద్దె" else "Machinery Rental", machineryCostText) { machineryCostText = it }
                        CostField(if (isTe) "రవాణా & మార్కెట్ ఫీజు" else "Transport & Mandi Fee", transportCostText) { transportCostText = it }

                        Spacer(modifier = Modifier.height(16.dp))

                        Button(
                            onClick = {
                                val acres = acresText.toDoubleOrNull() ?: 1.0
                                val yieldQtl = yieldText.toDoubleOrNull() ?: 0.0
                                val price = pricePerQtlText.toDoubleOrNull() ?: 0.0
                                val seeds = seedsCostText.toDoubleOrNull() ?: 0.0
                                val fertilizer = fertilizerCostText.toDoubleOrNull() ?: 0.0
                                val pesticide = pesticideCostText.toDoubleOrNull() ?: 0.0
                                val labor = laborCostText.toDoubleOrNull() ?: 0.0
                                val irrigation = irrigationCostText.toDoubleOrNull() ?: 0.0
                                val machinery = machineryCostText.toDoubleOrNull() ?: 0.0
                                val transport = transportCostText.toDoubleOrNull() ?: 0.0

                                val input = CropProfitInput(
                                    cropName = cropName,
                                    acres = acres,
                                    expectedYieldQtl = yieldQtl,
                                    sellingPricePerQtl = price,
                                    seedsCost = seeds,
                                    fertilizerCost = fertilizer,
                                    pesticideCost = pesticide,
                                    laborCost = labor,
                                    irrigationCost = irrigation,
                                    machineryCost = machinery,
                                    transportCost = transport
                                )
                                result = ProfitCalculator.calculate(input)
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(50.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B5E20)),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text(
                                text = if (isTe) "🧮 లాభ నష్టాలను పునఃసమీక్షించండి" else "🧮 Recalculate Profit Margin",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CostField(label: String, value: String, onValueChange: (String) -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(label, fontSize = 13.sp, color = Color(0xFF424242), modifier = Modifier.weight(1.2f))
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            modifier = Modifier.weight(1f),
            singleLine = true
        )
    }
}
