-- Simple migration: Add admin functionality fields to existing tables

-- Add provider_id to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS provider_id INTEGER;

-- Add admin_id to bookings table for assignment tracking
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS admin_id INTEGER;

-- Add assigned_at timestamp to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP;

-- Add urgency_level to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS urgency_level VARCHAR(10) DEFAULT 'medium';

-- Create providers table if it doesn't exist
CREATE TABLE IF NOT EXISTS providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    specialization VARCHAR(100),
    location VARCHAR(100),
    image VARCHAR(255),
    rating DECIMAL(3,2) DEFAULT 0,
    total_jobs INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create assignment_history table for tracking provider assignments
CREATE TABLE IF NOT EXISTS assignment_history (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL,
    provider_id INTEGER NOT NULL,
    admin_id INTEGER NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'assigned',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_actions table for tracking admin activities
CREATE TABLE IF NOT EXISTS admin_actions (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id INTEGER NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_admin_id ON bookings(admin_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_assignment_history_booking_id ON assignment_history(booking_id);
CREATE INDEX IF NOT EXISTS idx_assignment_history_provider_id ON assignment_history(provider_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_admin_id ON admin_notifications(admin_id);

-- Update existing bookings to have default urgency level
UPDATE bookings SET urgency_level = 'medium' WHERE urgency_level IS NULL; 