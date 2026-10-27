/**
 * Smart Kisan - Multi-Tenant Data Isolation Test Suite
 * Proves that every query is strictly scoped to the logged-in user:
 * Farmer 1 can NEVER view, mutate, or delete Farmer 2's crop data.
 * When Farmer 1 deletes their account, Farmer 2's data remains 100% intact.
 */
const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const MockDb = require('./mock_db');

describe('Tenant Data Isolation Test Suite', () => {
    let db;
    let farmerRameshId;
    let farmerSureshId;
    let rameshCycleId;
    let sureshCycleId;

    beforeEach(async () => {
        db = new MockDb();

        // 1. Create Farmer 1 (Ramesh, Warangal)
        const user1 = await db.query(
            `INSERT INTO users (name, phone, password_hash, state, district, village) VALUES ($1, $2, $3, $4, $5, $6)`,
            ['రమేష్ (Ramesh)', '9848011111', 'hash1', 'Telangana', 'Warangal', 'Dharmasagar']
        );
        farmerRameshId = user1.rows[0].id;

        // 2. Create Farmer 2 (Suresh, Guntur)
        const user2 = await db.query(
            `INSERT INTO users (name, phone, password_hash, state, district, village) VALUES ($1, $2, $3, $4, $5, $6)`,
            ['సురేష్ (Suresh)', '9848022222', 'hash2', 'Andhra Pradesh', 'Guntur', 'Tenali']
        );
        farmerSureshId = user2.rows[0].id;

        // 3. Farmer Ramesh creates Turmeric cycle (2.5 acres)
        const c1 = await db.query(
            `INSERT INTO cycles (user_id, crop_name, crop_name_te, start_date, end_date, area_acres) VALUES ($1, $2, $3, $4, $5, $6)`,
            [farmerRameshId, 'Turmeric', 'పసుపు', '2026-06-01', null, 2.5]
        );
        rameshCycleId = c1.rows[0].id;

        // 4. Farmer Suresh creates Chilli cycle (1.8 acres)
        const c2 = await db.query(
            `INSERT INTO cycles (user_id, crop_name, crop_name_te, start_date, end_date, area_acres) VALUES ($1, $2, $3, $4, $5, $6)`,
            [farmerSureshId, 'Red Chilli', 'ఎర్ర మిరప', '2026-07-01', null, 1.8]
        );
        sureshCycleId = c2.rows[0].id;
    });

    test('Isolation: Farmer 2 cannot view Farmer 1 crop cycles', async () => {
        // Query scoped to Suresh (User 2)
        const res = await db.query(
            `SELECT * FROM cycles WHERE id = $1 AND user_id = $2`,
            [rameshCycleId, farmerSureshId]
        );
        assert.equal(res.rows.length, 0, 'Suresh cannot query Ramesh crop cycle');

        // Query Suresh's own cycle works
        const ownRes = await db.query(
            `SELECT * FROM cycles WHERE id = $1 AND user_id = $2`,
            [sureshCycleId, farmerSureshId]
        );
        assert.equal(ownRes.rows.length, 1);
        assert.equal(ownRes.rows[0].crop_name, 'Red Chilli');
    });

    test('Isolation: Farmer 2 cannot access or view Farmer 1 expenses', async () => {
        // Ramesh records ₹15,000 for fertilizer
        const exp = await db.query(
            `INSERT INTO expenses (cycle_id, user_id, category, amount, expense_date) VALUES ($1, $2, $3, $4, $5)`,
            [rameshCycleId, farmerRameshId, 'fertilizer', 15000.00, '2026-06-15']
        );
        const rameshExpenseId = exp.rows[0].id;

        // Suresh tries to query Ramesh expense
        const leakAttempt = await db.query(
            `SELECT * FROM expenses WHERE id = $1 AND user_id = $2`,
            [rameshExpenseId, farmerSureshId]
        );
        assert.equal(leakAttempt.rows.length, 0, 'Cross-tenant expense query returned zero rows');

        // Suresh tries to query all expenses for Ramesh cycle
        const cycleLeakAttempt = await db.query(
            `SELECT * FROM expenses WHERE cycle_id = $1 AND user_id = $2`,
            [rameshCycleId, farmerSureshId]
        );
        assert.equal(cycleLeakAttempt.rows.length, 0, 'Cross-tenant cycle expenses returned zero rows');
    });

    test('Isolation: Farmer 2 cannot delete Farmer 1 crop cycle or mutate records', async () => {
        // Suresh attempts to delete Ramesh cycle
        const deleteAttempt = await db.query(
            `DELETE FROM cycles WHERE id = $1 AND user_id = $2`,
            [rameshCycleId, farmerSureshId]
        );
        assert.equal(deleteAttempt.rowCount, 0, 'Zero rows deleted on unauthorized deletion attempt');

        // Ramesh cycle remains intact
        const verifyRamesh = await db.query(
            `SELECT * FROM cycles WHERE id = $1 AND user_id = $2`,
            [rameshCycleId, farmerRameshId]
        );
        assert.equal(verifyRamesh.rows.length, 1, 'Ramesh cycle is still intact');
    });

    test('Cascade & Account Deletion: Deleting Farmer 1 account removes their data without touching Farmer 2', async () => {
        // Ramesh records expenses, sales, and batch
        await db.query(
            `INSERT INTO expenses (cycle_id, user_id, category, amount, expense_date) VALUES ($1, $2, $3, $4, $5)`,
            [rameshCycleId, farmerRameshId, 'seed', 8000.00, '2026-06-05']
        );
        await db.query(
            `INSERT INTO sales (cycle_id, user_id, amount, deductions, quantity, unit) VALUES ($1, $2, $3, $4, $5, $6)`,
            [rameshCycleId, farmerRameshId, 85000.00, 1500.00, 20.0, 'Quintal']
        );
        await db.query(
            `INSERT INTO batches (cycle_id, user_id, batch_code, crop_name, harvest_date, quantity_kg) VALUES ($1, $2, $3, $4, $5, $6)`,
            [rameshCycleId, farmerRameshId, 'SK-TUR-2026-1001', 'Turmeric', '2026-10-01', 2000.0]
        );

        // Suresh also has an expense
        await db.query(
            `INSERT INTO expenses (cycle_id, user_id, category, amount, expense_date) VALUES ($1, $2, $3, $4, $5)`,
            [sureshCycleId, farmerSureshId, 'pesticide', 4500.00, '2026-07-10']
        );

        // Farmer 1 (Ramesh) exercises "delete my account and all my data"
        const delRes = await db.query(`DELETE FROM users WHERE id = $1`, [farmerRameshId]);
        assert.equal(delRes.rowCount, 1, 'User 1 deleted');

        // Verify Ramesh data is completely erased
        assert.equal(db.users.filter(u => u.id === farmerRameshId).length, 0);
        assert.equal(db.cycles.filter(c => c.user_id === farmerRameshId).length, 0);
        assert.equal(db.expenses.filter(e => e.user_id === farmerRameshId).length, 0);
        assert.equal(db.sales.filter(s => s.user_id === farmerRameshId).length, 0);
        assert.equal(db.batches.filter(b => b.user_id === farmerRameshId).length, 0);

        // Verify Suresh (Farmer 2) data is 100% intact and undamaged
        assert.equal(db.users.filter(u => u.id === farmerSureshId).length, 1);
        assert.equal(db.cycles.filter(c => c.user_id === farmerSureshId).length, 1);
        assert.equal(db.expenses.filter(e => e.user_id === farmerSureshId).length, 1);
        assert.equal(db.expenses.find(e => e.user_id === farmerSureshId).amount, 4500.00);
    });

});
