package com.smartkisan.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.smartkisan.app.data.model.AppLanguage
import com.smartkisan.app.data.model.User
import com.smartkisan.app.data.model.UserRole
import com.smartkisan.app.ui.state.LoadingView

@Composable
fun LoginScreen(
    currentLanguage: AppLanguage,
    onLanguageToggle: () -> Unit,
    onLoginSuccess: (User) -> Unit,
    onAuthenticate: (String, String, UserRole) -> User?
) {
    val isTe = currentLanguage == AppLanguage.TELUGU

    var selectedRole by remember { mutableStateOf(UserRole.FARMER) }
    var phoneInput by remember { mutableStateOf("9876543210") }
    var pinInput by remember { mutableStateOf("1234") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFFF7FAF7)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Header Language Switch
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                OutlinedButton(
                    onClick = onLanguageToggle,
                    shape = RoundedCornerShape(20.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF1B5E20))
                ) {
                    Text(if (isTe) "Switch to English" else "తెలుగులోకి మార్చండి")
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // App Logo & Title
            Text("🌾", fontSize = 48.sp)
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = if (isTe) "స్మార్ట్ కిసాన్ (Smart Kisan)" else "Smart Kisan",
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF1B5E20)
            )
            Text(
                text = if (isTe) "రైతు సంక్షేమం - డిజిటల్ వ్యవసాయం" else "Empowering Farmers with Smart Tools",
                fontSize = 14.sp,
                color = Color(0xFF388E3C)
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Role Selector
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFE8F5E9), RoundedCornerShape(12.dp))
                    .padding(4.dp)
            ) {
                Button(
                    onClick = {
                        selectedRole = UserRole.FARMER
                        phoneInput = "9876543210"
                        pinInput = "1234"
                    },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (selectedRole == UserRole.FARMER) Color(0xFF2E7D32) else Color.Transparent,
                        contentColor = if (selectedRole == UserRole.FARMER) Color.White else Color(0xFF2E7D32)
                    ),
                    shape = RoundedCornerShape(8.dp),
                    elevation = null
                ) {
                    Text(if (isTe) "రైతు (Farmer)" else "Farmer")
                }

                Button(
                    onClick = {
                        selectedRole = UserRole.ADMIN
                        phoneInput = "admin@smartkisan.in"
                        pinInput = "9999"
                    },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (selectedRole == UserRole.ADMIN) Color(0xFF2E7D32) else Color.Transparent,
                        contentColor = if (selectedRole == UserRole.ADMIN) Color.White else Color(0xFF2E7D32)
                    ),
                    shape = RoundedCornerShape(8.dp),
                    elevation = null
                ) {
                    Text(if (isTe) "అడ్మిన్ (Admin)" else "Admin")
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Credentials Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = if (isTe) "లాగిన్ వివరాలు" else "Login Credentials",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF212121)
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    OutlinedTextField(
                        value = phoneInput,
                        onValueChange = { phoneInput = it },
                        label = { Text(if (selectedRole == UserRole.FARMER) (if (isTe) "మొబైల్ నంబర్" else "Mobile Number") else "Admin Email / ID") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = pinInput,
                        onValueChange = { pinInput = it },
                        label = { Text(if (isTe) "సెక్యూరిటీ పిన్ (PIN)" else "Security PIN") },
                        modifier = Modifier.fillMaxWidth(),
                        visualTransformation = PasswordVisualTransformation(),
                        singleLine = true
                    )

                    if (errorMessage != null) {
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = errorMessage!!,
                            color = Color(0xFFC62828),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium
                        )
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    if (isLoading) {
                        LoadingView(if (isTe) "ధృవీకరిస్తున్నాము..." else "Authenticating credentials...")
                    } else {
                        Button(
                            onClick = {
                                isLoading = true
                                errorMessage = null
                                val user = onAuthenticate(phoneInput, pinInput, selectedRole)
                                isLoading = false
                                if (user != null) {
                                    onLoginSuccess(user)
                                } else {
                                    errorMessage = if (isTe) "చెల్లని వివరాలు. దయచేసి మళ్లీ ప్రయత్నించండి." else "Invalid credentials. Please verify."
                                }
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(50.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1B5E20)),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text(
                                text = if (isTe) "లాగిన్ అవ్వండి" else "Sign In",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Demo Hint
            Text(
                text = if (isTe) "డెమో క్రెడెన్షియల్స్ స్వయంచాలకంగా పూరించబడ్డాయి" else "Demo credentials pre-configured for instant verification",
                fontSize = 12.sp,
                color = Color(0xFF757575)
            )
        }
    }
}
