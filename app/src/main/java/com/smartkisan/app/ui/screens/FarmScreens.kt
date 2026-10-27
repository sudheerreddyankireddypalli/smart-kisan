package com.smartkisan.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.smartkisan.app.data.model.Farm
import com.smartkisan.app.data.model.Plot
import com.smartkisan.app.data.model.User
import com.smartkisan.app.ui.state.*

@Composable
fun FarmListScreen(
    currentUser: User,
    farms: List<Farm>,
    currentLanguage: AppLanguage,
    onNavigateBack: () -> Unit,
    onNavigateToAddFarm: () -> Unit,
    onNavigateToEditFarm: (Farm) -> Unit,
    onNavigateToPlots: (Farm) -> Unit,
    onDeleteFarm: (String) -> Boolean
) {
    val isTe = currentLanguage == AppLanguage.TELUGU
    var showDeleteConfirmFor by remember { mutableStateOf<Farm?>(null) }
    var successMsg by remember { mutableStateOf<String?>(null) }
    var errorMsg by remember { mutableStateOf<String?>(null) }

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
                        text = if (isTe) "నా పొలాలు & కమతాలు" else "My Farms & Holdings",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onNavigateToAddFarm,
                containerColor = Color(0xFF1B5E20),
                contentColor = Color.White
            ) {
                Text("+", fontSize = 24.sp, fontWeight = FontWeight.Bold)
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF7FAF7))
        ) {
            Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
                if (successMsg != null) {
                    SuccessBanner(message = successMsg!!)
                    Spacer(modifier = Modifier.height(10.dp))
                }
                if (errorMsg != null) {
                    ErrorStateView(
                        message = errorMsg!!,
                        onRetry = { errorMsg = null }
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                }

                if (farms.isEmpty()) {
                    // Empty State Requirement
                    EmptyStateView(
                        title = if (isTe) "పొలాలు నమోదు కాలేదు" else "No Farms Registered Yet",
                        message = if (isTe)
                            "మీ మొదటి పొలం రికార్డును నమోదు చేసుకోవడానికి క్రింది బటన్ నొక్కండి. ఇది పూర్తిగా ఆఫ్‌లైన్‌లో భద్రపరచబడుతుంది."
                        else
                            "Create your first farm profile with acreage and soil type. All records are stored offline on this device.",
                        actionLabel = if (isTe) "+ కొత్త పొలం జోడించండి" else "+ Add New Farm",
                        onActionClick = onNavigateToAddFarm
                    )
                } else {
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        items(farms) { farm ->
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
                                            Text(
                                                text = farm.name,
                                                fontSize = 16.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = Color(0xFF1B5E20)
                                            )
                                            Text(
                                                text = "${if (isTe) "సర్వే నం: " else "Survey No: "}${farm.surveyNo}",
                                                fontSize = 12.sp,
                                                color = Color(0xFF616161)
                                            )
                                        }

                                        Surface(
                                            color = Color(0xFFE8F5E9),
                                            shape = RoundedCornerShape(8.dp)
                                        ) {
                                            Text(
                                                text = "${farm.totalAcres} " + if (isTe) "ఎకరాలు" else "Acres",
                                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                                fontSize = 12.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = Color(0xFF2E7D32)
                                            )
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(8.dp))

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                                    ) {
                                        Text("🌱 ${farm.soilType}", fontSize = 12.sp, color = Color(0xFF424242))
                                        Text("💧 ${farm.waterSource}", fontSize = 12.sp, color = Color(0xFF424242))
                                    }

                                    HorizontalDivider(modifier = Modifier.padding(vertical = 10.dp), color = Color(0xFFEEEEEE))

                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Button(
                                            onClick = { onNavigateToPlots(farm) },
                                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                                            shape = RoundedCornerShape(8.dp),
                                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                                        ) {
                                            Text(if (isTe) "ప్లాట్లు →" else "Plots →", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                                        }

                                        Row {
                                            OutlinedButton(
                                                onClick = { onNavigateToEditFarm(farm) },
                                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 2.dp)
                                            ) {
                                                Text(if (isTe) "సవరణ" else "Edit", fontSize = 11.sp)
                                            }

                                            Spacer(modifier = Modifier.width(6.dp))

                                            OutlinedButton(
                                                onClick = { showDeleteConfirmFor = farm },
                                                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFC62828)),
                                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 2.dp)
                                            ) {
                                                Text(if (isTe) "తొలగించు" else "Delete", fontSize = 11.sp)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Delete Confirmation Dialog
            if (showDeleteConfirmFor != null) {
                AlertDialog(
                    onDismissRequest = { showDeleteConfirmFor = null },
                    title = { Text(if (isTe) "పొలాన్ని తొలగించాలా?" else "Delete Farm?") },
                    text = {
                        Text(
                            if (isTe)
                                "'${showDeleteConfirmFor!!.name}' పొలం మరియు దానికి సంబంధించిన అన్ని ప్లాట్లు తొలగించబడతాయి. ఈ మార్పు శాశ్వతం."
                            else
                                "Are you sure you want to delete '${showDeleteConfirmFor!!.name}'? All sub-plots will also be removed."
                        )
                    },
                    confirmButton = {
                        Button(
                            onClick = {
                                val deleted = onDeleteFarm(showDeleteConfirmFor!!.id)
                                if (deleted) {
                                    successMsg = if (isTe) "పొలం విజయవంతంగా తొలగించబడింది" else "Farm deleted successfully"
                                } else {
                                    errorMsg = if (isTe) "తొలగించడంలో విఫలమైంది" else "Failed to delete farm"
                                }
                                showDeleteConfirmFor = null
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFC62828))
                        ) {
                            Text(if (isTe) "అవును, తొలగించు" else "Delete")
                        }
                    },
                    dismissButton = {
                        OutlinedButton(onClick = { showDeleteConfirmFor = null }) {
                            Text(if (isTe) "రద్దు" else "Cancel")
                        }
                    }
                )
            }
        }
    }
}

@Composable
fun FarmFormScreen(
    currentUser: User,
    existingFarm: Farm?,
    currentLanguage: AppLanguage,
    onNavigateBack: () -> Unit,
    onSaveFarm: (Farm) -> Boolean
) {
    val isTe = currentLanguage == AppLanguage.TELUGU

    var name by remember { mutableStateOf(existingFarm?.name ?: "") }
    var surveyNo by remember { mutableStateOf(existingFarm?.surveyNo ?: "") }
    var acresText by remember { mutableStateOf(existingFarm?.totalAcres?.toString() ?: "") }
    var soilType by remember { mutableStateOf(existingFarm?.soilType ?: "Black Soil (నల్ల రేగడి)") }
    var waterSource by remember { mutableStateOf(existingFarm?.waterSource ?: "Canal + Borewell (కాలువ & బోరు)") }

    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var successMessage by remember { mutableStateOf<String?>(null) }

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
                        text = if (existingFarm == null)
                            (if (isTe) "కొత్త పొలం నమోదు" else "Add New Farm")
                        else
                            (if (isTe) "పొలం వివరాల సవరణ" else "Edit Farm Details"),
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
            if (successMessage != null) {
                SuccessBanner(message = successMessage!!)
            }

            if (errorMessage != null) {
                ErrorStateView(message = errorMessage!!, onRetry = { errorMessage = null })
            }

            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(12.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text(if (isTe) "పొలం పేరు (ఉదా: పెద్ద చేను)" else "Farm Name (e.g., North Field)") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = surveyNo,
                        onValueChange = { surveyNo = it },
                        label = { Text(if (isTe) "సర్వే నంబర్" else "Survey Number") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = acresText,
                        onValueChange = { acresText = it },
                        label = { Text(if (isTe) "మొత్తం విస్తీర్ణం (ఎకరాల్లో)" else "Total Area (Acres)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = soilType,
                        onValueChange = { soilType = it },
                        label = { Text(if (isTe) "నేల రకం" else "Soil Type") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = waterSource,
                        onValueChange = { waterSource = it },
                        label = { Text(if (isTe) "నీటి వనరు" else "Water Source") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    if (isLoading) {
                        LoadingView(if (isTe) "భద్రపరుస్తున్నాము..." else "Persisting record offline...")
                    } else {
                        Button(
                            onClick = {
                                val acres = acresText.toDoubleOrNull()
                                if (name.isBlank() || surveyNo.isBlank() || acres == null || acres <= 0.0) {
                                    errorMessage = if (isTe)
                                        "దయచేసి అన్ని వివరాలు మరియు సరైన ఎకరాల సంఖ్య నమోదు చేయండి"
                                    else
                                        "Please enter valid name, survey number, and positive acres."
                                    return@Button
                                }

                                isLoading = true
                                val farmToSave = existingFarm?.copy(
                                    name = name.trim(),
                                    surveyNo = surveyNo.trim(),
                                    totalAcres = acres,
                                    soilType = soilType.trim(),
                                    waterSource = waterSource.trim()
                                ) ?: Farm(
                                    userId = currentUser.id,
                                    name = name.trim(),
                                    surveyNo = surveyNo.trim(),
                                    totalAcres = acres,
                                    soilType = soilType.trim(),
                                    waterSource = waterSource.trim()
                                )

                                val saved = onSaveFarm(farmToSave)
                                isLoading = false
                                if (saved) {
                                    successMessage = if (isTe) "విజయవంతంగా సేవ్ చేయబడింది" else "Farm saved successfully"
                                    onNavigateBack()
                                } else {
                                    errorMessage = if (isTe) "సేవ్ చేయడంలో లోపం ఎదురైంది" else "Failed to persist farm record."
                                }
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(50.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B5E20)),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text(
                                text = if (isTe) "💾 పొలం వివరాలు భద్రపరచు" else "💾 Save Farm Record",
                                fontSize = 16.sp,
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
fun PlotListScreen(
    currentUser: User,
    farm: Farm,
    plots: List<Plot>,
    currentLanguage: AppLanguage,
    onNavigateBack: () -> Unit,
    onSavePlot: (Plot) -> Boolean,
    onDeletePlot: (String) -> Boolean
) {
    val isTe = currentLanguage == AppLanguage.TELUGU

    var showAddDialog by remember { mutableStateOf(false) }
    var plotNameToAdd by remember { mutableStateOf("") }
    var plotAcresToAdd by remember { mutableStateOf("") }
    var plotIrrigationToAdd by remember { mutableStateOf("Drip (డ్రిప్)") }
    var plotCropToAdd by remember { mutableStateOf("Chilli (మిరప)") }
    var errorMsg by remember { mutableStateOf<String?>(null) }
    var successMsg by remember { mutableStateOf<String?>(null) }

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
                    Column {
                        Text(
                            text = "${farm.name} - " + if (isTe) "ప్లాట్లు" else "Plots",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = "${if (isTe) "మొత్తం: " else "Total: "}${farm.totalAcres} " + if (isTe) "ఎకరాలు" else "Acres",
                            fontSize = 12.sp,
                            color = Color(0xFFA5D6A7)
                        )
                    }
                }
            }
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = Color(0xFF1B5E20),
                contentColor = Color.White
            ) {
                Text("+", fontSize = 24.sp, fontWeight = FontWeight.Bold)
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF7FAF7))
                .padding(16.dp)
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                if (successMsg != null) {
                    SuccessBanner(message = successMsg!!)
                    Spacer(modifier = Modifier.height(10.dp))
                }
                if (errorMsg != null) {
                    ErrorStateView(message = errorMsg!!, onRetry = { errorMsg = null })
                    Spacer(modifier = Modifier.height(10.dp))
                }

                if (plots.isEmpty()) {
                    EmptyStateView(
                        title = if (isTe) "ప్లాట్లు ఇంకా లేవు" else "No Plots Added",
                        message = if (isTe)
                            "ఈ పొలం కింద ఉప-విభాగాలు (కమతాలు లేదా ప్లాట్లు) జోడించడానికి క్రింది బటన్ నొక్కండి."
                        else
                            "Divide this farm into distinct crop blocks or irrigation plots.",
                        actionLabel = if (isTe) "+ కొత్త ప్లాట్ జోడించండి" else "+ Add New Plot",
                        onActionClick = { showAddDialog = true }
                    )
                } else {
                    LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        items(plots) { plot ->
                            Card(
                                modifier = Modifier.fillMaxWidth(),
                                colors = CardDefaults.cardColors(containerColor = Color.White),
                                shape = RoundedCornerShape(10.dp),
                                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(14.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(plot.name, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color(0xFF1B5E20))
                                        Text("${plot.acres} " + (if (isTe) "ఎకరాలు" else "Acres") + " • " + plot.currentCrop, fontSize = 12.sp, color = Color(0xFF424242))
                                        Text("💧 ${plot.irrigationType}", fontSize = 11.sp, color = Color(0xFF757575))
                                    }

                                    IconButton(
                                        onClick = {
                                            val deleted = onDeletePlot(plot.id)
                                            if (deleted) {
                                                successMsg = if (isTe) "ప్లాట్ తొలగించబడింది" else "Plot removed"
                                            } else {
                                                errorMsg = if (isTe) "తొలగించడంలో విఫలమైంది" else "Failed to delete plot"
                                            }
                                        }
                                    ) {
                                        Text("🗑️", fontSize = 16.sp)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Add Plot Dialog
            if (showAddDialog) {
                AlertDialog(
                    onDismissRequest = { showAddDialog = false },
                    title = { Text(if (isTe) "కొత్త ప్లాట్ జోడించండి" else "Add New Plot") },
                    text = {
                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = plotNameToAdd,
                                onValueChange = { plotNameToAdd = it },
                                label = { Text(if (isTe) "ప్లాట్ పేరు" else "Plot Name") },
                                singleLine = true
                            )
                            OutlinedTextField(
                                value = plotAcresToAdd,
                                onValueChange = { plotAcresToAdd = it },
                                label = { Text(if (isTe) "విస్తీర్ణం (ఎకరాలు)" else "Plot Acres") },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                                singleLine = true
                            )
                            OutlinedTextField(
                                value = plotCropToAdd,
                                onValueChange = { plotCropToAdd = it },
                                label = { Text(if (isTe) "ప్రస్తుత పంట" else "Current Crop") },
                                singleLine = true
                            )
                            OutlinedTextField(
                                value = plotIrrigationToAdd,
                                onValueChange = { plotIrrigationToAdd = it },
                                label = { Text(if (isTe) "నీటి పారుదల రకం" else "Irrigation Method") },
                                singleLine = true
                            )
                        }
                    },
                    confirmButton = {
                        Button(
                            onClick = {
                                val acres = plotAcresToAdd.toDoubleOrNull()
                                if (plotNameToAdd.isNotBlank() && acres != null && acres > 0.0) {
                                    val newPlot = Plot(
                                        farmId = farm.id,
                                        userId = currentUser.id,
                                        name = plotNameToAdd.trim(),
                                        acres = acres,
                                        irrigationType = plotIrrigationToAdd.trim(),
                                        currentCrop = plotCropToAdd.trim()
                                    )
                                    val saved = onSavePlot(newPlot)
                                    if (saved) {
                                        successMsg = if (isTe) "ప్లాట్ విజయవంతంగా చేర్చబడింది" else "Plot added successfully"
                                        showAddDialog = false
                                        plotNameToAdd = ""
                                        plotAcresToAdd = ""
                                    } else {
                                        errorMsg = if (isTe) "ప్లాట్ సేవ్ చేయడంలో లోపం" else "Failed to save plot"
                                    }
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B5E20))
                        ) {
                            Text(if (isTe) "జోడించు" else "Add Plot")
                        }
                    },
                    dismissButton = {
                        OutlinedButton(onClick = { showAddDialog = false }) {
                            Text(if (isTe) "రద్దు" else "Cancel")
                        }
                    }
                )
            }
        }
    }
}
