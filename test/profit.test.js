/**
 * Smart Kisan - Financial Profit & Loss Deterministic Test Suite
 * Validates exact accounting mathematics for total cost, gross sales,
 * market deductions, net realization, per-acre metrics, and previous cycle comparison.
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

function calculateCycleFinancials(expenses, sales, areaAcres) {
    const totalCost = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const grossSale = sales.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
    const totalDeductions = sales.reduce((sum, s) => sum + parseFloat(s.deductions || 0), 0);
    const netSale = grossSale - totalDeductions;
    const netProfit = netSale - totalCost;

    // Zero-division protection
    const area = parseFloat(areaAcres) > 0 ? parseFloat(areaAcres) : 1.0;
    const perAcreCost = totalCost / area;
    const perAcreGross = grossSale / area;
    const perAcreNet = netProfit / area;

    // Category breakdown
    const categoryTotals = {};
    for (const exp of expenses) {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + parseFloat(exp.amount || 0);
    }

    const breakdown = Object.entries(categoryTotals).map(([cat, amt]) => ({
        category: cat,
        total: amt,
        percentage: totalCost > 0 ? Math.round((amt / totalCost) * 1000) / 10 : 0
    }));

    // Warnings
    const warnings = [];
    if (expenses.length === 0) warnings.push('NO_EXPENSES');
    if (sales.length === 0) warnings.push('NO_SALES');

    return {
        totalCost,
        grossSale,
        totalDeductions,
        netSale,
        netProfit,
        isProfit: netProfit >= 0,
        perAcreCost,
        perAcreGross,
        perAcreNet,
        breakdown,
        warnings
    };
}

function compareCycles(current, previous) {
    const costDiff = current.totalCost - previous.totalCost;
    const salesDiff = current.grossSale - previous.grossSale;
    const profitDiff = current.netProfit - previous.netProfit;
    const perAcreDiff = current.perAcreNet - previous.perAcreNet;

    return {
        costDiff,
        salesDiff,
        profitDiff,
        perAcreDiff
    };
}

describe('Profit & Accounting Deterministic Math', () => {

    test('Profit calculation: Exact math for gross, deductions, cost, and net profit', () => {
        // Sample realistic turmeric cycle (3 acres)
        const sampleExpenses = [
            { category: 'seed', amount: 24000.00 },
            { category: 'tractor', amount: 9500.00 },
            { category: 'fertilizer', amount: 18200.00 },
            { category: 'labour', amount: 32000.00 },
            { category: 'harvest', amount: 22000.00 },
            { category: 'transport', amount: 4500.00 }
        ];

        const sampleSales = [
            { amount: 185000.00, deductions: 3500.00, quantity: 25.0, unit: 'Quintal' },
            { amount: 120000.00, deductions: 2200.00, quantity: 16.0, unit: 'Quintal' }
        ];

        const area = 3.0;
        const res = calculateCycleFinancials(sampleExpenses, sampleSales, area);

        // Expected math:
        // Total Cost: 24000 + 9500 + 18200 + 32000 + 22000 + 4500 = 110,200
        assert.equal(res.totalCost, 110200.00);

        // Gross Sales: 185000 + 120000 = 305,000
        assert.equal(res.grossSale, 305000.00);

        // Total Deductions: 3500 + 2200 = 5,700
        assert.equal(res.totalDeductions, 5700.00);

        // Net Sales Realized: 305000 - 5700 = 299,300
        assert.equal(res.netSale, 299300.00);

        // Net Profit: 299300 - 110200 = 189,100
        assert.equal(res.netProfit, 189100.00);
        assert.equal(res.isProfit, true);

        // Per Acre Net: 189100 / 3 = 63,033.33...
        assert.equal(Math.round(res.perAcreNet * 100) / 100, 63033.33);

        // Breakdown percentages sum to 100%
        const totalPct = res.breakdown.reduce((sum, b) => sum + b.percentage, 0);
        assert.ok(Math.abs(totalPct - 100.0) < 0.5, 'Percentages sum to ~100%');
    });

    test('Net Loss calculation: Handles negative profit correctly', () => {
        const expenses = [{ category: 'seed', amount: 50000.00 }];
        const sales = [{ amount: 30000.00, deductions: 2000.00 }]; // Net sales = 28000
        const area = 2.0;

        const res = calculateCycleFinancials(expenses, sales, area);
        assert.equal(res.netProfit, -22000.00, 'Loss of ₹22,000');
        assert.equal(res.isProfit, false);
        assert.equal(res.perAcreNet, -11000.00, 'Loss of ₹11,000 per acre');
    });

    test('Zero-division safety: Zero or negative acres do not crash calculations', () => {
        const expenses = [{ category: 'fertilizer', amount: 10000 }];
        const sales = [{ amount: 25000, deductions: 0 }];

        const resZero = calculateCycleFinancials(expenses, sales, 0);
        assert.ok(!isNaN(resZero.perAcreNet));
        assert.ok(isFinite(resZero.perAcreNet));

        const resNeg = calculateCycleFinancials(expenses, sales, -1.5);
        assert.ok(!isNaN(resNeg.perAcreNet));
        assert.ok(isFinite(resNeg.perAcreNet));
    });

    test('Missing entries warnings: Flags cycles with zero expenses or zero sales', () => {
        // Cycle with sales but no expenses
        const noExp = calculateCycleFinancials([], [{ amount: 40000, deductions: 0 }], 1.0);
        assert.equal(noExp.warnings.includes('NO_EXPENSES'), true);

        // Cycle with expenses but no sales
        const noSale = calculateCycleFinancials([{ category: 'seed', amount: 12000 }], [], 1.0);
        assert.equal(noSale.warnings.includes('NO_SALES'), true);
    });

    test('Previous cycle comparison: Computes differences between two seasons', () => {
        const prevCycle = calculateCycleFinancials(
            [{ category: 'seed', amount: 20000 }, { category: 'labour', amount: 25000 }], // 45,000
            [{ amount: 150000, deductions: 5000 }], // Net sales = 145,000 => Profit = 100,000
            2.0 // Per acre net = 50,000
        );

        const currentCycle = calculateCycleFinancials(
            [{ category: 'seed', amount: 22000 }, { category: 'labour', amount: 30000 }], // 52,000
            [{ amount: 190000, deductions: 5000 }], // Net sales = 185,000 => Profit = 133,000
            2.0 // Per acre net = 66,500
        );

        const comp = compareCycles(currentCycle, prevCycle);

        assert.equal(comp.costDiff, 7000, 'Cost increased by ₹7,000');
        assert.equal(comp.profitDiff, 33000, 'Profit increased by ₹33,000');
        assert.equal(comp.perAcreDiff, 16500, 'Per-acre net increased by ₹16,500');
    });

});
