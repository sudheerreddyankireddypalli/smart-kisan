/**
 * Smart Kisan - Crop Sales Routes
 * Manages crop produce sales, trader/market deductions, quantities, and buyers.
 */
const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

const VALID_UNITS = ['Quintal', 'Kg', 'Bag', 'Ton', 'Box', 'Other'];

/**
 * GET /api/sales?cycle_id=...
 * Lists sales for a cycle or all user sales.
 */
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { cycle_id } = req.query;

        let queryText = `
            SELECT s.*, c.crop_name, c.crop_name_te,
                   (s.amount - s.deductions) AS net_sale_amount
            FROM sales s
            JOIN cycles c ON s.cycle_id = c.id
            WHERE s.user_id = $1
        `;
        const params = [userId];

        if (cycle_id) {
            params.push(cycle_id);
            queryText += ` AND s.cycle_id = $2`;
        }

        queryText += ` ORDER BY s.sale_date DESC, s.id DESC`;

        const result = await db.query(queryText, params);
        return res.json({ sales: result.rows });
    } catch (err) {
        console.error('Error fetching sales:', err);
        return res.status(500).json({
            error: 'FETCH_FAILED',
            message: 'అమ్మకాల వివరాలు పొందడంలో లోపం / Failed to fetch sales records.'
        });
    }
});

/**
 * POST /api/sales
 * Records a new harvest sale.
 */
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { cycle_id, amount, deductions, quantity, unit, buyer, sale_date, notes } = req.body;

        if (!cycle_id) {
            return res.status(400).json({
                error: 'MISSING_CYCLE',
                message: 'దయచేసి పంటను ఎంచుకోండి / Please select a crop cycle.'
            });
        }

        // Verify cycle ownership
        const cycleCheck = await db.query(
            `SELECT id, crop_name FROM cycles WHERE id = $1 AND user_id = $2`,
            [cycle_id, userId]
        );

        if (cycleCheck.rows.length === 0) {
            return res.status(404).json({
                error: 'CYCLE_NOT_FOUND',
                message: 'పంట రికార్డు కనుగొనబడలేదు / Selected crop cycle not found.'
            });
        }

        const amt = parseFloat(amount);
        if (isNaN(amt) || amt < 0) {
            return res.status(400).json({
                error: 'INVALID_AMOUNT',
                message: 'దయచేసి సరైన అమ్మకం మొత్తాన్ని నమోదు చేయండి / Total sale amount must be zero or a positive number.'
            });
        }

        const ded = deductions !== undefined && deductions !== '' ? parseFloat(deductions) : 0.00;
        if (isNaN(ded) || ded < 0) {
            return res.status(400).json({
                error: 'INVALID_DEDUCTIONS',
                message: 'తగ్గింపుల మొత్తం సున్నా లేదా ధనాత్మకంగా ఉండాలి / Deductions must be zero or positive.'
            });
        }

        const qty = parseFloat(quantity);
        if (isNaN(qty) || qty < 0) {
            return res.status(400).json({
                error: 'INVALID_QUANTITY',
                message: 'దయచేసి సరైన పరిమాణాన్ని నమోదు చేయండి / Quantity must be zero or positive.'
            });
        }

        const selectedUnit = unit && VALID_UNITS.includes(unit) ? unit : 'Quintal';
        const date = sale_date || new Date().toISOString().split('T')[0];

        const insertQuery = `
            INSERT INTO sales (cycle_id, user_id, amount, deductions, quantity, unit, buyer, sale_date, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *, (amount - deductions) AS net_sale_amount
        `;

        const result = await db.query(insertQuery, [
            cycle_id,
            userId,
            amt,
            ded,
            qty,
            selectedUnit,
            buyer ? buyer.trim() : null,
            date,
            notes ? notes.trim() : null
        ]);

        const newSale = result.rows[0];

        // Audit
        await db.query(
            `INSERT INTO audit (user_id, action, entity_type, entity_id, details)
             VALUES ($1, 'CREATE', 'sales', $2, $3)`,
            [userId, newSale.id, JSON.stringify({ amount: amt, deductions: ded, quantity: qty, buyer })]
        );

        return res.status(201).json({
            success: true,
            message: 'అమ్మకం వివరాలు నమోదు చేయబడ్డాయి / Sale record added successfully.',
            sale: newSale
        });
    } catch (err) {
        console.error('Error recording sale:', err);
        return res.status(500).json({
            error: 'CREATE_FAILED',
            message: 'అమ్మకం వివరాలు నమోదు చేయడంలో లోపం / Failed to record sale.'
        });
    }
});

/**
 * PUT /api/sales/:id
 * Updates an existing sale.
 */
router.put('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const saleId = req.params.id;
        const { amount, deductions, quantity, unit, buyer, sale_date, notes } = req.body;

        const check = await db.query(
            `SELECT id FROM sales WHERE id = $1 AND user_id = $2`,
            [saleId, userId]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'అమ్మకం రికార్డు కనుగొనబడలేదు / Sale record not found.'
            });
        }

        const amt = amount !== undefined ? parseFloat(amount) : null;
        const ded = deductions !== undefined && deductions !== '' ? parseFloat(deductions) : null;
        const qty = quantity !== undefined ? parseFloat(quantity) : null;

        const updateQuery = `
            UPDATE sales
            SET amount = COALESCE($1, amount),
                deductions = COALESCE($2, deductions),
                quantity = COALESCE($3, quantity),
                unit = COALESCE($4, unit),
                buyer = $5,
                sale_date = COALESCE($6, sale_date),
                notes = $7,
                updated_at = NOW()
            WHERE id = $8 AND user_id = $9
            RETURNING *, (amount - deductions) AS net_sale_amount
        `;

        const result = await db.query(updateQuery, [
            amt,
            ded,
            qty,
            unit,
            buyer ? buyer.trim() : null,
            sale_date,
            notes ? notes.trim() : null,
            saleId,
            userId
        ]);

        return res.json({
            success: true,
            message: 'అమ్మకం వివరాలు అప్‌డేట్ చేయబడ్డాయి / Sale record updated.',
            sale: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating sale:', err);
        return res.status(500).json({
            error: 'UPDATE_FAILED',
            message: 'అప్‌డేట్ చేయడంలో లోపం / Failed to update sale.'
        });
    }
});

/**
 * DELETE /api/sales/:id
 * Deletes a sale.
 */
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const saleId = req.params.id;

        const check = await db.query(
            `SELECT id, amount, quantity, buyer FROM sales WHERE id = $1 AND user_id = $2`,
            [saleId, userId]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'అమ్మకం రికార్డు కనుగొనబడలేదు / Sale record not found.'
            });
        }

        await db.query(`DELETE FROM sales WHERE id = $1 AND user_id = $2`, [saleId, userId]);

        // Audit
        await db.query(
            `INSERT INTO audit (user_id, action, entity_type, entity_id, details)
             VALUES ($1, 'DELETE', 'sales', $2, $3)`,
            [userId, saleId, JSON.stringify(check.rows[0])]
        );

        return res.json({
            success: true,
            message: 'అమ్మకం రికార్డు తొలగించబడింది / Sale record deleted successfully.'
        });
    } catch (err) {
        console.error('Error deleting sale:', err);
        return res.status(500).json({
            error: 'DELETE_FAILED',
            message: 'తొలగించడంలో లోపం / Failed to delete sale.'
        });
    }
});

module.exports = router;
