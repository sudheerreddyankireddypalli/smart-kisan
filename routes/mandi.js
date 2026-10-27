/**
 * Smart Kisan - Live Mandi Prices (data.gov.in AGMARKNET Resource)
 * Resource ID: 9ef84268-d588-465a-a308-a864a43d0070
 * Filters by farmer state and commodity, prioritizes farmer's district, caches 30 mins.
 * Strictly adheres to truthful data transparency — no invented prices.
 */
const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');

router.use(optionalAuth);

// In-memory cache for mandi rates (30-minute TTL)
const mandiCache = new Map();
const MANDI_CACHE_TTL_MS = 30 * 60 * 1000;

const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';

/**
 * Standard commodity mapping (English/Telugu to AGMARKNET search keyword)
 */
const COMMODITY_MAPPING = {
    'paddy': 'Paddy(Dhan)',
    'rice': 'Paddy(Dhan)',
    'turmeric': 'Turmeric',
    'cotton': 'Cotton',
    'chilli': 'Chilli Red',
    'groundnut': 'Groundnut',
    'maize': 'Maize',
    'onion': 'Onion',
    'tomato': 'Tomato',
    'potato': 'Potato',
    'bengal_gram': 'Bengal Gram(Gram)',
    'red_gram': 'Red Gram (Arhar/Tur)',
    'soybean': 'Soyabean',
    'sunflower': 'Sunflower',
    'wheat': 'Wheat'
};

/**
 * GET /api/mandi
 * Query params: ?commodity=...&state=...&district=...
 */
router.get('/', async (req, res) => {
    try {
        const apiKey = process.env.DATA_GOV_KEY;
        const requestedCommodity = (req.query.commodity || 'Turmeric').trim();
        const farmerState = req.query.state || req.user?.state || 'Telangana';
        const farmerDistrict = req.query.district || req.user?.district || 'Warangal';

        // Disclaimer text required by spec
        const disclaimer = {
            te: 'హోల్‌సేల్ సూచన ధరలు మాత్రమే — హామీ ఇచ్చిన కొనుగోలు ధర కాదు. మార్కెట్ యార్డులో నాణ్యత, తేమ శాతాన్ని బట్టి ధర మారుతుంది.',
            en: 'Wholesale reference prices only — Not a guaranteed farm-gate procurement price. Final price varies with quality, grade, and moisture at the mandi.'
        };

        // If no API key configured, return transparent notification
        if (!apiKey || apiKey.trim().length === 0 || apiKey === 'your_data_gov_in_api_key_here') {
            return res.json({
                status: 'UNCONFIGURED_KEY',
                message_te: 'data.gov.in API కీ కాన్ఫిగర్ చేయలేదు. లైవ్ AGMARKNET మార్కెట్ ధరల కోసం .env లో DATA_GOV_KEY ని సెట్ చేయండి.',
                message_en: 'data.gov.in API key is not configured. Please add DATA_GOV_KEY to your .env file to enable live AGMARKNET mandi rates.',
                disclaimer: disclaimer,
                rates: [],
                total_records: 0
            });
        }

        // Determine mapped commodity query
        const mappedCommodity = COMMODITY_MAPPING[requestedCommodity.toLowerCase()] || requestedCommodity;
        const cacheKey = `${farmerState}:${mappedCommodity}`.toLowerCase();
        const cached = mandiCache.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp < MANDI_CACHE_TTL_MS)) {
            // Sort cached items with farmer's district first
            const sortedRates = sortRatesByDistrict(cached.rates, farmerDistrict);
            return res.json({
                status: 'OK',
                disclaimer,
                commodity: requestedCommodity,
                state: farmerState,
                district: farmerDistrict,
                rates: sortedRates,
                total_records: sortedRates.length,
                cached: true,
                updated_at: cached.fetched_at
            });
        }

        // Build data.gov.in API URL
        const apiUrl = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${encodeURIComponent(apiKey)}&format=json&limit=100&filters%5Bstate%5D=${encodeURIComponent(farmerState)}&filters%5Bcommodity%5D=${encodeURIComponent(mappedCommodity)}`;

        const response = await fetch(apiUrl, {
            headers: { 'User-Agent': 'SmartKisanApp/1.0', 'Accept': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`data.gov.in API returned HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const records = data.records || [];

        // Parse records safely
        const rates = records.map(r => ({
            state: r.state || farmerState,
            district: r.district || '',
            market: r.market || 'APMC Mandi',
            commodity: r.commodity || mappedCommodity,
            variety: r.variety || 'Standard',
            arrival_date: r.arrival_date || new Date().toISOString().split('T')[0],
            min_price: parseFloat(r.min_price) || 0,
            max_price: parseFloat(r.max_price) || 0,
            modal_price: parseFloat(r.modal_price) || 0,
            is_farmer_district: (r.district || '').toLowerCase().includes(farmerDistrict.toLowerCase())
        }));

        const fetchedAt = new Date().toISOString();

        // Cache 30 minutes
        mandiCache.set(cacheKey, {
            timestamp: Date.now(),
            fetched_at: fetchedAt,
            rates: rates
        });

        const sortedRates = sortRatesByDistrict(rates, farmerDistrict);

        return res.json({
            status: 'OK',
            disclaimer,
            commodity: requestedCommodity,
            state: farmerState,
            district: farmerDistrict,
            rates: sortedRates,
            total_records: sortedRates.length,
            cached: false,
            updated_at: fetchedAt
        });

    } catch (err) {
        console.error('Mandi service error:', err.message);
        return res.status(503).json({
            status: 'ERROR',
            message_te: 'లైవ్ మార్కెట్ ధరలను పొందడంలో అంతరాయం ఏర్పడింది. దయచేసి కాసేపటి తర్వాత ప్రయత్నించండి.',
            message_en: 'Unable to fetch live mandi rates from data.gov.in. Please try again later.',
            disclaimer: {
                te: 'హోల్‌సేల్ సూచన ధరలు మాత్రమే — హామీ ఇచ్చిన కొనుగోలు ధర కాదు.',
                en: 'Wholesale reference prices only — Not a guaranteed farm-gate procurement price.'
            },
            rates: [],
            total_records: 0,
            error: err.message
        });
    }
});

function sortRatesByDistrict(rates, farmerDistrict) {
    if (!farmerDistrict) return rates;
    const target = farmerDistrict.toLowerCase();
    return [...rates].sort((a, b) => {
        const aMatches = (a.district || '').toLowerCase().includes(target);
        const bMatches = (b.district || '').toLowerCase().includes(target);
        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return (a.district || '').localeCompare(b.district || '');
    });
}

module.exports = router;
