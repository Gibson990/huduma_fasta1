const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "huduma_db",
  password: "54642323",
  port: 5432,
});

async function checkSchema() {
  const client = await pool.connect();
  
  try {
    console.log('Checking database schema...');
    
    // Check bookings table
    const bookingsResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      ORDER BY ordinal_position;
    `);
    console.log('\nBookings table columns:');
    bookingsResult.rows.forEach(row => console.log(`  ${row.column_name}: ${row.data_type}`));
    
    // Check services table
    const servicesResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'services' 
      ORDER BY ordinal_position;
    `);
    console.log('\nServices table columns:');
    servicesResult.rows.forEach(row => console.log(`  ${row.column_name}: ${row.data_type}`));
    
    // Check providers table
    const providersResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'providers' 
      ORDER BY ordinal_position;
    `);
    console.log('\nProviders table columns:');
    providersResult.rows.forEach(row => console.log(`  ${row.column_name}: ${row.data_type}`));
    
    // Check categories table
    const categoriesResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'categories' 
      ORDER BY ordinal_position;
    `);
    console.log('\nCategories table columns:');
    categoriesResult.rows.forEach(row => console.log(`  ${row.column_name}: ${row.data_type}`));
    
    // Check users table
    const usersResult = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    console.log('\nUsers table columns:');
    usersResult.rows.forEach(row => console.log(`  ${row.column_name}: ${row.data_type}`));
    
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkSchema(); 