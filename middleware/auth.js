/**
 * Smart Kisan - Authentication & Tenant Isolation Middleware
 * Enforces JWT verification and populates req.user.
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'smart_kisan_default_secret_key_change_in_prod';

function requireAuth(req, res, next) {
    const token = req.cookies?.sk_token ||
        (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : null);

    if (!token) {
        return res.status(401).json({
            error: 'UNAUTHORIZED',
            message: 'దయచేసి లాగిన్ అవ్వండి / Please log in to continue.',
            code: 'AUTH_REQUIRED'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie('sk_token', { httpOnly: true, sameSite: 'lax' });
        return res.status(401).json({
            error: 'INVALID_TOKEN',
            message: 'సెషన్ ముగిసింది, దయచేసి మళ్లీ లాగిన్ చేయండి / Session expired, please log in again.',
            code: 'TOKEN_EXPIRED_OR_INVALID'
        });
    }
}

function optionalAuth(req, res, next) {
    const token = req.cookies?.sk_token ||
        (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : null);

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            req.user = null;
        }
    } else {
        req.user = null;
    }
    next();
}

module.exports = {
    requireAuth,
    optionalAuth,
    JWT_SECRET
};
