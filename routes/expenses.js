/**
 * Smart Kisan - Expense Diary Routes
 * Manages farm expenditures across 15 standard agricultural categories with strict tenant verification.
 */
const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

const VALID_CATEGORIES = [
    'seed', 'fertilizer', 'pesticide', 'labour', 'water',
    'electricity', 'tractor', 'machinery', 'harvest', 'transport',
    'drying', 'packing', 'land_rent', 'interest', 'other'
];

/**
 * GET /api/expenses?cycle_id=...
 * Lists expenses for a given cycle or all user expenses.
 */
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { cycle_id } = req.query;

        let queryText = `
            SELECT e.*, c.crop_name, c.crop_name_te 
            FROM expenses e
            JOIN cycles c ON e.cycle_id = c.id
            WHERE e.user_id = $1
        `;
        const params = [userId];

        if (cycle_id) {
            params.push(cycle_id);
            queryText += ` AND e.cycle_id = $2`;
        }

        queryText += ` ORDER BY e.expense_date DESC, e.id DESC`;

        const result = await db.query(queryText, params);
        return res.json({ expenses: result.rows });
    } catch (err) {
        console.error('Error fetching expenses:', err);
        return res.status(500).json({
            error: 'FETCH_FAILED',
            message: 'ఖర్చుల వివరాలు పొందడంలో లోపం / Failed to fetch expenses.'
        });
    }
});

/**
 * POST /api/expenses
 * Records a new expenditure.
 */
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { cycle_id, category, amount, expense_date, notes } = req.body;

        if (!cycle_id) {
            return res.status(400).json({
                error: 'MISSING_CYCLE',
                message: 'దయచేసి పంటను ఎంచుకోండి / Please select a crop cycle.'
            });
        }

        // Verify cycle belongs to this user
        const cycleCheck = await db.query(
            `SELECT id, crop_name FROM cycles WHERE id = $1 AND user_id = $2`,
            [cycle_id, userId]
        );

        if (cycleCheck.rows.length === 0) {
            return res.status(404).json({
                error: 'CYCLE_NOT_FOUND',
                message: 'ఎంచుకున్న పంట రికార్డు కనుగొనబడలేదు / Selected crop cycle not found.'
            });
        }

        if (!category || !VALID_CATEGORIES.includes(category)) {
            return res.status(400).json({
                error: 'INVALID_CATEGORY',
                message: 'దయచేసి సరైన ఖర్చు వర్గాన్ని ఎంచుకోండి / Please select a valid expense category.'
            });
        }

        const amt = parseFloat(amount);
        if (isNaN(amt) || amt < 0) {
            return res.status(400).json({
                error: 'INVALID_AMOUNT',
                message: 'దయచేసి సరైన మొత్తాన్ని నమోదు చేయండి / Amount must be zero or a positive number.'
            });
        }

        const date = expense_date || new Date().toISOString().split('T')[0];

        const insertQuery = `
            INSERT INTO expenses (cycle_id, user_id, category, amount, expense_date, notes)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const result = await db.query(insertQuery, [
            cycle_id,
            userId,
            category,
            amt,
            date,
            notes ? notes.trim() : null
        ]);

        const newExpense = result.rows[0];

        // Audit
        await db.query(
            `INSERT INTO audit (user_id, action, entity_type, entity_id, details)
             VALUES ($1, 'CREATE', 'expenses', $2, $3)`,
            [userId, newExpense.id, JSON.stringify({ category, amount: amt, cycle_id })]
        );

        return res.status(201).json({
            success: true,
            message: 'ఖర్చు నమోదు చేయబడింది / Expense recorded successfully.',
            expense: newExpense
        });
    } catch (err) {
        console.error('Error creating expense:', err);
        return res.status(500).json({
            error: 'CREATE_FAILED',
            message: 'ఖర్చు నమోదు చేయడంలో లోపం / Failed to record expense.'
        });
    }
});

/**
 * PUT /api/expenses/:id
 * Updates an existing expenditure.
 */
router.put('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const expenseId = req.params.id;
        const { category, amount, expense_date, notes } = req.body;

        const check = await db.query(
            `SELECT id FROM expenses WHERE id = $1 AND user_id = $2`,
            [expenseId, userId]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'ఖర్చు రికార్డు కనుగొనబడలేదు / Expense record not found or access denied.'
            });
        }

        if (category && !VALID_CATEGORIES.includes(category)) {
            return res.status(400).json({
                error: 'INVALID_CATEGORY',
                message: 'దయచేసి సరైన ఖర్చు వర్గాన్ని ఎంచుకోండి / Invalid category.'
            });
        }

        const amt = amount !== undefined ? parseFloat(amount) : null;
        if (amt !== null && (isNaN(amt) || amt < 0)) {
            return res.status(400).json({
                error: 'INVALID_AMOUNT',
                message: 'దయచేసి సరైన మొత్తాన్ని నమోదు చేయండి / Invalid amount.'
            });
        }

        const updateQuery = `
            UPDATE expenses
            SET category = COALESCE($1, category),
                amount = COALESCE($2, amount),
                expense_date = COALESCE($3, expense_date),
                notes = $4,
                updated_at = NOW()
            WHERE id = $5 AND user_id = $6
            RETURNING *
        `;

        const result = await db.query(updateQuery, [
            category,
            amt,
            expense_date,
            notes ? notes.trim() : null,
            expenseId,
            userId
        ]);

        return res.json({
            success: true,
            message: 'ఖర్చు వివరాలు అప్‌డేట్ చేయబడ్డాయి / Expense updated successfully.',
            expense: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating expense:', err);
        return res.status(500).json({
            error: 'UPDATE_FAILED',
            message: 'అప్‌డేట్ చేయడంలో లోపం / Failed to update expense.'
        });
    }
});

/**
 * DELETE /api/expenses/:id
 * Deletes an expenditure.
 */
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const expenseId = req.params.id;

        const check = await db.query(
            `SELECT id, category, amount FROM expenses WHERE id = $1 AND user_id = $2`,
            [expenseId, userId]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'ఖర్చు రికార్డు కనుగొనబడలేదు / Expense record not found.'
            });
        }

        await db.query(`DELETE FROM expenses WHERE id = $1 AND user_id = $2`, [expenseId, userId]);

        // Audit
        await db.query(
            `INSERT INTO audit (user_id, action, entity_type, entity_id, details)
             VALUES ($1, 'DELETE', 'expenses', $2, $3)`,
            [userId, expenseId, JSON.stringify(check.rows[0])]
        );

        return res.json({
            success: true,
            message: 'ఖర్చు తొలగించబడింది / Expense record deleted successfully.'
        });
    } catch (err) {
        console.error('Error deleting expense:', err);
        return res.status(500).json({
            error: 'DELETE_FAILED',
            message: 'తొలగించడంలో లోపం / Failed to delete expense.'
        });
    }
});

module.exports = router;
