/**
 * Smart Kisan - In-Memory Test Database Harness
 * Emulates PostgreSQL table operations and CASCADE deletes for hermetic unit & integration testing.
 */
class MockDb {
    constructor() {
        this.reset();
    }

    reset() {
        this.users = [];
        this.cycles = [];
        this.expenses = [];
        this.sales = [];
        this.offers = [];
        this.providers = [];
        this.batches = [];
        this.audit = [];
        this.nextId = {
            users: 1,
            cycles: 1,
            expenses: 1,
            sales: 1,
            offers: 1,
            providers: 1,
            batches: 1,
            audit: 1
        };
    }

    async query(text, params = []) {
        const sql = text.trim();
        const lower = sql.toLowerCase();

        // 1. SELECT NOW()
        if (lower.startsWith('select now()')) {
            return { rows: [{ now: new Date().toISOString(), db: 'mock_test_db' }], rowCount: 1 };
        }

        // 2. USERS: INSERT
        if (lower.startsWith('insert into users')) {
            const id = this.nextId.users++;
            const user = {
                id,
                name: params[0],
                phone: params[1],
                password_hash: params[2],
                state: params[3],
                district: params[4],
                village: params[5],
                consent_at: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            };
            this.users.push(user);
            return { rows: [user], rowCount: 1 };
        }

        // 3. USERS: SELECT
        if (lower.startsWith('select id from users where phone = $1')) {
            const found = this.users.filter(u => u.phone === params[0]);
            return { rows: found, rowCount: found.length };
        }
        if (lower.startsWith('select id, name, phone, password_hash')) {
            const found = this.users.filter(u => u.phone === params[0]);
            return { rows: found, rowCount: found.length };
        }
        if (lower.startsWith('select id, name, phone, state, district, village') && lower.includes('from users where id = $1')) {
            const found = this.users.filter(u => u.id === params[0]);
            return { rows: found, rowCount: found.length };
        }

        // 4. USERS: DELETE (CASCADE)
        if (lower.startsWith('delete from users where id = $1')) {
            const userId = params[0];
            this.users = this.users.filter(u => u.id !== userId);
            // Cascade delete cycles, expenses, sales, batches
            const cycleIdsToDelete = this.cycles.filter(c => c.user_id === userId).map(c => c.id);
            this.cycles = this.cycles.filter(c => c.user_id !== userId);
            this.expenses = this.expenses.filter(e => e.user_id !== userId);
            this.sales = this.sales.filter(s => s.user_id !== userId);
            this.batches = this.batches.filter(b => b.user_id !== userId);
            return { rowCount: 1 };
        }

        // 5. CYCLES: INSERT
        if (lower.startsWith('insert into cycles')) {
            const id = this.nextId.cycles++;
            const cycle = {
                id,
                user_id: params[0],
                crop_name: params[1],
                crop_name_te: params[2],
                start_date: params[3],
                end_date: params[4],
                area_acres: parseFloat(params[5]),
                status: params[6] || 'active',
                notes: params[7],
                created_at: new Date(),
                updated_at: new Date()
            };
            this.cycles.push(cycle);
            return { rows: [cycle], rowCount: 1 };
        }

        // 6. CYCLES: SELECT
        if (lower.includes('from cycles') && lower.includes('where id = $1 and user_id = $2')) {
            const found = this.cycles.filter(c => c.id === params[0] && c.user_id === params[1]);
            return { rows: found, rowCount: found.length };
        }
        if (lower.includes('from cycles') && lower.includes('where c.user_id = $1')) {
            const userCycles = this.cycles.filter(c => c.user_id === params[0]);
            const rows = userCycles.map(c => {
                const exps = this.expenses.filter(e => e.cycle_id === c.id);
                const sales = this.sales.filter(s => s.cycle_id === c.id);
                const totalExp = exps.reduce((acc, e) => acc + parseFloat(e.amount), 0);
                const grossSales = sales.reduce((acc, s) => acc + parseFloat(s.amount), 0);
                const totalDed = sales.reduce((acc, s) => acc + parseFloat(s.deductions || 0), 0);
                const netSales = grossSales - totalDed;
                const netProfit = netSales - totalExp;
                return {
                    ...c,
                    total_expenses: totalExp,
                    gross_sales: grossSales,
                    total_deductions: totalDed,
                    net_sales: netSales,
                    net_profit: netProfit
                };
            });
            return { rows, rowCount: rows.length };
        }

        // 7. CYCLES: DELETE (CASCADE)
        if (lower.startsWith('delete from cycles where id = $1 and user_id = $2')) {
            const cycleId = params[0];
            const userId = params[1];
            const initialLen = this.cycles.length;
            this.cycles = this.cycles.filter(c => !(c.id === cycleId && c.user_id === userId));
            // Cascade delete
            this.expenses = this.expenses.filter(e => e.cycle_id !== cycleId);
            this.sales = this.sales.filter(s => s.cycle_id !== cycleId);
            this.batches = this.batches.filter(b => b.cycle_id !== cycleId);
            return { rowCount: initialLen - this.cycles.length };
        }

        // 8. EXPENSES: INSERT
        if (lower.startsWith('insert into expenses')) {
            const id = this.nextId.expenses++;
            const exp = {
                id,
                cycle_id: params[0],
                user_id: params[1],
                category: params[2],
                amount: parseFloat(params[3]),
                expense_date: params[4],
                notes: params[5],
                created_at: new Date(),
                updated_at: new Date()
            };
            this.expenses.push(exp);
            return { rows: [exp], rowCount: 1 };
        }

        // 9. EXPENSES: SELECT
        if (lower.includes('from expenses') && lower.includes('where id = $1 and user_id = $2')) {
            const found = this.expenses.filter(e => e.id === params[0] && e.user_id === params[1]);
            return { rows: found, rowCount: found.length };
        }
        if (lower.includes('from expenses') && lower.includes('where cycle_id = $1 and user_id = $2')) {
            const found = this.expenses.filter(e => e.cycle_id === params[0] && e.user_id === params[1]);
            return { rows: found, rowCount: found.length };
        }

        // 10. SALES: INSERT
        if (lower.startsWith('insert into sales')) {
            const id = this.nextId.sales++;
            const sale = {
                id,
                cycle_id: params[0],
                user_id: params[1],
                amount: parseFloat(params[2]),
                deductions: parseFloat(params[3] || 0),
                quantity: parseFloat(params[4]),
                unit: params[5],
                buyer: params[6],
                sale_date: params[7],
                notes: params[8],
                created_at: new Date(),
                updated_at: new Date()
            };
            this.sales.push(sale);
            return { rows: [{ ...sale, net_sale_amount: sale.amount - sale.deductions }], rowCount: 1 };
        }

        // 11. SALES: SELECT
        if (lower.includes('from sales') && lower.includes('where id = $1 and user_id = $2')) {
            const found = this.sales.filter(s => s.id === params[0] && s.user_id === params[1]);
            return { rows: found, rowCount: found.length };
        }
        if (lower.includes('from sales') && lower.includes('where cycle_id = $1 and user_id = $2')) {
            const found = this.sales.filter(s => s.cycle_id === params[0] && s.user_id === params[1]);
            return { rows: found, rowCount: found.length };
        }

        // 12. BATCHES: INSERT
        if (lower.startsWith('insert into batches')) {
            const id = this.nextId.batches++;
            const batch = {
                id,
                cycle_id: params[0],
                user_id: params[1],
                batch_code: params[2],
                crop_name: params[3],
                harvest_date: params[4],
                quantity_kg: parseFloat(params[5]),
                moisture_percent: params[6] !== null ? parseFloat(params[6]) : null,
                grade: params[7],
                status: params[8],
                certification_notes: params[9],
                created_at: new Date(),
                updated_at: new Date()
            };
            this.batches.push(batch);
            return { rows: [batch], rowCount: 1 };
        }

        // 13. AUDIT: INSERT
        if (lower.startsWith('insert into audit')) {
            const id = this.nextId.audit++;
            const log = {
                id,
                user_id: params[0],
                action: params[1],
                entity_type: params[2],
                entity_id: params[3],
                details: params[4],
                created_at: new Date()
            };
            this.audit.push(log);
            return { rows: [log], rowCount: 1 };
        }

        // Transactions
        if (sql === 'BEGIN' || sql === 'COMMIT' || sql === 'ROLLBACK') {
            return { rows: [], rowCount: 0 };
        }

        return { rows: [], rowCount: 0 };
    }

    async getClient() {
        return {
            query: (text, params) => this.query(text, params),
            release: () => {}
        };
    }
}

module.exports = MockDb;
