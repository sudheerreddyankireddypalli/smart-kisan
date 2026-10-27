package com.smartkisan.app

import com.smartkisan.app.data.model.User
import com.smartkisan.app.data.model.UserRole
import com.smartkisan.app.domain.security.AccessDeniedException
import com.smartkisan.app.domain.security.AccessPolicyGuard
import org.junit.Assert.*
import org.junit.Test

class AccessPolicyGuardTest {

    private val farmer1 = User(
        id = "farmer-101",
        phone = "9876543210",
        name = "Rami Reddy",
        role = UserRole.FARMER
    )

    private val farmer2 = User(
        id = "farmer-102",
        phone = "9876543211",
        name = "Venkat Rao",
        role = UserRole.FARMER
    )

    private val adminUser = User(
        id = "admin-999",
        phone = "admin@smartkisan.in",
        name = "Kisan Admin",
        role = UserRole.ADMIN
    )

    @Test
    fun `farmer accessing own farm succeeds without exception`() {
        // Should not throw
        AccessPolicyGuard.assertRecordOwnership(farmer1, "farmer-101", "Farm")
    }

    @Test(expected = AccessDeniedException::class)
    fun `farmer accessing another farmers farm throws AccessDeniedException`() {
        // Farmer 1 attempting to access record owned by Farmer 2
        AccessPolicyGuard.assertRecordOwnership(farmer1, "farmer-102", "Farm")
    }

    @Test
    fun `admin user can access records for audit compliance`() {
        // Admin allowed across tenant boundaries for audit
        AccessPolicyGuard.assertRecordOwnership(adminUser, "farmer-101", "Farm")
        assertTrue(AccessPolicyGuard.canAccessAdminPortal(adminUser))
    }

    @Test
    fun `farmer cannot access admin portal`() {
        assertFalse(AccessPolicyGuard.canAccessAdminPortal(farmer1))
    }

    @Test(expected = AccessDeniedException::class)
    fun `unauthenticated session throws AccessDeniedException`() {
        AccessPolicyGuard.assertAuthenticated(null)
    }
}
