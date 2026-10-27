/**
 * Smart Kisan - Profit Report & Financial Intelligence
 * Calculates deterministic net profit/loss, per-acre realization, itemized cost breakdowns,
 * warnings for missing entries, previous cycle comparisons, and printable statements.
 */
const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

/**
 * GET /api/profit/:cycle_id
 * Generates comprehensive profitability report for a specific crop cycle.
 */
router.get('/:cycle_id', async (req, res) => {
    try {
        const userId = req.user.id;
        const cycleId = req.params.cycle_id;

        // 1. Fetch Cycle & User details
        const cycleRes = await db.query(
            `SELECT c.*, u.name AS farmer_name, u.phone AS farmer_phone, u.village, u.district, u.state
             FROM cycles c
             JOIN users u ON c.user_id = u.id
             WHERE c.id = $1 AND c.user_id = $2`,
            [cycleId, userId]
        );

        if (cycleRes.rows.length === 0) {
            return res.status(404).json({
                error: 'CYCLE_NOT_FOUND',
                message: 'పంట వివరాలు కనుగొనబడలేదు / Crop cycle not found or unauthorized.'
            });
        }

        const cycle = cycleRes.rows[0];
        const areaAcres = parseFloat(cycle.area_acres) || 1.0;

        // 2. Fetch all expenses for this cycle
        const expRes = await db.query(
            `SELECT id, category, amount, expense_date, notes
             FROM expenses
             WHERE cycle_id = $1 AND user_id = $2
             ORDER BY expense_date ASC, id ASC`,
            [cycleId, userId]
        );

        const expensesList = expRes.rows;

        // 3. Fetch all sales for this cycle
        const salesRes = await db.query(
            `SELECT id, amount, deductions, quantity, unit, buyer, sale_date, notes,
                    (amount - deductions) AS net_sale_amount
             FROM sales
             WHERE cycle_id = $1 AND user_id = $2
             ORDER BY sale_date ASC, id ASC`,
            [cycleId, userId]
        );

        const salesList = salesRes.rows;

        // 4. Aggregations & Math
        const totalCost = expensesList.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const grossSale = salesList.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const totalDeductions = salesList.reduce((sum, item) => sum + parseFloat(item.deductions || 0), 0);
        const netSale = grossSale - totalDeductions;
        const netProfit = netSale - totalCost;

        // Per acre metrics (guarded against zero)
        const perAcreCost = areaAcres > 0 ? (totalCost / areaAcres) : 0;
        const perAcreGross = areaAcres > 0 ? (grossSale / areaAcres) : 0;
        const perAcreNet = areaAcres > 0 ? (netProfit / areaAcres) : 0;

        // Total yield summary
        const totalYieldKgEquivalent = salesList.reduce((sum, item) => {
            const qty = parseFloat(item.quantity || 0);
            if (item.unit === 'Quintal') return sum + (qty * 100);
            if (item.unit === 'Ton') return sum + (qty * 1000);
            if (item.unit === 'Kg') return sum + qty;
            return sum + qty;
        }, 0);

        // 5. Cost Breakdown by Category
        const categoryMap = {};
        for (const exp of expensesList) {
            const cat = exp.category;
            const amt = parseFloat(exp.amount || 0);
            if (!categoryMap[cat]) {
                categoryMap[cat] = { category: cat, total: 0, count: 0 };
            }
            categoryMap[cat].total += amt;
            categoryMap[cat].count += 1;
        }

        const costBreakdown = Object.values(categoryMap).map(c => ({
            category: c.category,
            total: Math.round(c.total * 100) / 100,
            count: c.count,
            percentage: totalCost > 0 ? Math.round((c.total / totalCost) * 1000) / 10 : 0
        })).sort((a, b) => b.total - a.total);

        // 6. Warnings for missing data
        const warnings = [];
        if (expensesList.length === 0) {
            warnings.push({
                code: 'NO_EXPENSES',
                message_te: 'హెచ్చరిక: ఈ పంటకు ఖర్చులు ఇంకా నమోదు చేయలేదు. లాభం ఎక్కువ ఉన్నట్లు అనిపించవచ్చు.',
                message_en: 'Warning: No expenses recorded yet. Net profit may be overestimated.'
            });
        }
        if (salesList.length === 0) {
            warnings.push({
                code: 'NO_SALES',
                message_te: 'హెచ్చరిక: ఈ పంటకు అమ్మకాలు ఇంకా నమోదు చేయలేదు. ప్రస్తుతం కేవలం పెట్టుబడి ఖర్చులు మాత్రమే ఉన్నాయి.',
                message_en: 'Warning: No sales recorded yet. Currently reflecting only production investments.'
            });
        }

        // 7. Comparison with Previous Cycle of the SAME crop
        const prevCycleRes = await db.query(
            `SELECT id, crop_name, crop_name_te, start_date, end_date, area_acres
             FROM cycles
             WHERE user_id = $1 
               AND id != $2 
               AND (LOWER(crop_name) = LOWER($3) OR LOWER(crop_name_te) = LOWER($4))
               AND start_date <= $5
             ORDER BY start_date DESC, id DESC
             LIMIT 1`,
            [userId, cycleId, cycle.crop_name, cycle.crop_name_te || cycle.crop_name, cycle.start_date]
        );

        let previousCycleComparison = null;

        if (prevCycleRes.rows.length > 0) {
            const prev = prevCycleRes.rows[0];
            const prevArea = parseFloat(prev.area_acres) || 1.0;

            // Fetch previous cycle expenses & sales
            const prevExpRes = await db.query(
                `SELECT COALESCE(SUM(amount), 0.00) AS total FROM expenses WHERE cycle_id = $1 AND user_id = $2`,
                [prev.id, userId]
            );
            const prevSaleRes = await db.query(
                `SELECT COALESCE(SUM(amount), 0.00) AS gross, COALESCE(SUM(deductions), 0.00) AS deductions 
                 FROM sales WHERE cycle_id = $1 AND user_id = $2`,
                [prev.id, userId]
            );

            const prevCost = parseFloat(prevExpRes.rows[0]?.total || 0);
            const prevGross = parseFloat(prevSaleRes.rows[0]?.gross || 0);
            const prevDed = parseFloat(prevSaleRes.rows[0]?.deductions || 0);
            const prevNetSale = prevGross - prevDed;
            const prevNetProfit = prevNetSale - prevCost;
            const prevPerAcreNet = prevArea > 0 ? (prevNetProfit / prevArea) : 0;

            const profitDiff = netProfit - prevNetProfit;
            const costDiff = totalCost - prevCost;
            const perAcreDiff = perAcreNet - prevPerAcreNet;

            previousCycleComparison = {
                previous_cycle: {
                    id: prev.id,
                    crop_name: prev.crop_name,
                    crop_name_te: prev.crop_name_te,
                    start_date: prev.start_date,
                    area_acres: prevArea,
                    total_cost: prevCost,
                    gross_sale: prevGross,
                    net_profit: prevNetProfit,
                    per_acre_net: Math.round(prevPerAcreNet * 100) / 100
                },
                differences: {
                    cost_diff: Math.round(costDiff * 100) / 100,
                    cost_change_percent: prevCost > 0 ? Math.round(((totalCost - prevCost) / prevCost) * 1000) / 10 : null,
                    profit_diff: Math.round(profitDiff * 100) / 100,
                    profit_change_percent: prevNetProfit !== 0 ? Math.round(((netProfit - prevNetProfit) / Math.abs(prevNetProfit)) * 1000) / 10 : null,
                    per_acre_diff: Math.round(perAcreDiff * 100) / 100
                }
            };
        }

        // Return comprehensive financial report
        return res.json({
            cycle: {
                id: cycle.id,
                crop_name: cycle.crop_name,
                crop_name_te: cycle.crop_name_te,
                start_date: cycle.start_date,
                end_date: cycle.end_date,
                area_acres: areaAcres,
                status: cycle.status,
                notes: cycle.notes
            },
            farmer: {
                name: cycle.farmer_name,
                phone: cycle.farmer_phone,
                village: cycle.village,
                district: cycle.district,
                state: cycle.state
            },
            summary: {
                total_cost: Math.round(totalCost * 100) / 100,
                gross_sale: Math.round(grossSale * 100) / 100,
                total_deductions: Math.round(totalDeductions * 100) / 100,
                net_sale: Math.round(netSale * 100) / 100,
                net_profit: Math.round(netProfit * 100) / 100,
                is_profit: netProfit >= 0,
                per_acre_cost: Math.round(perAcreCost * 100) / 100,
                per_acre_gross: Math.round(perAcreGross * 100) / 100,
                per_acre_net: Math.round(perAcreNet * 100) / 100,
                expenses_count: expensesList.length,
                sales_count: salesList.length,
                total_yield_kg_equiv: totalYieldKgEquivalent
            },
            cost_breakdown: costBreakdown,
            expenses: expensesList,
            sales: salesList,
            warnings: warnings,
            previous_cycle_comparison: previousCycleComparison,
            generated_at: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error generating profit report:', err);
        return res.status(500).json({
            error: 'REPORT_FAILED',
            message: 'లాభ నష్టాల నివేదిక తయారుచేయడంలో లోపం / Failed to generate profit report.'
        });
    }
});

module.exports = router;
