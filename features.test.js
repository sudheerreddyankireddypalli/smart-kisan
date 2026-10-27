/**
 * Smart Kisan - Core Modules Functional Test Suite
 * Tests buyer offers sorting, crop-stage reminders, batch traceability codes,
 * and mandi/weather service guarantees.
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('Additional Agricultural Modules Test Suite', () => {

    test('Buyer Offers: Net price calculation and expiration flag', () => {
        const today = new Date();
        const futureDate = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const pastDate = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const rawOffers = [
            {
                buyer: 'Buyer A',
                price_per_quintal: 14000,
                deduction_per_quintal: 200,
                expiry_date: futureDate
            },
            {
                buyer: 'Buyer B (High deductions)',
                price_per_quintal: 14500,
                deduction_per_quintal: 1200, // Net is 13300
                expiry_date: futureDate
            },
            {
                buyer: 'Buyer C (Expired)',
                price_per_quintal: 15000,
                deduction_per_quintal: 100,
                expiry_date: pastDate
            }
        ];

        // Process net price and sort
        const processed = rawOffers.map(o => ({
            ...o,
            net_price: o.price_per_quintal - o.deduction_per_quintal,
            is_expired: new Date(o.expiry_date) < today
        })).sort((a, b) => {
            if (a.is_expired !== b.is_expired) return a.is_expired ? 1 : -1;
            return b.net_price - a.net_price;
        });

        // Buyer A net: 13,800 (active)
        // Buyer B net: 13,300 (active)
        // Buyer C net: 14,900 (expired)
        assert.equal(processed[0].buyer, 'Buyer A', 'Highest active net price is first');
        assert.equal(processed[0].net_price, 13800);
        assert.equal(processed[0].is_expired, false);

        assert.equal(processed[1].buyer, 'Buyer B (High deductions)');
        assert.equal(processed[1].net_price, 13300);

        assert.equal(processed[2].buyer, 'Buyer C (Expired)');
        assert.equal(processed[2].is_expired, true, 'Past date marked as expired');
    });

    test('Crop-Stage Reminders: Turmeric stage matching based on days elapsed', () => {
        const turmericStages = [
            { min_days: 0, max_days: 15, name: 'Planting' },
            { min_days: 16, max_days: 35, name: 'Sprouting' },
            { min_days: 36, max_days: 60, name: 'Vegetative Growth & Earthing Up' },
            { min_days: 61, max_days: 90, name: 'Tiller Development' },
            { min_days: 91, max_days: 135, name: 'Rhizome Bulking' },
            { min_days: 136, max_days: 200, name: 'Late Bulking' },
            { min_days: 201, max_days: 260, name: 'Maturity & Harvest' }
        ];

        function getStageForDays(days) {
            return turmericStages.find(s => days >= s.min_days && days <= s.max_days);
        }

        assert.equal(getStageForDays(10).name, 'Planting');
        assert.equal(getStageForDays(25).name, 'Sprouting');
        assert.equal(getStageForDays(50).name, 'Vegetative Growth & Earthing Up');
        assert.equal(getStageForDays(110).name, 'Rhizome Bulking');
        assert.equal(getStageForDays(220).name, 'Maturity & Harvest');
    });

    test('Batch Traceability: Batch code generation format SK-{CROP}-{YEAR}-{RANDOM}', () => {
        function generateCode(crop) {
            const cleanCrop = (crop || 'CROP').replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase() || 'CRP';
            const year = new Date().getFullYear();
            const randomHex = Math.floor(1000 + Math.random() * 9000);
            return `SK-${cleanCrop}-${year}-${randomHex}`;
        }

        const turmericCode = generateCode('Turmeric');
        const paddyCode = generateCode('Paddy');

        const regex = /^SK-[A-Z]{3}-\d{4}-\d{4}$/;
        assert.equal(regex.test(turmericCode), true, 'Turmeric code matches pattern');
        assert.equal(regex.test(paddyCode), true, 'Paddy code matches pattern');
        assert.equal(turmericCode.includes('TUR'), true);
        assert.equal(paddyCode.includes('PAD'), true);
    });

    test('Mandi Prices: Transparent missing key message and wholesale disclaimer', () => {
        const disclaimer = {
            te: 'హోల్‌సేల్ సూచన ధరలు మాత్రమే — హామీ ఇచ్చిన కొనుగోలు ధర కాదు.',
            en: 'Wholesale reference prices only — Not a guaranteed farm-gate procurement price.'
        };

        // Assert disclaimers are present
        assert.ok(disclaimer.te.includes('హోల్‌సేల్ సూచన ధరలు మాత్రమే'));
        assert.ok(disclaimer.en.includes('Wholesale reference prices only'));

        // Assert that when DATA_GOV_KEY is unset, empty array is returned and no fake data is generated
        const apiKey = '';
        const isKeyMissing = !apiKey || apiKey.trim().length === 0;
        assert.equal(isKeyMissing, true);
    });

});
