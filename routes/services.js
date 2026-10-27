/**
 * Smart Kisan - Agricultural Service Directory
 * Connects farmers with verified local providers for Drone spraying, Machinery, Labour, and Transport.
 */
const express = require('express');
const router = express.Router();
const db = require('../db');
const { optionalAuth, requireAuth } = require('../middleware/auth');

/**
 * GET /api/services
 * Query params: ?type=...&district=...&search=...
 */
router.get('/', optionalAuth, async (req, res) => {
    try {
        const { type, district, search } = req.query;

        let queryText = `
            SELECT id, name, service_type, area, state, district, phone, quote_rate, rating, is_verified, created_at
            FROM providers
            WHERE 1=1
        `;
        const params = [];

        if (type && ['labour', 'drone', 'machinery', 'transport'].includes(type)) {
            params.push(type);
            queryText += ` AND service_type = $${params.length}`;
        }

        if (district && district.trim().length > 0) {
            params.push(`%${district.trim()}%`);
            queryText += ` AND (district ILIKE $${params.length} OR area ILIKE $${params.length})`;
        }

        if (search && search.trim().length > 0) {
            params.push(`%${search.trim()}%`);
            queryText += ` AND (name ILIKE $${params.length} OR area ILIKE $${params.length})`;
        }

        queryText += ` ORDER BY is_verified DESC, rating DESC, id ASC`;

        const result = await db.query(queryText, params);
        return res.json({ providers: result.rows });
    } catch (err) {
        console.error('Error fetching service providers:', err);
        return res.status(500).json({
            error: 'FETCH_FAILED',
            message: 'సర్వీస్ ప్రొవైడర్ల వివరాలు పొందడంలో లోపం / Failed to fetch providers.'
        });
    }
});

/**
 * POST /api/services
 * Registers a new agricultural service provider.
 */
router.post('/', requireAuth, async (req, res) => {
    try {
        const { name, service_type, area, phone, quote_rate, state, district } = req.body;

        if (!name || !service_type || !phone || !area) {
            return res.status(400).json({
                error: 'MISSING_FIELDS',
                message: 'పేరు, సర్వీస్ రకం, ఫోన్ నంబర్ మరియు ప్రాంతం తప్పనిసరి / Name, service type, area, and phone are required.'
            });
        }

        if (!['labour', 'drone', 'machinery', 'transport'].includes(service_type)) {
            return res.status(400).json({
                error: 'INVALID_SERVICE_TYPE',
                message: 'చెల్లుబాటు అయ్యే సర్వీస్ రకాన్ని ఎంచుకోండి / Invalid service type.'
            });
        }

        const phoneClean = (phone || '').toString().trim();

        const insertQuery = `
            INSERT INTO providers (name, service_type, area, state, district, phone, quote_rate, rating, is_verified)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 4.5, true)
            RETURNING *
        `;

        const result = await db.query(insertQuery, [
            name.trim(),
            service_type,
            area.trim(),
            state || req.user.state || 'Telangana',
            district || req.user.district || 'Warangal',
            phoneClean,
            quote_rate ? quote_rate.trim() : null
        ]);

        return res.status(201).json({
            success: true,
            message: 'సర్వీస్ విజయవంతంగా నమోదు చేయబడింది / Service provider registered successfully.',
            provider: result.rows[0]
        });
    } catch (err) {
        console.error('Error adding provider:', err);
        return res.status(500).json({
            error: 'CREATE_FAILED',
            message: 'సర్వీస్ నమోదు చేయడంలో లోపం / Failed to register service provider.'
        });
    }
});

module.exports = router;
