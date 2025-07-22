const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432,
})

async function migrateProviderFields() {
  const client = await pool.connect()
  try {
    console.log('🔧 Adding provider fields to users table...')

    // Add provider fields to users table
    await client.query(`
      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS specialization VARCHAR(100),
        ADD COLUMN IF NOT EXISTS location VARCHAR(100),
        ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 4.5,
        ADD COLUMN IF NOT EXISTS totalJobs INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false
    `)
    console.log('✓ Added provider fields to users table')

    // Add provider_id to bookings table
    await client.query(`
      ALTER TABLE bookings
        ADD COLUMN IF NOT EXISTS provider_id INTEGER REFERENCES users(id),
        ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS customer_notes TEXT,
        ADD COLUMN IF NOT EXISTS provider_notes TEXT
    `)
    console.log('✓ Added provider fields to bookings table')

    // Add user_id to service_providers table
    await client.query(`
      ALTER TABLE service_providers
        ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id)
    `)
    console.log('✓ Added user_id to service_providers table')

    // Create withdrawals table
    await client.query(`
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
    `)
    console.log('✓ Created withdrawals table')

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id)')
    await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)')
    await client.query('CREATE INDEX IF NOT EXISTS idx_withdrawals_provider_id ON withdrawals(provider_id)')
    console.log('✓ Created indexes')

    console.log('✅ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Error during migration:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

migrateProviderFields().catch(console.error) 