const { Pool } = require('pg');

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "huduma_db",
  password: "54642323",
  port: 5432,
});

async function createPendingBookings() {
  try {
    console.log('📝 Creating pending bookings that need manual assignment...');
    
    // Get users and services for sample data
    const users = await pool.query('SELECT id, name FROM users WHERE role = \'customer\' OR role = \'user\' LIMIT 3');
    const services = await pool.query('SELECT id, name FROM services WHERE is_active = true LIMIT 5');
    
    if (users.rows.length === 0 || services.rows.length === 0) {
      console.log('⚠️ Need users and services to create sample bookings');
      return;
    }
    
    // Create pending bookings without provider assignment
    const pendingBookings = [
      {
        customer_id: users.rows[0].id,
        service_id: services.rows[0].id,
        service_name: services.rows[0].name,
        booking_date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        booking_time: '09:00',
        address: '123 Main Street, Dar es Salaam',
        total_amount: 50000,
        status: 'pending',
        provider_id: null // No provider assigned - needs manual assignment
      },
      {
        customer_id: users.rows[1]?.id || users.rows[0].id,
        service_id: services.rows[1]?.id || services.rows[0].id,
        service_name: services.rows[1]?.name || services.rows[0].name,
        booking_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        booking_time: '14:00',
        address: '456 Oak Avenue, Arusha',
        total_amount: 75000,
        status: 'pending',
        provider_id: null
      },
      {
        customer_id: users.rows[2]?.id || users.rows[0].id,
        service_id: services.rows[2]?.id || services.rows[0].id,
        service_name: services.rows[2]?.name || services.rows[0].name,
        booking_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        booking_time: '10:30',
        address: '789 Pine Road, Mwanza',
        total_amount: 120000,
        status: 'pending',
        provider_id: null
      }
    ];
    
    console.log('📝 Adding pending bookings...');
    
    for (const booking of pendingBookings) {
      await pool.query(`
        INSERT INTO bookings (customer_id, service_id, service_name, booking_date, booking_time, address, total_amount, status, provider_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        booking.customer_id,
        booking.service_id,
        booking.service_name,
        booking.booking_date,
        booking.booking_time,
        booking.address,
        booking.total_amount,
        booking.status,
        booking.provider_id
      ]);
    }
    
    console.log('✅ Pending bookings created!');
    
    // Show current pending bookings
    const pending = await pool.query(`
      SELECT b.*, u.name as customer_name
      FROM bookings b
      LEFT JOIN users u ON b.customer_id = u.id
      WHERE b.status = 'pending' AND b.provider_id IS NULL
      ORDER BY b.booking_date ASC
    `);
    
    console.log('\n📋 Current pending bookings that need manual assignment:');
    pending.rows.forEach((booking, index) => {
      console.log(`${index + 1}. ${booking.customer_name} - ${booking.service_name} - ${new Date(booking.booking_date).toLocaleDateString()} at ${booking.booking_time}`);
    });
    
    console.log('\n🎉 Task Assignment feature is now ready for testing!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createPendingBookings(); 