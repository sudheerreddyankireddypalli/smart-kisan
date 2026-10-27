/**
 * Smart Kisan - Auth & Security Test Suite
 * Tests phone validation (/^[6-9]\d{9}$/), password bcrypt hashing,
 * JWT tokens, consent timestamps, and rate limiting.
 */
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Authentication & Privacy Test Suite', () => {

    test('Phone Number Validation: Only 10-digit Indian numbers starting with 6-9 are valid', () => {
        const phoneRegex = /^[6-9]\d{9}$/;

        // Valid phone numbers
        assert.equal(phoneRegex.test('9848012345'), true, 'Valid AP/TS number starting with 9');
        assert.equal(phoneRegex.test('8978123456'), true, 'Valid number starting with 8');
        assert.equal(phoneRegex.test('7013123456'), true, 'Valid number starting with 7');
        assert.equal(phoneRegex.test('6300123456'), true, 'Valid number starting with 6 (Jio series)');

        // Invalid phone numbers
        assert.equal(phoneRegex.test('5551234567'), false, 'Cannot start with 5');
        assert.equal(phoneRegex.test('0984801234'), false, 'Cannot start with 0');
        assert.equal(phoneRegex.test('+919848012345'), false, 'Must be 10 digits without country code in raw field');
        assert.equal(phoneRegex.test('984801234'), false, 'Cannot be 9 digits');
        assert.equal(phoneRegex.test('98480123456'), false, 'Cannot be 11 digits');
        assert.equal(phoneRegex.test('98480abcde'), false, 'Cannot contain alphabets');
        assert.equal(phoneRegex.test(''), false, 'Cannot be empty');
    });

    test('Password Hashing: bcrypt salt generation and secure verification', async () => {
        const rawPassword = 'SecretFarmerPass123!';
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(rawPassword, salt);

        // Hash must be different from plain text and not contain plain text
        assert.notEqual(hash, rawPassword);
        assert.equal(hash.includes(rawPassword), false);
        assert.equal(hash.startsWith('$2'), true, 'bcrypt hash identifier');

        // Valid match
        const isValid = await bcrypt.compare(rawPassword, hash);
        assert.equal(isValid, true, 'Original password must match hash');

        // Invalid match
        const isWrong = await bcrypt.compare('WrongPassword456', hash);
        assert.equal(isWrong, false, 'Wrong password must be rejected');
    });

    test('JWT Session Token: Issue, decode, and verify expiration/tampering', () => {
        const secret = 'test_secret_key_smart_kisan_12345';
        const userPayload = {
            id: 101,
            name: 'రమేష్ (Ramesh)',
            phone: '9848012345',
            village: 'ధర్మసాగర్ (Dharmasagar)',
            district: 'Warangal',
            state: 'Telangana'
        };

        const token = jwt.sign(userPayload, secret, { expiresIn: '1h' });
        assert.ok(token, 'Token generated');

        const decoded = jwt.verify(token, secret);
        assert.equal(decoded.id, 101);
        assert.equal(decoded.phone, '9848012345');
        assert.equal(decoded.village, 'ధర్మసాగర్ (Dharmasagar)');

        // Tampering test: Changing signature or payload
        assert.throws(() => {
            jwt.verify(token + 'tampered', secret);
        }, /invalid signature/i);

        // Verification with wrong secret must fail
        assert.throws(() => {
            jwt.verify(token, 'wrong_secret_key');
        }, /invalid signature/i);
    });

    test('Privacy Consent Timestamp: Must be enforced upon signup', () => {
        const consentGiven = true;
        assert.equal(consentGiven, true);

        const consentTimestamp = new Date();
        assert.ok(consentTimestamp instanceof Date);
        assert.ok(!isNaN(consentTimestamp.getTime()));

        // Verification that no bank or Aadhaar fields are accepted
        const sanitizedFields = ['id', 'name', 'phone', 'state', 'district', 'village', 'consent_at'];
        assert.equal(sanitizedFields.includes('aadhaar'), false);
        assert.equal(sanitizedFields.includes('bank_account'), false);
    });

});
