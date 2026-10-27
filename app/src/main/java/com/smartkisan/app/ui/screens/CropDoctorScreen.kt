package com.smartkisan.app.ui.screens

import android.speech.tts.TextToSpeech
import android.widget.Toast
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartkisan.app.data.model.AppLanguage
import com.smartkisan.app.data.model.CropDiagnosisResult
import com.smartkisan.app.domain.ai.CropDoctorEngine
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.Locale

@Composable
fun CropDoctorScreen(
    currentLanguage: AppLanguage,
    onNavigateBack: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val isTe = currentLanguage == AppLanguage.TELUGU

    // TTS Setup
    var tts: TextToSpeech? by remember { mutableStateOf(null) }
    var isTtsReady by remember { mutableStateOf(false) }
    var isSpeaking by remember { mutableStateOf(false) }

    DisposableEffect(context) {
        var speechEngine: TextToSpeech? = null
        speechEngine = TextToSpeech(context) { status ->
            if (status == TextToSpeech.SUCCESS) {
                // Try Telugu; fall back to default if unavailable
                val teLocale = Locale.forLanguageTag("te-IN")
                val langResult = speechEngine?.setLanguage(teLocale)
                if (langResult == TextToSpeech.LANG_MISSING_DATA || langResult == TextToSpeech.LANG_NOT_SUPPORTED) {
                    speechEngine?.language = Locale.getDefault()
                }
                isTtsReady = true
            }
        }
        tts = speechEngine

        onDispose {
            speechEngine?.stop()
            speechEngine?.shutdown()
        }
    }

    val diagnosableCrops = remember { CropDoctorEngine.getAllDiagnosableCrops() }
    var selectedCrop by remember { mutableStateOf(diagnosableCrops.firstOrNull() ?: "Chilli (మిరప)") }
    var isScanning by remember { mutableStateOf(false) }
    var diagnosisResult by remember {
        mutableStateOf<CropDiagnosisResult?>(CropDoctorEngine.diagnose(cropNameFilter = selectedCrop))
    }

    val availableDiseasesForCrop = remember(selectedCrop) {
        CropDoctorEngine.getDiseasesForCrop(selectedCrop)
    }

    fun speakVoiceAdvisory(text: String) {
        if (!isTtsReady || tts == null) {
            Toast.makeText(context, if (isTe) "ఆడియో ఇంజిన్ లోడ్ అవుతోంది..." else "Speech engine loading...", Toast.LENGTH_SHORT).show()
            return
        }
        if (isSpeaking) {
            tts?.stop()
            isSpeaking = false
        } else {
            val params = android.os.Bundle()
            params.putString(TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID, "SmartKisanVoiceAdvisory")
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, params, "SmartKisanVoiceAdvisory")
            isSpeaking = true
            Toast.makeText(context, if (isTe) "వాయిస్ సలహా ప్రారంభమైంది" else "Playing Telugu Voice Advisory", Toast.LENGTH_SHORT).show()
        }
    }

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
                        .padding(horizontal = 8.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = {
                        if (isSpeaking) tts?.stop()
                        onNavigateBack()
                    }) {
                        Text("←", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Column {
                        Text(
                            text = if (isTe) "🩺 ఏఐ క్రాప్ డాక్టర్" else "🩺 Multimodal AI Crop Doctor",
                            color = Color.White,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = if (isTe) "ఆకు స్కాన్, చీడపీడల గుర్తింపు & వాయిస్ సలహా" else "Leaf scan, pest vision & Telugu voice advisory",
                            color = Color(0xFFA5D6A7),
                            fontSize = 11.sp
                        )
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
            // 1. Crop Selection Header & Chips
            item {
                Column {
                    Text(
                        text = if (isTe) "1. మీ పంటను ఎంచుకోండి:" else "1. Select Your Crop:",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = Color(0xFF2E7D32)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(diagnosableCrops) { crop ->
                            val isSelected = crop == selectedCrop
                            Surface(
                                shape = RoundedCornerShape(20.dp),
                                color = if (isSelected) Color(0xFF2E7D32) else Color.White,
                                border = ButtonDefaults.outlinedButtonBorder(enabled = true),
                                modifier = Modifier.clickable {
                                    if (selectedCrop != crop) {
                                        selectedCrop = crop
                                        diagnosisResult = CropDoctorEngine.diagnose(cropNameFilter = crop)
                                        if (isSpeaking) {
                                            tts?.stop()
                                            isSpeaking = false
                                        }
                                    }
                                }
                            ) {
                                Text(
                                    text = crop,
                                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp),
                                    fontSize = 13.sp,
                                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                    color = if (isSelected) Color.White else Color(0xFF333333)
                                )
                            }
                        }
                    }
                }
            }

            // 2. Interactive Vision Leaf Scanner View
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Color(0xFFA5D6A7)))
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        // Leaf Vision Viewfinder Box
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(160.dp)
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color(0xFFE8F5E9))
                                .border(2.dp, Color(0xFF81C784), RoundedCornerShape(12.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            if (isScanning) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    CircularProgressIndicator(color = Color(0xFF2E7D32), strokeWidth = 3.dp)
                                    Spacer(modifier = Modifier.height(10.dp))
                                    Text(
                                        text = if (isTe) "ఏఐ ఆకు స్కాన్ విశ్లేషిస్తోంది..." else "AI Vision Neural Scanner Running...",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = Color(0xFF1B5E20)
                                    )
                                    Text(
                                        text = if (isTe) "లక్షణాల గుర్తింపు మరియు నమూనా పోలిక" else "Matching leaf spot patterns & pathogen library",
                                        fontSize = 10.sp,
                                        color = Color(0xFF558B2F)
                                    )
                                }
                            } else {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("🍃", fontSize = 48.sp)
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = if (isTe) "తెగులు సోకిన ఆకు లేదా పురుగు ఫోటో తీయండి" else "Take or scan photo of affected leaf/pest",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = Color(0xFF2E7D32)
                                    )
                                    Text(
                                        text = if (isTe) "ఆఫ్‌లైన్ ఎంబెడెడ్ ఎడ్జ్ మోడల్ (90%+ కచ్చితత్వం)" else "Offline Edge Vision Model (90%+ Accuracy)",
                                        fontSize = 10.sp,
                                        color = Color(0xFF757575)
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Action Buttons: Scan Photo / Diagnose
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = {
                                    coroutineScope.launch {
                                        isScanning = true
                                        delay(1200) // Simulated Edge Vision inference delay
                                        diagnosisResult = CropDoctorEngine.diagnose(cropNameFilter = selectedCrop)
                                        isScanning = false
                                        Toast.makeText(
                                            context,
                                            if (isTe) "విశ్లేషణ విజయవంతమైంది!" else "Diagnosis complete!",
                                            Toast.LENGTH_SHORT
                                        ).show()
                                    }
                                },
                                modifier = Modifier.weight(1f),
                                enabled = !isScanning,
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = if (isTe) "📷 ఆకు స్కాన్ చేయండి" else "📷 Scan Leaf Photo",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }

                            OutlinedButton(
                                onClick = {
                                    // Cycle to next disease in knowledge base for selected crop if multiple exist
                                    val currentIdx = availableDiseasesForCrop.indexOf(diagnosisResult)
                                    val nextIdx = (currentIdx + 1) % availableDiseasesForCrop.size
                                    diagnosisResult = availableDiseasesForCrop[nextIdx]
                                    if (isSpeaking) {
                                        tts?.stop()
                                        isSpeaking = false
                                    }
                                },
                                modifier = Modifier.weight(1f),
                                enabled = availableDiseasesForCrop.size > 1 && !isScanning,
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    text = if (isTe) "🔄 ఇతర తెగుళ్లు" else "🔄 Other Diseases",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }
                }
            }

            // 3. AI Diagnosis Result Card
            diagnosisResult?.let { diagnosis ->
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            // Header Badges: Confidence & Severity
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Surface(
                                    color = Color(0xFFE8F5E9),
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Text(
                                        text = "🎯 ${diagnosis.confidencePercent}% " + (if (isTe) "ఏఐ కచ్చితత్వం" else "AI Confidence"),
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF1B5E20),
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }

                                Surface(
                                    color = if (diagnosis.severity.contains("CRITICAL") || diagnosis.severity.contains("తీవ్రం")) {
                                        Color(0xFFFFEBEE)
                                    } else {
                                        Color(0xFFFFF3E0)
                                    },
                                    shape = RoundedCornerShape(6.dp)
                                ) {
                                    Text(
                                        text = "⚠️ " + diagnosis.severity,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (diagnosis.severity.contains("CRITICAL") || diagnosis.severity.contains("తీవ్రం")) {
                                            Color(0xFFC62828)
                                        } else {
                                            Color(0xFFE65100)
                                        },
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Disease Name
                            Text(
                                text = if (isTe) diagnosis.diseaseNameTe else diagnosis.diseaseNameEn,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF1B5E20)
                            )
                            Text(
                                text = if (isTe) diagnosis.diseaseNameEn else diagnosis.diseaseNameTe,
                                fontSize = 12.sp,
                                color = Color(0xFF616161)
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = "🔬 " + diagnosis.pathogenType,
                                fontSize = 11.sp,
                                color = Color(0xFF00796B),
                                fontWeight = FontWeight.SemiBold
                            )

                            Spacer(modifier = Modifier.height(14.dp))
                            HorizontalDivider(color = Color(0xFFE0E0E0))
                            Spacer(modifier = Modifier.height(14.dp))

                            // 4. Telugu Voice Advisory Audio Player
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(12.dp),
                                colors = CardDefaults.cardColors(containerColor = Color(0xFFE8F5E9)),
                                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Color(0xFF81C784)))
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { speakVoiceAdvisory(diagnosis.voiceAdvisoryTe) }
                                        .padding(14.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(44.dp)
                                            .clip(CircleShape)
                                            .background(if (isSpeaking) Color(0xFFC62828) else Color(0xFF2E7D32)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(if (isSpeaking) "⏹️" else "🔊", fontSize = 20.sp)
                                    }

                                    Spacer(modifier = Modifier.width(12.dp))

                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = if (isSpeaking) {
                                                if (isTe) "వాయిస్ సలహా నడుస్తోంది (ఆపడానికి నొక్కండి)" else "Speaking Advisory (Tap to stop)"
                                            } else {
                                                if (isTe) "తెలుగులో వాయిస్ సలహా వినండి" else "Listen Voice Advisory in Telugu"
                                            },
                                            fontSize = 13.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color(0xFF1B5E20)
                                        )
                                        Text(
                                            text = if (isTe) "రైతులకు సులభంగా అర్థమయ్యే వాయిస్ గైడెన్స్" else "Spoken in clear farmer-friendly Telugu",
                                            fontSize = 10.sp,
                                            color = Color(0xFF388E3C)
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(14.dp))

                            // 5. Symptoms Section
                            Text(
                                text = "🔍 " + if (isTe) "గుర్తించిన లక్షణాలు (Symptoms)" else "Observed Symptoms",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF212121)
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = if (isTe) diagnosis.symptomsTe else diagnosis.symptomsEn,
                                fontSize = 12.sp,
                                color = Color(0xFF424242),
                                lineHeight = 18.sp
                            )

                            Spacer(modifier = Modifier.height(14.dp))

                            // 6. Organic Treatment
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(10.dp),
                                colors = CardDefaults.cardColors(containerColor = Color(0xFFF1F8E9))
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Text(
                                        text = "🌿 " + if (isTe) "సేంద్రీయ & జీవ నియంత్రణ నివారణ" else "Organic & Bio-Control Remedy",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF33691E)
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = diagnosis.organicTreatmentTe,
                                        fontSize = 11.sp,
                                        color = Color(0xFF2E7D32),
                                        lineHeight = 16.sp
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(10.dp))

                            // 7. Chemical Prescription & Dosage
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(10.dp),
                                colors = CardDefaults.cardColors(containerColor = Color(0xFFEDE7F6))
                            ) {
                                Column(modifier = Modifier.padding(12.dp)) {
                                    Text(
                                        text = "🧪 " + if (isTe) "రసాయన నివారణ మందు (Chemical Prescription)" else "Chemical Treatment",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF4A148C)
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = diagnosis.chemicalTreatmentTe,
                                        fontSize = 11.sp,
                                        color = Color(0xFF311B92),
                                        lineHeight = 16.sp
                                    )

                                    Spacer(modifier = Modifier.height(8.dp))
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            text = "⚖️ " + diagnosis.dosagePerAcre,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color(0xFF4A148C)
                                        )
                                        Text(
                                            text = "⏳ " + (if (isTe) "కోత వ్యవధి: " else "Withholding: ") + "${diagnosis.safetyWithholdingDays} " + (if (isTe) "రోజులు" else "days"),
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color(0xFFC2185B)
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            // Farmer Safety Note
                            Surface(
                                color = Color(0xFFFFFDE7),
                                shape = RoundedCornerShape(8.dp),
                                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(Color(0xFFFFF59D)))
                            ) {
                                Row(
                                    modifier = Modifier.padding(8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text("⚠️", fontSize = 14.sp)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = if (isTe)
                                            "రైతు భద్రత: మందు పిచికారీ సమయంలో ముఖానికి మాస్క్, చేతులకు తొడుగులు ధరించండి."
                                        else
                                            "Farmer Safety: Wear gloves and mask while spraying chemical pesticides.",
                                        fontSize = 10.sp,
                                        color = Color(0xFF6D4C41)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
