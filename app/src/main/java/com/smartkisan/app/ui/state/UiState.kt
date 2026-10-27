package com.smartkisan.app.ui.state

sealed class UiState<out T> {
    object Idle : UiState<Nothing>()
    data class Loading(val message: String = "Loading data...") : UiState<Nothing>()
    data class Success<out T>(val data: T) : UiState<T>()
    data class Empty(
        val title: String = "No Records Found",
        val message: String = "Tap the action button to create your first entry.",
        val actionText: String? = null
    ) : UiState<Nothing>()
    data class Error(
        val title: String = "Action Failed",
        val message: String = "An unexpected error occurred.",
        val canRetry: Boolean = true
    ) : UiState<Nothing>()
}
