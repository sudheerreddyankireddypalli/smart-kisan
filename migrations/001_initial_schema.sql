-- Migration 001: Initial Schema
-- Creates all base tables with RLS and indexes

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(10) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_phone_format CHECK (phone ~ '^[6-9][0-9]{9}$')
);

CREATE TABLE IF NOT EXISTS cycles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_name VARCHAR(100) NOT NULL,
    crop_name_te VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    area_acres NUMERIC(8,2) NOT NULL CHECK (area_acres > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cycle_id BIGINT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'seed', 'fertilizer', 'pesticide', 'labour', 'water',
        'electricity', 'tractor', 'machinery', 'harvest', 'transport',
        'drying', 'packing', 'land_rent', 'interest', 'other'
    )),
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cycle_id BIGINT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    deductions NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (deductions >= 0),
    quantity NUMERIC(10,2) NOT NULL CHECK (quantity >= 0),
    unit VARCHAR(30) NOT NULL CHECK (unit IN ('Quintal', 'Kg', 'Bag', 'Ton', 'Box', 'Other')),
    buyer VARCHAR(255),
    sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    buyer_name VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(20),
    crop_name VARCHAR(100) NOT NULL,
    quantity_quintals NUMERIC(10,2) NOT NULL CHECK (quantity_quintals > 0),
    price_per_quintal NUMERIC(12,2) NOT NULL CHECK (price_per_quintal > 0),
    deduction_per_quintal NUMERIC(12,2) NOT NULL DEFAULT 0.00 CHECK (deduction_per_quintal >= 0),
    expiry_date DATE NOT NULL,
    terms TEXT,
    state VARCHAR(100),
    district VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS providers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('labour', 'drone', 'machinery', 'transport')),
    area VARCHAR(255) NOT NULL,
    state VARCHAR(100),
    district VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    quote_rate VARCHAR(255),
    rating NUMERIC(2,1) NOT NULL DEFAULT 4.5 CHECK (rating >= 1.0 AND rating <= 5.0),
    is_verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batches (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cycle_id BIGINT REFERENCES cycles(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    batch_code VARCHAR(100) NOT NULL UNIQUE,
    crop_name VARCHAR(100) NOT NULL,
    harvest_date DATE NOT NULL DEFAULT CURRENT_DATE,
    quantity_kg NUMERIC(10,2) NOT NULL CHECK (quantity_kg >= 0),
    moisture_percent NUMERIC(5,2),
    grade VARCHAR(50) NOT NULL DEFAULT 'Standard',
    status VARCHAR(50) NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'dried', 'milled', 'packed', 'sold')),
    certification_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_cycles_user_id ON cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_cycles_status ON cycles(status);
CREATE INDEX IF NOT EXISTS idx_expenses_cycle_id ON expenses(cycle_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_cycle_id ON sales(cycle_id);
CREATE INDEX IF NOT EXISTS idx_sales_user_id ON sales(user_id);
CREATE INDEX IF NOT EXISTS idx_batches_cycle_id ON batches(cycle_id);
CREATE INDEX IF NOT EXISTS idx_batches_user_id ON batches(user_id);
CREATE INDEX IF NOT EXISTS idx_offers_crop ON offers(crop_name);
CREATE INDEX IF NOT EXISTS idx_offers_expiry ON offers(expiry_date);
CREATE INDEX IF NOT EXISTS idx_providers_service_type ON providers(service_type);
CREATE INDEX IF NOT EXISTS idx_providers_district ON providers(district);
CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit(user_id);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit ENABLE ROW LEVEL SECURITY;
