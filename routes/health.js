/**
 * Smart Kisan - Health Check Route
 * Validates server status and database connectivity.
 */
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/health', async (req, res) => {
    const dbStatus = await db.testConnection();

    const health = {
        status: dbStatus.connected ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime_seconds: Math.floor(process.uptime()),
        database: {
            configured: db.isConfigured(),
            connected: dbStatus.connected,
            message: dbStatus.error ? `${dbStatus.message}: ${dbStatus.error}` : dbStatus.message,
            server_time: dbStatus.serverTime || null,
            db_name: dbStatus.database || null
        },
        services: {
            open_meteo_weather: 'ready',
            data_gov_mandi: process.env.DATA_GOV_KEY ? 'configured' : 'missing_api_key'
        }
    };

    const statusCode = dbStatus.connected ? 200 : 503;
    return res.status(statusCode).json(health);
});

module.exports = router;
