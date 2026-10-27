/**
 * Smart Kisan - Auth Routes
 * Phone number + password authentication, rate-limiting, consent tracking, account deletion & audit logging.
 */
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const db = require('../db');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

// Rate limiting for auth routes: 15 requests per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'TOO_MANY_REQUESTS',
        message: 'చాలా ప్రయత్నాలు జరిగాయి. దయచేసి 15 నిమిషాల తర్వాత ప్రయత్నించండి / Too many requests, please try again after 15 minutes.'
    }
});

/**
 * Helper to record audit events
 */
async function recordAudit(userId, action, entityType, entityId, details) {
    try {
        await db.query(
            `INSERT INTO audit (user_id, action, entity_type, entity_id, details)
             VALUES ($1, $2, $3, $4, $5)`,
            [userId || null, action, entityType, entityId || null, JSON.stringify(details || {})]
        );
    } catch (err) {
        console.error('Audit log failed:', err.message);
    }
}

/**
 * POST /api/auth/signup
 */
router.post('/signup', authLimiter, async (req, res) => {
    try {
        const { name, phone, password, state, district, village, consent } = req.body;

        // 1. Validation
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({
                error: 'INVALID_NAME',
                message: 'దయచేసి మీ పేరును నమోదు చేయండి / Please enter your name.'
            });
        }

        const phoneClean = (phone || '').toString().trim();
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneClean)) {
            return res.status(400).json({
                error: 'INVALID_PHONE',
                message: 'చెల్లుబాటు అయ్యే 10 అంకెల భారతీయ మొబైల్ నంబర్ నమోదు చేయండి / Enter a valid 10-digit Indian phone number starting with 6-9.'
            });
        }

        if (!password || typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({
                error: 'INVALID_PASSWORD',
                message: 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి / Password must be at least 6 characters long.'
            });
        }

        if (!state || !district || !village) {
            return res.status(400).json({
                error: 'MISSING_LOCATION',
                message: 'దయచేసి మీ రాష్ట్రం, జిల్లా, మరియు గ్రామం వివరాలు పూరించండి / Please select your state, district, and village.'
            });
        }

        if (consent !== true && consent !== 'true' && consent !== 1) {
            return res.status(400).json({
                error: 'CONSENT_REQUIRED',
                message: 'దయచేసి డేటా గోప్యతా నియమాలను అంగీకరించండి / Please accept the data storage consent to proceed.'
            });
        }

        // 2. Check if phone already registered
        const existing = await db.query('SELECT id FROM users WHERE phone = $1', [phoneClean]);
        if (existing.rows.length > 0) {
            return res.status(409).json({
                error: 'PHONE_EXISTS',
                message: 'ఈ మొబైల్ నంబర్ ఇప్పటికే నమోదు చేయబడింది. దయచేసి లాగిన్ అవ్వండి / This phone number is already registered. Please log in.'
            });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 4. Insert user
        const result = await db.query(
            `INSERT INTO users (name, phone, password_hash, state, district, village, consent_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())
             RETURNING id, name, phone, state, district, village, consent_at, created_at`,
            [name.trim(), phoneClean, passwordHash, state.trim(), district.trim(), village.trim()]
        );

        const newUser = result.rows[0];

        // 5. Audit Log
        await recordAudit(newUser.id, 'CREATE', 'users', newUser.id, {
            phone: phoneClean,
            state: newUser.state,
            district: newUser.district,
            village: newUser.village
        });

        // 6. Generate JWT
        const token = jwt.sign(
            {
                id: newUser.id,
                name: newUser.name,
                phone: newUser.phone,
                state: newUser.state,
                district: newUser.district,
                village: newUser.village
            },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        // 7. Set HTTP-Only Cookie
        res.cookie('sk_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return res.status(201).json({
            success: true,
            message: 'ఖాతా విజయవంతంగా సృష్టించబడింది / Account created successfully.',
            user: {
                id: newUser.id,
                name: newUser.name,
                phone: newUser.phone,
                state: newUser.state,
                district: newUser.district,
                village: newUser.village
            },
            token
        });
    } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({
            error: 'SERVER_ERROR',
            message: 'ఖాతా సృష్టించడంలో సమస్య ఏర్పడింది / Failed to create account. Please try again.'
        });
    }
});

/**
 * POST /api/auth/login
 */
router.post('/login', authLimiter, async (req, res) => {
    try {
        const { phone, password } = req.body;

        const phoneClean = (phone || '').toString().trim();
        if (!phoneClean || !password) {
            return res.status(400).json({
                error: 'MISSING_FIELDS',
                message: 'మొబైల్ నంబర్ మరియు పాస్‌వర్డ్ నమోదు చేయండి / Phone number and password are required.'
            });
        }

        // Find user
        const result = await db.query(
            `SELECT id, name, phone, password_hash, state, district, village
             FROM users WHERE phone = $1`,
            [phoneClean]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: 'INVALID_CREDENTIALS',
                message: 'మొబైల్ నంబర్ లేదా పాస్‌వర్డ్ తప్పుగా ఉంది / Invalid phone number or password.'
            });
        }

        const user = result.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                error: 'INVALID_CREDENTIALS',
                message: 'మొబైల్ నంబర్ లేదా పాస్‌వర్డ్ తప్పుగా ఉంది / Invalid phone number or password.'
            });
        }

        // Record audit
        await recordAudit(user.id, 'LOGIN', 'users', user.id, {
            phone: user.phone,
            ip: req.ip
        });

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                phone: user.phone,
                state: user.state,
                district: user.district,
                village: user.village
            },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Set Cookie
        res.cookie('sk_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        return res.json({
            success: true,
            message: 'విజయవంతంగా లాగిన్ అయ్యారు / Logged in successfully.',
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                state: user.state,
                district: user.district,
                village: user.village
            },
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({
            error: 'SERVER_ERROR',
            message: 'లాగిన్ చేయడంలో లోపం ఏర్పడింది / Login failed. Please try again.'
        });
    }
});

/**
 * GET /api/auth/me
 * Returns currently authenticated user
 */
router.get('/me', requireAuth, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, name, phone, state, district, village, consent_at, created_at
             FROM users WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'USER_NOT_FOUND',
                message: 'వినియోగదారు దొరకలేదు / User not found.'
            });
        }

        return res.json({
            user: result.rows[0]
        });
    } catch (err) {
        return res.status(500).json({
            error: 'SERVER_ERROR',
            message: 'వివరాలు పొందడంలో లోపం / Failed to get user profile.'
        });
    }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
    res.clearCookie('sk_token', {
        httpOnly: true,
        sameSite: 'lax'
    });
    return res.json({
        success: true,
        message: 'లాగౌట్ విజయవంతమైంది / Logged out successfully.'
    });
});

/**
 * DELETE /api/auth/me
 * "Delete my account and all my data"
 * Cascades through foreign keys to delete all crop cycles, expenses, sales, and batches.
 */
router.delete('/me', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const client = await db.getClient();
    try {
        await client.query('BEGIN');

        // Record account deletion event before removing user
        await client.query(
            `INSERT INTO audit (user_id, action, entity_type, entity_id, details)
             VALUES ($1, 'DELETE', 'users', $1, $2)`,
            [userId, JSON.stringify({ reason: 'Farmer requested full account deletion', phone: req.user.phone })]
        );

        // Delete user (ON DELETE CASCADE removes cycles, expenses, sales, batches)
        await client.query('DELETE FROM users WHERE id = $1', [userId]);

        await client.query('COMMIT');

        res.clearCookie('sk_token', {
            httpOnly: true,
            sameSite: 'lax'
        });

        return res.json({
            success: true,
            message: 'మీ ఖాతా మరియు మొత్తం డేటా శాశ్వతంగా తొలగించబడింది / Your account and all associated data have been permanently deleted.'
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Account deletion error:', err);
        return res.status(500).json({
            error: 'DELETION_FAILED',
            message: 'ఖాతా తొలగించడంలో సమస్య ఏర్పడింది / Failed to delete account. Please try again.'
        });
    } finally {
        client.release();
    }
});

module.exports = router;
