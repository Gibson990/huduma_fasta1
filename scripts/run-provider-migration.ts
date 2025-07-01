import { query } from '../huduma-faster/lib/db';

async function runMigration() {
  try {
    console.log('Running provider system migration...');

    // Add provider fields to users table
    await query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS image VARCHAR(255),
        ADD COLUMN IF NOT EXISTS specialization VARCHAR(100),
        ADD COLUMN IF NOT EXISTS location VARCHAR(100),
        ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.5,
        ADD COLUMN IF NOT EXISTS totalJobs INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false
    `);
    console.log('✓ Added provider fields to users table');

    // Add provider_id to bookings table
    await query(`
      ALTER TABLE bookings
        ADD COLUMN IF NOT EXISTS provider_id INTEGER REFERENCES users(id),
        ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS customer_notes TEXT,
        ADD COLUMN IF NOT EXISTS provider_notes TEXT
    `);
    console.log('✓ Added provider fields to bookings table');

    // Create withdrawals table
    await query(`
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
      )
    `);
    console.log('✓ Created withdrawals table');

    // Create indexes
    await query('CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)');
    await query('CREATE INDEX IF NOT EXISTS idx_withdrawals_provider_id ON withdrawals(provider_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_withdrawals_status ON withdrawals(status)');
    await query('CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON reviews(provider_id)');
    console.log('✓ Created indexes');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

runMigration(); 