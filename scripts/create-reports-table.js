const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "huduma_db",
  password: "54642323",
  port: 5432,
});

async function createReportsTable() {
  const client = await pool.connect();
  
  try {
    console.log('Creating reports table...');
    
    // Create the reports table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        reporter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reported_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        provider_id INTEGER REFERENCES providers(id) ON DELETE SET NULL,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
        report_type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('Creating indexes...');
    
    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_reports_reported_user_id ON reports(reported_user_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_reports_provider_id ON reports(provider_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_reports_booking_id ON reports(booking_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);');
    
    console.log('Reports table created successfully!');
    
  } catch (error) {
    console.error('Error creating reports table:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

createReportsTable(); 