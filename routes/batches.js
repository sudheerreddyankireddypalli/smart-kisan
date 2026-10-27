/**
 * Smart Kisan - Produce Batch Traceability
 * Farm-to-pack traceability with auto-generated batch codes, processing stages,
 * moisture percentage tracking, and certification transparency disclosures.
 */
const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

const VALID_STATUSES = ['received', 'dried', 'milled', 'packed', 'sold'];

const CERTIFICATION_DISCLAIMER = {
    te: 'గమనిక: ఈ బ్యాచ్ రికార్డు మీ వ్యవసాయ ఉత్పత్తుల ప్రాసెసింగ్ ట్రాకింగ్ కొరకు మాత్రమే. \'సేంద్రీయ (Organic)\' లేదా \'రసాయన రహిత\' అని లేబుల్ చేయడానికి గుర్తింపు పొందిన సంస్థల (NPOP/APEDA/Jaivik Bharat) నుండి అధికారిక సర్టిఫికేషన్ తప్పనిసరి.',
    en: 'Notice: This batch record tracks agricultural processing steps. Any commercial claims such as \'Organic\' or \'Residue-Free\' legally mandate formal accreditation by certified agencies (NPOP/APEDA/Jaivik Bharat).'
};

/**
 * Helper to generate unique batch code
 */
function generateBatchCode(cropName) {
    const cleanCrop = (cropName || 'CROP').replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase() || 'CRP';
    const year = new Date().getFullYear();
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    return `SK-${cleanCrop}-${year}-${randomHex}`;
}

/**
 * GET /api/batches?cycle_id=...
 */
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { cycle_id } = req.query;

        let queryText = `
            SELECT b.*, c.crop_name_te 
            FROM batches b
            LEFT JOIN cycles c ON b.cycle_id = c.id
            WHERE b.user_id = $1
        `;
        const params = [userId];

        if (cycle_id) {
            params.push(cycle_id);
            queryText += ` AND b.cycle_id = $2`;
        }

        queryText += ` ORDER BY b.harvest_date DESC, b.id DESC`;

        const result = await db.query(queryText, params);

        return res.json({
            disclaimer: CERTIFICATION_DISCLAIMER,
            batches: result.rows
        });
    } catch (err) {
        console.error('Error fetching batches:', err);
        return res.status(500).json({
            error: 'FETCH_FAILED',
            message: 'బ్యాచుల వివరాలు పొందడంలో లోపం / Failed to fetch batches.'
        });
    }
});

/**
 * POST /api/batches
 */
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const { cycle_id, crop_name, harvest_date, quantity_kg, moisture_percent, grade, status, certification_notes } = req.body;

        if (!crop_name || crop_name.trim().length === 0) {
            return res.status(400).json({
                error: 'MISSING_CROP',
                message: 'పంట పేరు తప్పనిసరి / Crop name is required.'
            });
        }

        const qty = parseFloat(quantity_kg);
        if (isNaN(qty) || qty < 0) {
            return res.status(400).json({
                error: 'INVALID_QUANTITY',
                message: 'పరిమాణం (కిలోలు) సరైన సంఖ్యగా ఉండాలి / Quantity in kg must be zero or positive.'
            });
        }

        const moisture = moisture_percent !== undefined && moisture_percent !== '' ? parseFloat(moisture_percent) : null;
        const batchStatus = status && VALID_STATUSES.includes(status) ? status : 'received';
        const batchCode = generateBatchCode(crop_name);
        const date = harvest_date || new Date().toISOString().split('T')[0];

        // If cycle_id is provided, verify it belongs to user
        if (cycle_id) {
            const check = await db.query('SELECT id FROM cycles WHERE id = $1 AND user_id = $2', [cycle_id, userId]);
            if (check.rows.length === 0) {
                return res.status(404).json({
                    error: 'CYCLE_NOT_FOUND',
                    message: 'ఎంచుకున్న పంట రికార్డు కనుగొనబడలేదు / Crop cycle not found.'
                });
            }
        }

        const insertQuery = `
            INSERT INTO batches (cycle_id, user_id, batch_code, crop_name, harvest_date, quantity_kg, moisture_percent, grade, status, certification_notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;

        const result = await db.query(insertQuery, [
            cycle_id || null,
            userId,
            batchCode,
            crop_name.trim(),
            date,
            qty,
            moisture,
            grade ? grade.trim() : 'Standard',
            batchStatus,
            certification_notes ? certification_notes.trim() : null
        ]);

        const newBatch = result.rows[0];

        // Audit
        await db.query(
            `INSERT INTO audit (user_id, action, entity_type, entity_id, details)
             VALUES ($1, 'CREATE', 'batches', $2, $3)`,
            [userId, newBatch.id, JSON.stringify({ batch_code: batchCode, crop: crop_name, kg: qty })]
        );

        return res.status(201).json({
            success: true,
            message: 'బ్యాచ్ విజయవంతంగా రూపొందించబడింది / Batch created successfully.',
            batch: newBatch,
            disclaimer: CERTIFICATION_DISCLAIMER
        });
    } catch (err) {
        console.error('Error creating batch:', err);
        return res.status(500).json({
            error: 'CREATE_FAILED',
            message: 'బ్యాచ్ నమోదు చేయడంలో లోపం / Failed to create batch.'
        });
    }
});

/**
 * PUT /api/batches/:id
 */
router.put('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const batchId = req.params.id;
        const { status, moisture_percent, quantity_kg, grade, certification_notes } = req.body;

        const check = await db.query(
            `SELECT id FROM batches WHERE id = $1 AND user_id = $2`,
            [batchId, userId]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'బ్యాచ్ రికార్డు కనుగొనబడలేదు / Batch not found.'
            });
        }

        if (status && !VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                error: 'INVALID_STATUS',
                message: 'చెల్లుబాటు అయ్యే స్థితిని ఎంచుకోండి / Invalid batch status.'
            });
        }

        const updateQuery = `
            UPDATE batches
            SET status = COALESCE($1, status),
                moisture_percent = COALESCE($2, moisture_percent),
                quantity_kg = COALESCE($3, quantity_kg),
                grade = COALESCE($4, grade),
                certification_notes = $5,
                updated_at = NOW()
            WHERE id = $6 AND user_id = $7
            RETURNING *
        `;

        const result = await db.query(updateQuery, [
            status,
            moisture_percent !== undefined ? parseFloat(moisture_percent) : null,
            quantity_kg !== undefined ? parseFloat(quantity_kg) : null,
            grade,
            certification_notes ? certification_notes.trim() : null,
            batchId,
            userId
        ]);

        return res.json({
            success: true,
            message: 'బ్యాచ్ అప్‌డేట్ చేయబడింది / Batch updated successfully.',
            batch: result.rows[0]
        });
    } catch (err) {
        console.error('Error updating batch:', err);
        return res.status(500).json({
            error: 'UPDATE_FAILED',
            message: 'అప్‌డేట్ చేయడంలో లోపం / Failed to update batch.'
        });
    }
});

/**
 * DELETE /api/batches/:id
 */
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const batchId = req.params.id;

        const check = await db.query(
            `SELECT id, batch_code FROM batches WHERE id = $1 AND user_id = $2`,
            [batchId, userId]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                error: 'NOT_FOUND',
                message: 'బ్యాచ్ రికార్డు కనుగొనబడలేదు / Batch not found.'
            });
        }

        await db.query(`DELETE FROM batches WHERE id = $1 AND user_id = $2`, [batchId, userId]);

        // Audit
        await db.query(
            `INSERT INTO audit (user_id, action, entity_type, entity_id, details)
             VALUES ($1, 'DELETE', 'batches', $2, $3)`,
            [userId, batchId, JSON.stringify(check.rows[0])]
        );

        return res.json({
            success: true,
            message: 'బ్యాచ్ తొలగించబడింది / Batch deleted successfully.'
        });
    } catch (err) {
        console.error('Error deleting batch:', err);
        return res.status(500).json({
            error: 'DELETE_FAILED',
            message: 'తొలగించడంలో లోపం / Failed to delete batch.'
        });
    }
});

module.exports = router;
