/**
 * Smart Kisan - Buyer Offers Module
 * Displays transparent buyer quotes, calculates net realization per quintal,
 * flags expired offers, and strictly avoids pushing any decision.
 */
const express = require('express');
const router = express.Router();
const db = require('../db');
const { optionalAuth, requireAuth } = require('../middleware/auth');

/**
 * GET /api/offers
 * Returns list of buyer offers, sorted by net price (highest first).
 * Query params: ?crop=...&district=...
 */
router.get('/', optionalAuth, async (req, res) => {
    try {
        const { crop, district } = req.query;

        let queryText = `
            SELECT 
                id,
                buyer_name,
                buyer_phone,
                crop_name,
                quantity_quintals,
                price_per_quintal,
                deduction_per_quintal,
                (price_per_quintal - deduction_per_quintal) AS net_price_per_quintal,
                expiry_date,
                (expiry_date < CURRENT_DATE) AS is_expired,
                terms,
                state,
                district,
                created_at
            FROM offers
            WHERE 1=1
        `;
        const params = [];

        if (crop && crop.trim().length > 0) {
            params.push(`%${crop.trim()}%`);
            queryText += ` AND (crop_name ILIKE $${params.length})`;
        }

        if (district && district.trim().length > 0) {
            params.push(`%${district.trim()}%`);
            queryText += ` AND (district ILIKE $${params.length})`;
        }

        queryText += ` ORDER BY (expiry_date < CURRENT_DATE) ASC, (price_per_quintal - deduction_per_quintal) DESC`;

        const result = await db.query(queryText, params);

        return res.json({
            disclaimer: {
                te: 'గమనిక: వ్యాపారుల ఆఫర్లు కేవలం సమాచారం మరియు పోలిక కోసం మాత్రమే. ఎవరికి అమ్మాలనేది రైతు యొక్క వ్యక్తిగత స్వేచ్ఛ. కొనుగోలుదారుడితో స్వయంగా మాట్లాడి నిర్ణయం తీసుకోండి.',
                en: 'Notice: Buyer offers are shared purely for transparency and comparison. You have full freedom to sell wherever you prefer. Please verify terms directly with buyers.'
            },
            offers: result.rows
        });
    } catch (err) {
        console.error('Error fetching offers:', err);
        return res.status(500).json({
            error: 'FETCH_FAILED',
            message: 'ఆఫర్ల వివరాలు పొందడంలో లోపం / Failed to fetch buyer offers.'
        });
    }
});

/**
 * POST /api/offers
 * Adds a new buyer offer.
 */
router.post('/', requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { buyer_name, buyer_phone, crop_name, quantity_quintals, price_per_quintal, deduction_per_quintal, expiry_date, terms, state, district } = req.body;

        if (!buyer_name || !crop_name || !expiry_date) {
            return res.status(400).json({
                error: 'MISSING_FIELDS',
                message: 'కొనుగోలుదారు పేరు, పంట మరియు గడువు తేదీ తప్పనిసరి / Buyer name, crop name, and expiry date are required.'
            });
        }

        const qty = parseFloat(quantity_quintals);
        const price = parseFloat(price_per_quintal);
        const ded = parseFloat(deduction_per_quintal) || 0;

        if (isNaN(qty) || qty <= 0 || isNaN(price) || price <= 0) {
            return res.status(400).json({
                error: 'INVALID_NUMBERS',
                message: 'పరిమాణం మరియు ధర ధనాత్మక సంఖ్యలుగా ఉండాలి / Valid quantity and price required.'
            });
        }

        const insertQuery = `
            INSERT INTO offers (user_id, buyer_name, buyer_phone, crop_name, quantity_quintals, price_per_quintal, deduction_per_quintal, expiry_date, terms, state, district)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *, (price_per_quintal - deduction_per_quintal) AS net_price_per_quintal
        `;

        const result = await db.query(insertQuery, [
            userId,
            buyer_name.trim(),
            buyer_phone ? buyer_phone.trim() : null,
            crop_name.trim(),
            qty,
            price,
            ded,
            expiry_date,
            terms ? terms.trim() : null,
            state || req.user.state,
            district || req.user.district
        ]);

        return res.status(201).json({
            success: true,
            message: 'ఆఫర్ నమోదు చేయబడింది / Buyer offer added successfully.',
            offer: result.rows[0]
        });
    } catch (err) {
        console.error('Error creating offer:', err);
        return res.status(500).json({
            error: 'CREATE_FAILED',
            message: 'ఆఫర్ నమోదు చేయడంలో లోపం / Failed to add offer.'
        });
    }
});

module.exports = router;
