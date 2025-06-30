import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432,
});

async function viewUnassignedBookings() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM bookings WHERE provider_id IS NULL');
    if (res.rows.length === 0) {
      console.log('No unassigned bookings found.');
    } else {
      console.log('Unassigned bookings:');
      res.rows.forEach(row => console.log(row));
    }
  } finally {
    client.release();
    await pool.end();
  }
}

viewUnassignedBookings().catch(console.error); 