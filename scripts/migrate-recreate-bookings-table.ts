import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432,
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Dropping bookings table if exists...');
    await client.query('DROP TABLE IF EXISTS bookings CASCADE;');

    console.log('Creating bookings table...');
    await client.query(`
      CREATE TABLE bookings (
        id SERIAL PRIMARY KEY,
        service_id INTEGER REFERENCES services(id),
        customer_id INTEGER REFERENCES users(id),
        provider_id INTEGER REFERENCES users(id),
        customer_name VARCHAR(100),
        customer_email VARCHAR(100),
        customer_phone VARCHAR(20),
        address TEXT,
        booking_date DATE,
        booking_time VARCHAR(20),
        total_amount DECIMAL(10,2),
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Inserting Tanzanian dummy bookings data...');
    await client.query(`
      INSERT INTO bookings (service_id, customer_id, provider_id, customer_name, customer_email, customer_phone, address, booking_date, booking_time, total_amount, status, notes)
      VALUES
        (1, 2, 3, 'Neema Mushi', 'neema.mushi@example.com', '+255712345678', 'Mikocheni, Dar es Salaam', '2024-06-12', '09:00', 50000, 'pending', 'Needs early morning service'),
        (2, 3, NULL, 'Juma Mwalimu', 'juma.mwalimu@example.com', '+255713456789', 'Kijitonyama, Dar es Salaam', '2024-06-13', '11:00', 75000, 'pending', 'Bring your own cleaning supplies'),
        (3, 4, 5, 'Amina Salehe', 'amina.salehe@example.com', '+255714567890', 'Soweto, Arusha', '2024-06-14', '14:00', 45000, 'assigned', 'Garden needs extra attention'),
        (4, 2, NULL, 'Hassan Mwangi', 'hassan.mwangi@example.com', '+255715678901', 'Mwanza City Center', '2024-06-15', '10:30', 35000, 'pending', 'Install new plants'),
        (5, 3, 4, 'Fatma Hassan', 'fatma.hassan@example.com', '+255716789012', 'Dodoma Makulu', '2024-06-16', '13:00', 25000, 'completed', 'Quick pipe repair needed');
    `);

    console.log('✅ Bookings table recreated and dummy data inserted!');
  } catch (error) {
    console.error('❌ Error during migration:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate(); 