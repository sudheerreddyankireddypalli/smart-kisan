/**
 * Smart Kisan (స్మార్ట్ కిసాన్) - Database Client
 * Supabase Postgres Connection Pool with SSL & Parameterized Query Enforcement
 */
require('dotenv').config();
const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL;

let pool = null;
let isConfigured = false;

if (databaseUrl && databaseUrl.trim().length > 0) {
    const isSupabase = databaseUrl.includes('supabase') || databaseUrl.includes('pooler.supabase.com');
    const sslOption = process.env.NODE_ENV === 'production' || isSupabase || process.env.PGSSLMODE === 'require'
        ? { rejectUnauthorized: false }
        : false;

    // Strip sslmode from query string so pg respects rejectUnauthorized: false
    const cleanConnectionString = databaseUrl.replace(/[?&]sslmode=[^&]+/g, '');

    pool = new Pool({
        connectionString: cleanConnectionString,
        ssl: sslOption,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
        console.error('Unexpected error on idle PostgreSQL client pool:', err);
    });

    isConfigured = true;
} else {
    console.warn('⚠️ DATABASE_URL is not set in environment or .env file. Database calls will fail until configured.');
}

/**
 * Executes a parameterized query using the pool.
 * @param {string} text - The parameterized SQL query string
 * @param {Array} params - Array of parameter values ($1, $2, etc.)
 */
async function query(text, params = []) {
    if (!pool) {
        throw new Error('DATABASE_URL is not configured. Please set DATABASE_URL in your .env file.');
    }
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        if (process.env.NODE_ENV === 'development' && duration > 500) {
            console.log(`Executed query (${duration}ms):`, { text, rows: res.rowCount });
        }
        return res;
    } catch (err) {
        console.error('Database query error:', { text, params, error: err.message });
        throw err;
    }
}

/**
 * Gets a dedicated client from the pool for transactions.
 */
async function getClient() {
    if (!pool) {
        throw new Error('DATABASE_URL is not configured. Please set DATABASE_URL in your .env file.');
    }
    return await pool.connect();
}

/**
 * Tests connection to Postgres.
 */
async function testConnection() {
    if (!pool) {
        return {
            connected: false,
            message: 'DATABASE_URL is not configured in .env'
        };
    }
    try {
        const result = await pool.query('SELECT NOW() AS now, current_database() AS db');
        return {
            connected: true,
            serverTime: result.rows[0].now,
            database: result.rows[0].db,
            message: 'Connected to Supabase Postgres database successfully'
        };
    } catch (err) {
        return {
            connected: false,
            error: err.message,
            message: 'Failed to connect to database'
        };
    }
}

/**
 * Gracefully shuts down the pool.
 */
async function closePool() {
    if (pool) {
        await pool.end();
    }
}

module.exports = {
    query,
    getClient,
    testConnection,
    closePool,
    isConfigured: () => isConfigured,
    getPool: () => pool,
    setPool: (newPool) => { pool = newPool; isConfigured = !!newPool; }
};
