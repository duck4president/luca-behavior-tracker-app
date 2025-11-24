-- Lucas Behavior Tracker Database Schema
-- Run this in your Supabase SQL editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Daily entries table
CREATE TABLE daily_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 7),
    tantrum_rating INTEGER NOT NULL CHECK (tantrum_rating >= 1 AND tantrum_rating <= 7),
    focus_rating INTEGER NOT NULL CHECK (focus_rating >= 1 AND focus_rating <= 7),
    iep_score INTEGER CHECK (iep_score >= 1 AND iep_score <= 72),
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medications table
CREATE TABLE medications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily medications junction table
CREATE TABLE daily_medications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    daily_entry_id UUID REFERENCES daily_entries(id) ON DELETE CASCADE,
    medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
    taken BOOLEAN DEFAULT FALSE,
    UNIQUE(daily_entry_id, medication_id)
);

-- Tantrum behaviors table
CREATE TABLE tantrum_behaviors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    daily_entry_id UUID REFERENCES daily_entries(id) ON DELETE CASCADE UNIQUE,
    screaming BOOLEAN DEFAULT FALSE,
    swearing BOOLEAN DEFAULT FALSE,
    throwing BOOLEAN DEFAULT FALSE,
    hitting BOOLEAN DEFAULT FALSE,
    threatening BOOLEAN DEFAULT FALSE
);

-- Chart annotations table (for future use)
CREATE TABLE chart_annotations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_daily_entries_date ON daily_entries(date DESC);
CREATE INDEX idx_daily_medications_entry ON daily_medications(daily_entry_id);
CREATE INDEX idx_tantrum_behaviors_entry ON tantrum_behaviors(daily_entry_id);
CREATE INDEX idx_medications_active ON medications(is_active) WHERE is_active = TRUE;

-- Enable Row Level Security (RLS) - Optional, for multi-user setups
-- ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_medications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tantrum_behaviors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chart_annotations ENABLE ROW LEVEL SECURITY;

-- Sample medications (optional - you can add these through the app instead)
INSERT INTO medications (name, is_active) VALUES 
    ('Morning Vitamin', TRUE),
    ('Evening Melatonin', TRUE),
    ('Omega-3 Supplement', TRUE);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at on daily_entries
CREATE TRIGGER update_daily_entries_updated_at 
    BEFORE UPDATE ON daily_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL ON daily_entries TO authenticated;
-- GRANT ALL ON medications TO authenticated;
-- GRANT ALL ON daily_medications TO authenticated;
-- GRANT ALL ON tantrum_behaviors TO authenticated;
-- GRANT ALL ON chart_annotations TO authenticated;
