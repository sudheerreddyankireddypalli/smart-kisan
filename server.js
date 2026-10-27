/**
 * Smart Kisan (స్మార్ట్ కిసాన్) - Main Application Server
 * Telugu-first farmer support web app for farmers across India.
 */
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Parsing Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api', require('./routes/health'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cycles', require('./routes/cycles'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/profit', require('./routes/profit'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/mandi', require('./routes/mandi'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/services', require('./routes/services'));
app.use('/api/batches', require('./routes/batches'));
app.use('/api/reminders', require('./routes/reminders'));

// SPA Fallback: Any other non-API route serves index.html
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'NOT_FOUND', message: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Unhandled server error:', err);
    res.status(err.status || 500).json({
        error: 'INTERNAL_ERROR',
        message: 'సర్వర్‌లో అంతర్గత లోపం ఏర్పడింది. దయచేసి మళ్లీ ప్రయత్నించండి / An internal server error occurred.'
    });
});

// Start Server if directly invoked
if (require.main === module) {
    const server = app.listen(PORT, async () => {
        console.log(`=======================================================`);
        console.log(`🌾 Smart Kisan (స్మార్ట్ కిసాన్) Server Running`);
        console.log(`📡 URL: http://localhost:${PORT}`);
        console.log(`🌱 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`=======================================================`);

        // Test database connectivity
        const health = await db.testConnection();
        if (health.connected) {
            console.log(`✅ Supabase Postgres: Connected successfully (${health.database})`);
        } else {
            console.warn(`⚠️ Supabase Postgres: ${health.message}`);
            console.warn(`ℹ️ Set DATABASE_URL in .env to connect to your live database.`);
        }
    });

    process.on('SIGTERM', () => {
        console.log('SIGTERM received. Shutting down gracefully...');
        server.close(async () => {
            await db.closePool();
            process.exit(0);
        });
    });
}

module.exports = app;
