/**
 * Smart Kisan - Crop Cycles Routes
 * CRUD operations for farmer crop cycles with strict tenant isolation.
 */
const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const { CROPS } = require('../constants/crops');

router.use(requireAuth);

/**
 * GET /api/cycles/catalog
 * Returns list of standard 40+ Indian crops with Telugu and English names.
 */
router.get('/catalog', (req, res) => {
    return res.json({ crops: CROPS });
});

/**
 * GET /api/cycles
 * Returns all crop cycles belonging to the logged-in user with summary financial calculations.
 */
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;

        const queryText = `
            SELECT 
                c.id,
                c.crop_name,
                c.crop_name_te,
                c.start_date,
                c.end_date,
                c.area_acres,
                c.status,
                c.notes,
                c.created_at,
                c.updated_at,
                COALESCE(e.total_expenses, 0.00) AS total_expenses,
                COALESCE(s.gross_sales, 0.00) AS gross_sales,
                COALESCE(s.total_deductions, 0.00) AS total_deductions,
                (COALESCE(s.gross_sales, 0.00) - COALESCE(s.total_deductions, 0.00)) AS net_sales,
                ((COALESCE(s.gross_sales, 0.00) - COALESCE(s.total_deductions, 0.00)) - COALESCE(e.total_expenses, 0.00)) AS net_profit
            FROM cycles c
            LEFT JOIN (
                SELECT cycle_id, SUM(amount) AS total_expenses
                FROM expenses
                WHERE user_id = $1
                GROUP BY cycle_id
            ) e ON c.id = e.cycle_id
            LEFT JOIN (
                SELECT cycle_id, SUM(amount) AS gross_sales, SUM(deductions) AS total_deductions
                FROM sales
                WHERE user_id = $1
                GROUP BY cycle_id
            ) s ON c.id = s.cycle_id
            WHERE c.user_id = $1
            ORDER BY c.start_date DESC, c.id DESC
        `;

        const result = await db.query(queryText, [userId]);
        return res.json({ cycles: result.rows });
    } catch (err) {
        console.error('Error fetching cycles:', err);
        return res.status(500).json({
            error: 'FETCH_FAILED',
            message: 'పంట వివరాలు పొందడంలో లోపం / Failed to fetch crop cycles.'
        });
    }
});

/**
 * POST /api/cycles
 * Creates a new crop cycle.
 */
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { crop_name, crop_name_te, start_date, end_date, area_acres, status, notes } = req.body;

        if (!crop_name || typeof crop_name !== 'string' || crop_name.trim().length === 0) {
            return res.status(400).json({
                error: 'INVALID_CROP',
                message: 'దయచేసి పంట పేరును నమోదు చేయండి / Crop name is required.'
            });
        }

        if (!start_date) {
            return res.status(400).json({
                error: 'INVALID_DATE',
                message: 'దయచేసి ప్రారంభ తేదీని నమోదు చేయండి / Start date is required.'
            });
        }

        const area = parseFloat(area_acres);
        if (isNaN(area) || area <= 0) {
            return res.status(400).json({
                error: 'INVALID_AREA',
                message: 'దయచేసి సరైన విస్తీర్ణం (ఎకరాలు) నమోదు చేయండి / Area in acres must be a positive number.'
            });
        }

        const cycleStatus = status && ['active', 'completed', 'abandoned'].includes(status) ? status : 'active';

        // Match Telugu crop name if not provided
        let teName = crop_name_te;
        if (!teName) {
            const found = CROPS.find(c => c.en.toLowerCase() === crop_name.trim().toLowerCase() || c.te === crop_name.trim());
            if (found) teName = found.te;
        }

        const insertQuery = `
            INSERT INTO cycles (user_id, crop_name, crop_name_te, start_date, end_date, area_acres, status, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, crop_name, crop_name_te, start_date, end_date, area_acres, status, notes, created_at
        `;

        const result = await db.query(insertQuery, [
            userId,
            crop_name.trim(),
            teName || null,
            start_date,
            end_date || null,
            area,
            cycleStatus,
            notes ? notes.trim() : null
        ]);

        const newCycle = result.rows[0];

        // Audit log
        await db.query(
            `INSERT INTO audit (user_id, action, entity_type, entity_id, details)
             VALUES ($1, 'CREATE', 'cycles', $2, $3)`,
            [userId, newCycle.id, JSON.stringify({ crop: newCycle.crop_name, area: newCycle.area_acres })]
        );

        return res.status(201).json({
            success: true,
            message: 'పంట వివరాలు విజయవంతంగా భద్రపరచబడ్డాయి / Crop cycle added successfully.',
            cycle: newCycle
        });
    } catch (err) {
        console.error('Error creating cycle:', err);
        return res.status(500).json({
            error: 'CREATE_FAILED',
            message: 'పంట వివరాలు నమోదు చేయడంలో లోపం / Failed to create crop cycle.'
        });
    }
});

/**
 * GET /api/cycles/:id
 * Fetches a single cycle with strict tenant check.
 */
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const cycleId = req.params.id;

        const result = await db.query(
            `SELECT * FROM cycles WHERE id = $1 AND user_id = $2`,
            [cycleId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'పంట వివరాలు కనుగొనబడలేదు / Crop cycle not found.'
            });
        }

        return res.json({ cycle: result.rows[0] });
    } catch (err) {
        return res.status(500).json({
            error: 'FETCH_FAILED',
            message: 'లోపం ఏర్పడింది / Failed to fetch crop cycle.'
        });
    }
});

/**
 * PUT /api/cycles/:id
 * Updates an existing crop cycle with strict tenant check.
 */
router.put('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const cycleId = req.params.id;
        const { crop_name, crop_name_te, start_date, end_date, area_acres, status, notes } = req.body;

        // Check ownership
        const existing = await db.query(
            `SELECT id FROM cycles WHERE id = $1 AND user_id = $2`,
            [cycleId, userId]
        );

        if (existing.rows.length === 0) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'పంట వివరాలు కనుగొనబడలేదు లేదా మార్చడానికి అనుమతి లేదు / Crop cycle not found or access denied.'
            });
        }

        const area = parseFloat(area_acres);
        if (isNaN(area) || area <= 0) {
            return res.status(400).json({
                error: 'INVALID_AREA',
                message: 'దయచేసి సరైన విస్తీర్ణం (ఎకరాలు) నమోదు చేయండి / Valid area in acres required.'
            });
        }

        const updateQuery = `
            UPDATE cycles
            SET crop_name = COALESCE($1, crop_name),
                crop_name_te = COALESCE($2, crop_name_te),
                start_date = COALESCE($3, start_date),
                end_date = $4,
                area_acres = $5,
                status = COALESCE($6, status),
                notes = $7,
                updated_at = NOW()
            WHERE id = $8 AND user_id = $9
            RETURNING *
        `;

        const result = await db.query(updateQuery, [
            crop_name?.trim(),
            crop_name_te?.trim(),
            start_date,
            end_date || null,
            area,
            status,
            notes ? notes.trim() : null,
            cycleId,
            userId
        ]);

        return res.json({
            success: true,
            message: 'పంట వివరాలు అప్‌డేట్ చేయబడ్డాయి / Crop cycle updated successfully.',
            cycle: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating cycle:', err);
        return res.status(500).json({
            error: 'UPDATE_FAILED',
            message: 'వివరాలు అప్‌డేట్ చేయడంలో లోపం / Failed to update crop cycle.'
        });
    }
});

/**
 * DELETE /api/cycles/:id
 * Deletes cycle. Cascades to expenses, sales, batches.
 */
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const cycleId = req.params.id;

        const check = await db.query(
            `SELECT id, crop_name FROM cycles WHERE id = $1 AND user_id = $2`,
            [cycleId, userId]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'పంట వివరాలు కనుగొనబడలేదు / Crop cycle not found or access denied.'
            });
        }

        // Delete cycle (cascades in DB)
        await db.query(`DELETE FROM cycles WHERE id = $1 AND user_id = $2`, [cycleId, userId]);

        // Audit
        await db.query(
            `INSERT INTO audit (user_id, action, entity_type, entity_id, details)
             VALUES ($1, 'DELETE', 'cycles', $2, $3)`,
            [userId, cycleId, JSON.stringify({ crop: check.rows[0].crop_name })]
        );

        return res.json({
            success: true,
            message: 'పంట రికార్డు మరియు దాని ఖర్చులు/అమ్మకాలు తొలగించబడ్డాయి / Crop cycle and all related records deleted.'
        });
    } catch (err) {
        console.error('Error deleting cycle:', err);
        return res.status(500).json({
            error: 'DELETE_FAILED',
            message: 'తొలగించడంలో లోపం / Failed to delete crop cycle.'
        });
    }
});

module.exports = router;
