const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'huduma_db',
  user: 'postgres',
  password: '54642323',
};

async function runMigration() {
  const client = new Client(dbConfig);
  
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');

    // Define migration statements individually
    const migrations = [
      // Add columns to bookings table
      "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS provider_id INTEGER",
      "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS admin_id INTEGER",
      "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP",
      "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS urgency_level VARCHAR(10) DEFAULT 'medium'",
      
      // Create providers table
      `CREATE TABLE IF NOT EXISTS providers (
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
      )`,
      
      // Create assignment_history table
      `CREATE TABLE IF NOT EXISTS assignment_history (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER NOT NULL,
        provider_id INTEGER NOT NULL,
        admin_id INTEGER NOT NULL,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) DEFAULT 'assigned',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Create admin_actions table
      `CREATE TABLE IF NOT EXISTS admin_actions (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        target_type VARCHAR(50) NOT NULL,
        target_id INTEGER NOT NULL,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Create admin_notifications table
      `CREATE TABLE IF NOT EXISTS admin_notifications (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER NOT NULL,
        title VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Add indexes
      "CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id)",
      "CREATE INDEX IF NOT EXISTS idx_bookings_admin_id ON bookings(admin_id)",
      "CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)",
      "CREATE INDEX IF NOT EXISTS idx_assignment_history_booking_id ON assignment_history(booking_id)",
      "CREATE INDEX IF NOT EXISTS idx_assignment_history_provider_id ON assignment_history(provider_id)",
      "CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id)",
      "CREATE INDEX IF NOT EXISTS idx_admin_notifications_admin_id ON admin_notifications(admin_id)",
      
      // Update existing data
      "UPDATE bookings SET urgency_level = 'medium' WHERE urgency_level IS NULL"
    ];

    console.log('Running admin migration...');
    
    for (let i = 0; i < migrations.length; i++) {
      const statement = migrations[i];
      try {
        await client.query(statement);
        console.log(`✓ [${i + 1}/${migrations.length}] Executed successfully`);
      } catch (error) {
        if (error.code === '42710' || error.code === '42P07') { // Already exists
          console.log(`⚠ [${i + 1}/${migrations.length}] Skipped (already exists)`);
        } else {
          console.error(`✗ [${i + 1}/${migrations.length}] Error:`, error.message);
        }
      }
    }

    console.log('✅ Admin migration completed!');
    
    // Verify the changes
    console.log('\nVerifying changes...');
    
    // Check if new columns exist
    const columnsResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      AND column_name IN ('provider_id', 'admin_id', 'assigned_at', 'urgency_level')
      ORDER BY column_name;
    `);
    
    console.log('New columns in bookings table:');
    columnsResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    // Check if new tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('providers', 'assignment_history', 'admin_actions', 'admin_notifications')
      ORDER BY table_name;
    `);
    
    console.log('\nNew tables created:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration(); 