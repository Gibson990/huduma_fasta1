-- Migration to add provider system tables and fields

-- Add provider fields to users table if not exists
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS image VARCHAR(255),
  ADD COLUMN IF NOT EXISTS specialization VARCHAR(100),
  ADD COLUMN IF NOT EXISTS location VARCHAR(100),
  ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.5,
  ADD COLUMN IF NOT EXISTS totalJobs INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- Add provider_id to bookings table
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS provider_id INTEGER REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS customer_notes TEXT,
  ADD COLUMN IF NOT EXISTS provider_notes TEXT;

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
    id SERIAL PRIMARY KEY,
    provider_id INTEGER REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    receive_method VARCHAR(50) NOT NULL,
    account_details TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    notes TEXT
);

-- Update reviews table to work with users table instead of service_providers
ALTER TABLE reviews 
  DROP CONSTRAINT IF EXISTS reviews_provider_id_fkey;

-- Add the constraint back if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'reviews_provider_id_fkey' 
        AND table_name = 'reviews'
    ) THEN
        ALTER TABLE reviews 
        ADD CONSTRAINT reviews_provider_id_fkey 
        FOREIGN KEY (provider_id) REFERENCES users(id);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_provider_id ON withdrawals(provider_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status);
CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON reviews(provider_id); 