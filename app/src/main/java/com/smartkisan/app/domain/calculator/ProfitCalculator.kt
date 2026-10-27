package com.smartkisan.app.domain.calculator

import com.smartkisan.app.data.model.CropProfitInput
import com.smartkisan.app.data.model.ProfitResult
import java.math.BigDecimal
import java.math.RoundingMode

object ProfitCalculator {

    fun round(value: Double): Double {
        if (value.isNaN() || value.isInfinite()) return 0.0
        return BigDecimal(value)
            .setScale(2, RoundingMode.HALF_UP)
            .toDouble()
    }

    fun calculate(input: CropProfitInput): ProfitResult {
        val totalCost = round(
            input.seedsCost +
            input.fertilizerCost +
            input.pesticideCost +
            input.laborCost +
            input.irrigationCost +
            input.machineryCost +
            input.transportCost
        )

        val grossRevenue = round(input.expectedYieldQtl * input.sellingPricePerQtl)
        val netProfit = round(grossRevenue - totalCost)

        val costPerQtl = if (input.expectedYieldQtl > 0.0) {
            round(totalCost / input.expectedYieldQtl)
        } else {
            0.0
        }

        val costPerAcre = if (input.acres > 0.0) {
            round(totalCost / input.acres)
        } else {
            0.0
        }

        // Break-even price is the exact price per quintal required to cover total operational expenses
        val breakEvenPrice = if (input.expectedYieldQtl > 0.0) {
            round(totalCost / input.expectedYieldQtl)
        } else {
            0.0
        }

        val roiPercent = if (totalCost > 0.0) {
            round((netProfit / totalCost) * 100.0)
        } else {
            0.0
        }

        return ProfitResult(
            grossRevenue = grossRevenue,
            totalCost = totalCost,
            netProfit = netProfit,
            costPerQtl = costPerQtl,
            costPerAcre = costPerAcre,
            breakEvenPrice = breakEvenPrice,
            roiPercent = roiPercent,
            isProfitable = netProfit >= 0.0
        )
    }
}
