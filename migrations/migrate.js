/**
 * Smart Kisan - Database Migration Runner
 * Applies numbered SQL migrations transactionally.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function runMigrations() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        console.error('❌ Error: DATABASE_URL is not set in environment or .env');
        process.exit(1);
    }

    // Strip sslmode from query string to avoid pg overriding rejectUnauthorized
    const cleanConnectionString = databaseUrl.replace(/[?&]sslmode=[^&]+/g, '');
    const sslConfig = process.env.NODE_ENV === 'production' || databaseUrl.includes('supabase')
        ? { rejectUnauthorized: false }
        : false;

    const pool = new Pool({
        connectionString: cleanConnectionString,
        ssl: sslConfig
    });

    const client = await pool.connect();

    try {
        console.log('🚀 Starting Smart Kisan database migrations...');

        // 1. Ensure migrations meta table exists
        await client.query(`
            CREATE TABLE IF NOT EXISTS migrations_meta (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        // 2. Read all .sql files
        const migrationsDir = __dirname;
        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();

        // 3. Check already applied migrations
        const { rows } = await client.query('SELECT name FROM migrations_meta');
        const applied = new Set(rows.map(r => r.name));

        let count = 0;
        for (const file of files) {
            if (applied.has(file)) {
                console.log(`⏩ Skipping already applied migration: ${file}`);
                continue;
            }

            console.log(`⏳ Applying migration: ${file}...`);
            const filePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(filePath, 'utf8');

            await client.query('BEGIN');
            try {
                await client.query(sql);
                await client.query('INSERT INTO migrations_meta (name) VALUES ($1)', [file]);
                await client.query('COMMIT');
                console.log(`✅ Applied migration: ${file}`);
                count++;
            } catch (err) {
                await client.query('ROLLBACK');
                console.error(`❌ Migration failed in ${file}:`, err.message);
                throw err;
            }
        }

        console.log(`🎉 Migrations complete. ${count} new migration(s) applied.`);
    } catch (err) {
        console.error('❌ Migration process failed:', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

if (require.main === module) {
    runMigrations();
}

module.exports = { runMigrations };
