const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "huduma_db",
  password: "54642323",
  port: 5432,
});

async function fixAdminIssues() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Fixing admin dashboard issues...');
    
    // 1. Fix reports table
    console.log('\n1. Creating reports table...');
    await client.query(`
      DROP TABLE IF EXISTS reports CASCADE;
      CREATE TABLE reports (
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
    
    // 2. Add missing columns to services table
    console.log('\n2. Adding missing columns to services table...');
    await client.query(`
      ALTER TABLE services ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
      ALTER TABLE services ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);
    `);
    
    // 3. Add missing columns to providers table
    console.log('\n3. Adding missing columns to providers table...');
    await client.query(`
      ALTER TABLE providers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
      ALTER TABLE providers ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
    `);
    
    // 4. Add missing columns to categories table
    console.log('\n4. Adding missing columns to categories table...');
    await client.query(`
      ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
    `);
    
    // 5. Add missing columns to users table
    console.log('\n5. Adding missing columns to users table...');
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer';
    `);
    
    // 6. Create performance indexes
    console.log('\n6. Creating performance indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
      CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
      CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
      CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
      CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);
      CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_providers_is_active ON providers(is_active);
      CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
      CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
      CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
    `);
    
    // 7. Insert sample data for testing
    console.log('\n7. Inserting sample data...');
    
    // Sample reports
    await client.query(`
      INSERT INTO reports (reporter_id, report_type, description, status) VALUES
      (1, 'service_issue', 'Service provider arrived late', 'pending'),
      (1, 'provider_issue', 'Provider was unprofessional', 'investigating'),
      (2, 'booking_issue', 'Booking was cancelled without notice', 'resolved')
      ON CONFLICT DO NOTHING;
    `);
    
    // Update some services to have is_active
    await client.query(`
      UPDATE services SET is_active = true WHERE is_active IS NULL;
    `);
    
    // Update some providers to have is_active
    await client.query(`
      UPDATE providers SET is_active = true WHERE is_active IS NULL;
    `);
    
    // Update some categories to have is_active
    await client.query(`
      UPDATE categories SET is_active = true WHERE is_active IS NULL;
    `);
    
    // Update some users to have role
    await client.query(`
      UPDATE users SET role = 'customer' WHERE role IS NULL;
    `);
    
    // 8. Analyze tables for better performance
    console.log('\n8. Analyzing tables...');
    await client.query(`
      ANALYZE bookings;
      ANALYZE services;
      ANALYZE users;
      ANALYZE providers;
      ANALYZE categories;
      ANALYZE reports;
    `);
    
    console.log('\n✅ All admin dashboard issues fixed!');
    console.log('\n📊 Summary of fixes:');
    console.log('  - Reports table created with proper structure');
    console.log('  - Missing columns added to all tables');
    console.log('  - Performance indexes created');
    console.log('  - Sample data inserted for testing');
    console.log('  - Tables analyzed for optimal performance');
    
  } catch (error) {
    console.error('❌ Error fixing admin issues:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

fixAdminIssues(); 