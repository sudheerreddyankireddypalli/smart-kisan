package com.smartkisan.app

import com.smartkisan.app.data.model.CropProfitInput
import com.smartkisan.app.domain.calculator.ProfitCalculator
import org.junit.Assert.*
import org.junit.Test

class ProfitCalculatorTest {

    @Test
    fun `test profit calculator produces mathematically correct net profit and gross revenue`() {
        // Given: 2 acres chilli crop yielding 40 quintals sold at ₹18,500/quintal
        val input = CropProfitInput(
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

        // When
        val result = ProfitCalculator.calculate(input)

        // Then:
        // Gross revenue = 40 * 18,500 = 740,000.00
        assertEquals(740000.0, result.grossRevenue, 0.01)

        // Total cost = 14000 + 28000 + 22000 + 35000 + 6000 + 12000 + 8000 = 125,000.00
        assertEquals(125000.0, result.totalCost, 0.01)

        // Net profit = 740000 - 125000 = 615,000.00
        assertEquals(615000.0, result.netProfit, 0.01)
        assertTrue(result.isProfitable)

        // Cost per quintal = 125000 / 40 = 3,125.00
        assertEquals(3125.0, result.costPerQtl, 0.01)

        // Cost per acre = 125000 / 2 = 62,500.00
        assertEquals(62500.0, result.costPerAcre, 0.01)

        // Break-even selling price = 3,125.00
        assertEquals(3125.0, result.breakEvenPrice, 0.01)

        // ROI % = (615000 / 125000) * 100 = 492.00%
        assertEquals(492.0, result.roiPercent, 0.01)
    }

    @Test
    fun `test profit calculator correctly identifies loss when expenses exceed revenue`() {
        // Given: Crop failure or depressed market prices
        val input = CropProfitInput(
            cropName = "Paddy",
            acres = 1.0,
            expectedYieldQtl = 10.0,
            sellingPricePerQtl = 1500.0, // Revenue = 15,000
            seedsCost = 3000.0,
            fertilizerCost = 6000.0,
            pesticideCost = 4000.0,
            laborCost = 8000.0,
            irrigationCost = 2000.0,
            machineryCost = 3000.0,
            transportCost = 1000.0 // Total Cost = 27,000
        )

        val result = ProfitCalculator.calculate(input)

        assertEquals(15000.0, result.grossRevenue, 0.01)
        assertEquals(27000.0, result.totalCost, 0.01)
        assertEquals(-12000.0, result.netProfit, 0.01)
        assertFalse(result.isProfitable)

        // Break-even price needed to not lose money = 27000 / 10 = ₹2,700/qtl
        assertEquals(2700.0, result.breakEvenPrice, 0.01)
    }

    @Test
    fun `test zero yield and zero acres edge cases do not cause division by zero`() {
        val input = CropProfitInput(
            acres = 0.0,
            expectedYieldQtl = 0.0,
            sellingPricePerQtl = 2000.0,
            seedsCost = 5000.0,
            fertilizerCost = 0.0,
            pesticideCost = 0.0,
            laborCost = 0.0,
            irrigationCost = 0.0,
            machineryCost = 0.0,
            transportCost = 0.0
        )

        val result = ProfitCalculator.calculate(input)

        assertEquals(0.0, result.grossRevenue, 0.01)
        assertEquals(5000.0, result.totalCost, 0.01)
        assertEquals(-5000.0, result.netProfit, 0.01)
        assertEquals(0.0, result.costPerQtl, 0.01)
        assertEquals(0.0, result.costPerAcre, 0.01)
        assertEquals(0.0, result.breakEvenPrice, 0.01)
    }
}
