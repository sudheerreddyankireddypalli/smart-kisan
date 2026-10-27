package com.smartkisan.app.domain.security

import com.smartkisan.app.data.model.User
import com.smartkisan.app.data.model.UserRole

class AccessDeniedException(message: String) : SecurityException(message)

object AccessPolicyGuard {

    fun assertAuthenticated(currentUser: User?) {
        if (currentUser == null) {
            throw AccessDeniedException("Unauthorized: No active authenticated session.")
        }
    }

    fun assertRecordOwnership(currentUser: User, recordOwnerUserId: String, resourceType: String) {
        if (currentUser.role != UserRole.ADMIN && currentUser.id != recordOwnerUserId) {
            throw AccessDeniedException(
                "Access Denied: User ${currentUser.phone} cannot access $resourceType owned by tenant $recordOwnerUserId"
            )
        }
    }

    fun canAccessAdminPortal(currentUser: User): Boolean {
        return currentUser.role == UserRole.ADMIN
    }
}
