package com.smartkisan.app

import com.smartkisan.app.data.model.MarketPrice
import com.smartkisan.app.data.model.SponsoredItem
import com.smartkisan.app.data.model.User
import com.smartkisan.app.data.model.UserRole
import org.junit.Assert.*
import org.junit.Test

class MarketAndSponsoredModelTest {

    @Test
    fun `test sponsored item has mandatory clear disclosure label`() {
        val item = SponsoredItem(
            id = "sp-1",
            titleEn = "Bio-NPK Fertilizer 20% Subsidy",
            titleTe = "బయో-ఎరువులు రాయితీ",
            descEn = "Organic nutrients for chillies",
            descTe = "మిరపకు సేంద్రీయ ఎరువులు",
            sponsorName = "AgriBio Ltd",
            disclosureLabel = "ప్రాయోజితం / Sponsored"
        )

        assertTrue("Sponsored content must be clearly identified", item.disclosureLabel.contains("Sponsored"))
        assertTrue("Telugu label must be present", item.disclosureLabel.contains("ప్రాయోజితం"))
        assertEquals("AgriBio Ltd", item.sponsorName)
    }

    @Test
    fun `test external market price source and freshness attributes`() {
        val livePrice = MarketPrice(
            id = "m1",
            commodity = "Teja Chilli",
            marketName = "Guntur APMC",
            minPrice = 16000.0,
            modalPrice = 18500.0,
            maxPrice = 21000.0,
            source = "AGMARKNET (Govt of India)",
            freshnessLabel = "Live - 15 mins ago",
            isStale = false
        )

        assertEquals("AGMARKNET (Govt of India)", livePrice.source)
        assertFalse(livePrice.isStale)
        assertTrue(livePrice.modalPrice in livePrice.minPrice..livePrice.maxPrice)

        val stalePrice = livePrice.copy(
            freshnessLabel = "Offline Cache - 3 days ago",
            isStale = true
        )
        assertTrue(stalePrice.isStale)
    }

    @Test
    fun `test user model role segregation`() {
        val farmer = User(
            id = "f-1",
            phone = "9876543210",
            name = "Farmer Rami",
            role = UserRole.FARMER
        )

        val admin = User(
            id = "a-1",
            phone = "admin@smartkisan.in",
            name = "Kisan Admin",
            role = UserRole.ADMIN
        )

        assertEquals(UserRole.FARMER, farmer.role)
        assertEquals(UserRole.ADMIN, admin.role)
        assertNotEquals(farmer.id, admin.id)
    }
}
