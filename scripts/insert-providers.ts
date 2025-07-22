import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432,
});

const providerPassword = 'provider123';
const providerSpecializations = [
  'Home Cleaning',
  'Gardening',
  'Plumbing',
  'Electrical',
  'Painting',
];

const locations = [
  'Dar es Salaam',
  'Arusha',
  'Mwanza',
  'Dodoma',
  'Mbeya',
  'Moshi',
  'Tanga',
  'Zanzibar',
];

const testImage = 'https://randomuser.me/api/portraits/men/1.jpg';

async function insertProviders() {
  const password_hash = await bcrypt.hash(providerPassword, 10);
  const client = await pool.connect();
  try {
    const servicesRes = await client.query('SELECT id, name_en FROM services');
    let count = 1;
    for (const service of servicesRes.rows) {
      for (let i = 1; i <= 5; i++) {
        const name = `Provider ${service.name_en} ${i}`;
        const email = `provider_${service.id}_${i}@example.com`;
        const phone = `+25570000${service.id}${i}`;
        const specialization = service.name_en;
        const location = locations[(count + i) % locations.length];
        const rating = 4.0 + (i % 5) * 0.2;
        const totalJobs = 10 * i;
        const verified = i % 2 === 0;
        await client.query(
          `INSERT INTO users (name, email, phone, password_hash, role, is_active, image, specialization, location, rating, totalJobs, verified) VALUES ($1, $2, $3, $4, 'provider', true, $5, $6, $7, $8, $9, $10) ON CONFLICT (email) DO NOTHING`,
          [name, email, phone, password_hash, testImage, specialization, location, rating, totalJobs, verified]
        );
      }
      count++;
    }
    console.log('Inserted 5 providers for each service with all fields.');
  } finally {
    client.release();
    await pool.end();
  }
}

insertProviders().catch(console.error); 