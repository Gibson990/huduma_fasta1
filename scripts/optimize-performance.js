const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "huduma_db",
  password: "54642323",
  port: 5432,
});

async function optimizePerformance() {
  const client = await pool.connect();
  
  try {
    console.log('Optimizing database performance...');
    
    // Add indexes for better query performance
    console.log('Adding indexes...');
    
    // Bookings table indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);');
    
    // Services table indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_services_is_active ON services(is_active);');
    
    // Users table indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);');
    
    // Providers table indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_providers_is_active ON providers(is_active);');
    
    // Categories table indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);');
    
    console.log('Performance optimization completed!');
    
    // Analyze tables for better query planning
    console.log('Analyzing tables...');
    await client.query('ANALYZE bookings;');
    await client.query('ANALYZE services;');
    await client.query('ANALYZE users;');
    await client.query('ANALYZE providers;');
    await client.query('ANALYZE categories;');
    await client.query('ANALYZE reports;');
    
    console.log('Table analysis completed!');
    
  } catch (error) {
    console.error('Error optimizing performance:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

optimizePerformance(); 