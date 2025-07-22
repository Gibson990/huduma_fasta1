-- Migration: Add admin functionality fields to existing tables
-- Run this script to add the necessary fields for admin dashboard

-- Add provider_id to bookings table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'provider_id') THEN
        ALTER TABLE bookings ADD COLUMN provider_id INTEGER;
    END IF;
END $$;

-- Add admin_id to bookings table for assignment tracking
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'admin_id') THEN
        ALTER TABLE bookings ADD COLUMN admin_id INTEGER;
    END IF;
END $$;

-- Add assigned_at timestamp to bookings table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'assigned_at') THEN
        ALTER TABLE bookings ADD COLUMN assigned_at TIMESTAMP;
    END IF;
END $$;

-- Add urgency_level enum to bookings table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'bookings' AND column_name = 'urgency_level') THEN
        ALTER TABLE bookings ADD COLUMN urgency_level VARCHAR(10) DEFAULT 'medium';
    END IF;
END $$;

-- Add total_earnings to providers table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'providers' AND column_name = 'total_earnings') THEN
        ALTER TABLE providers ADD COLUMN total_earnings DECIMAL(10,2) DEFAULT 0;
    END IF;
END $$;

-- Add rating to providers table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'providers' AND column_name = 'rating') THEN
        ALTER TABLE providers ADD COLUMN rating DECIMAL(3,2) DEFAULT 0;
    END IF;
END $$;

-- Add total_jobs to providers table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'providers' AND column_name = 'total_jobs') THEN
        ALTER TABLE providers ADD COLUMN total_jobs INTEGER DEFAULT 0;
    END IF;
END $$;

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

-- Add comments for documentation
COMMENT ON COLUMN bookings.provider_id IS 'ID of the provider assigned to this booking';
COMMENT ON COLUMN bookings.admin_id IS 'ID of the admin who assigned the provider';
COMMENT ON COLUMN bookings.assigned_at IS 'Timestamp when the provider was assigned';
COMMENT ON COLUMN bookings.urgency_level IS 'Urgency level: low, medium, high';
COMMENT ON COLUMN providers.total_earnings IS 'Total earnings from completed jobs';
COMMENT ON COLUMN providers.rating IS 'Average rating from customer reviews';
COMMENT ON COLUMN providers.total_jobs IS 'Total number of completed jobs'; 