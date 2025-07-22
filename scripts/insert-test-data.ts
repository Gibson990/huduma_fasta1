import { Pool } from 'pg'
import bcrypt from 'bcrypt'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '12345',
  port: 5432
})

async function insertTestData() {
  const client = await pool.connect()
  try {
    console.log('📝 Inserting test data...')

    // Insert test users with hashed passwords (password: 12345)
    const hashedPassword = await bcrypt.hash('12345', 10)
    await client.query(`
      INSERT INTO users (name, email, phone, password_hash, role) VALUES
      ('Admin User', 'admin@faster.com', '+255700000000', $1, 'admin'),
      ('Test User', 'user@faster.com', '+255700000001', $1, 'customer')
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role,
        name = EXCLUDED.name,
        phone = EXCLUDED.phone
    `, [hashedPassword])
    console.log('✅ Test users inserted')

    // Insert service categories
    await client.query(`
      INSERT INTO service_categories (name_en, name_sw, description_en, description_sw, icon, image_url) VALUES
      ('Electrical Services', 'Huduma za Umeme', 'Professional electrical repairs and installations', 'Ukarabati na usakinishaji wa umeme wa kitaalamu', 'bolt', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'),
      ('Plumbing Services', 'Huduma za Mabomba', 'Expert plumbing solutions for your home', 'Suluhisho za kitaalamu za mabomba kwa nyumba yako', 'droplet', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000'),
      ('Cleaning Services', 'Huduma za Usafi', 'Professional home and office cleaning', 'Usafi wa kitaalamu wa nyumba na ofisi', 'sparkles', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000'),
      ('Carpentry', 'Useremala', 'Custom woodwork and furniture repairs', 'Kazi za mbao na ukarabati wa samani', 'hammer', 'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000'),
      ('Painting', 'Uchoraji', 'Interior and exterior painting services', 'Huduma za uchoraji wa ndani na nje', 'brush', 'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000')
      ON CONFLICT DO NOTHING
    `)
    console.log('✅ Service categories inserted')

    // Insert services
    await client.query(`
      INSERT INTO services (category_id, name_en, name_sw, description_en, description_sw, base_price, duration_minutes, image_url) VALUES
      (1, 'Electrical Wiring', 'Uwiring wa Umeme', 'Complete electrical wiring for homes and offices', 'Uwiring kamili wa umeme kwa nyumba na ofisi', 300000.00, 180, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'),
      (1, 'Light Installation', 'Usakinishaji wa Taa', 'Install ceiling lights, chandeliers, and fixtures', 'Kusakinisha taa za dari, chandeliers na vifaa vingine', 150000.00, 90, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'),
      (2, 'Pipe Repair', 'Ukarabati wa Mabomba', 'Fix leaking and broken pipes', 'Kukarabati mabomba yanayovuja na yaliyovunjika', 200000.00, 120, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000'),
      (3, 'House Cleaning', 'Usafi wa Nyumba', 'Deep cleaning for entire house', 'Usafi wa kina kwa nyumba nzima', 160000.00, 240, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000'),
      (4, 'Furniture Assembly', 'Kuunganisha Samani', 'Assemble and install furniture', 'Kuunganisha na kusakinisha samani', 100000.00, 90, 'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000')
      ON CONFLICT DO NOTHING
    `)
    console.log('✅ Services inserted')

    // Insert service providers
    await client.query(`
      INSERT INTO service_providers (name, email, phone, specialization_en, specialization_sw, experience_years, rating, total_jobs, is_verified, location) VALUES
      ('Juma Mwalimu', 'juma@providers.com', '+255700001001', 'Electrical work, wiring, installations', 'Kazi za umeme, uwiring, usakinishaji', 8, 4.8, 156, true, 'Dar es Salaam'),
      ('Amina Salehe', 'amina@providers.com', '+255700001002', 'Plumbing repairs, installations', 'Ukarabati wa mabomba, usakinishaji', 6, 4.6, 98, true, 'Arusha'),
      ('Hassan Mwangi', 'hassan@providers.com', '+255700001003', 'House cleaning, deep cleaning', 'Usafi wa nyumba, usafi wa kina', 4, 4.9, 203, true, 'Mwanza'),
      ('Grace Kimani', 'grace@providers.com', '+255700001004', 'Carpentry, furniture assembly', 'Useremala, kuunganisha samani', 10, 4.7, 134, true, 'Dodoma')
      ON CONFLICT DO NOTHING
    `)
    console.log('✅ Service providers inserted')

    // Link providers to services
    await client.query(`
      INSERT INTO provider_services (provider_id, service_id, custom_price) VALUES
      (1, 1, 280000.00), (1, 2, 140000.00),
      (2, 3, 190000.00),
      (3, 4, 150000.00),
      (4, 5, 90000.00)
      ON CONFLICT DO NOTHING
    `)
    console.log('✅ Provider services linked')

    // Insert sample bookings
    await client.query(`
      INSERT INTO bookings (user_id, provider_id, booking_date, booking_time, service_address, total_amount, payment_method, payment_status, booking_status, special_instructions) VALUES
      (2, 1, '2024-01-15', '10:00:00', 'Msimbazi Street, Dar es Salaam', 280000.00, 'cash', 'paid', 'completed', 'Please bring extra tools'),
      (3, 3, '2024-01-16', '14:00:00', 'Sokoine Road, Arusha', 150000.00, 'cash', 'pending', 'in_progress', 'Need deep cleaning'),
      (4, 2, '2024-01-17', '09:00:00', 'Uhuru Street, Mwanza', 190000.00, 'cash', 'pending', 'pending', 'Urgent repair needed')
      ON CONFLICT DO NOTHING
    `)
    console.log('✅ Sample bookings inserted')

    // Insert booking services
    await client.query(`
      INSERT INTO booking_services (booking_id, service_id, quantity, price) VALUES
      (1, 1, 1, 280000.00),
      (2, 4, 1, 150000.00),
      (3, 3, 1, 190000.00)
      ON CONFLICT DO NOTHING
    `)
    console.log('✅ Booking services inserted')

    console.log('✅ All test data inserted successfully!')
  } catch (error) {
    console.error('❌ Error inserting test data:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

insertTestData() 