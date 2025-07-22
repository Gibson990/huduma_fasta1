const { Pool } = require('pg')
const bcrypt = require('bcrypt')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432,
})

async function fixDatabase() {
  const client = await pool.connect()
  try {
    console.log('🔧 Fixing database issues...')

    // Clear existing data and reset sequences
    await client.query('DELETE FROM bookings')
    await client.query('DELETE FROM services')
    await client.query('DELETE FROM service_categories')
    await client.query('DELETE FROM service_providers')
    await client.query('DELETE FROM users WHERE role != \'admin\'')
    
    // Reset sequences
    await client.query('ALTER SEQUENCE service_categories_id_seq RESTART WITH 1')
    await client.query('ALTER SEQUENCE services_id_seq RESTART WITH 1')
    await client.query('ALTER SEQUENCE service_providers_id_seq RESTART WITH 1')
    await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 2') // Keep admin as ID 1

    // Insert categories
    console.log('📑 Inserting categories...')
    await client.query(`
      INSERT INTO service_categories (name_en, name_sw, description_en, description_sw, image_url) VALUES
      ('Home Cleaning', 'Usafi wa Nyumbani', 'Cleaning services for homes', 'Huduma za usafi wa nyumba', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000'),
      ('Gardening', 'Bustani', 'Gardening and landscaping services', 'Huduma za bustani na mandhari', 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000'),
      ('Plumbing', 'Mifereji', 'Plumbing installation and repair', 'Huduma za ufungaji na matengenezo ya mifereji', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000'),
      ('Electrical', 'Umeme', 'Electrical installation and repair', 'Huduma za ufungaji na matengenezo ya umeme', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'),
      ('Painting', 'Kupaka', 'Interior and exterior painting services', 'Huduma za kupaka ndani na nje', 'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000'),
      ('Carpentry', 'Useremala', 'Custom woodwork and furniture repairs', 'Kazi za mbao na ukarabati wa samani', 'https://images.unsplash.com/photo-1497219055242-93359eeed651?q=80&w=1449&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%3D%3D')
    `)

    // Insert services (6 per category = 36 total services)
    console.log('🔧 Inserting services...')
    await client.query(`
      INSERT INTO services (category_id, name_en, name_sw, description_en, description_sw, base_price, duration_minutes, rating, image_url) VALUES
      -- Home Cleaning Services (6)
      (1, 'Basic Home Cleaning', 'Usafi wa Nyumbani wa Kawaida', 'Complete home cleaning service including dusting, vacuuming, and bathroom cleaning', 'Huduma kamili ya usafi wa nyumbani ikijumuisha kufuta vumbi, kufagia, na kusafisha bafu', 50000, 120, 4.5, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000'),
      (1, 'Deep Cleaning', 'Usafi wa Kina', 'Thorough deep cleaning service including hard-to-reach areas and detailed attention', 'Huduma ya usafi wa kina ikijumuisha maeneo magumu kufikia na umakini wa kina', 80000, 240, 4.8, 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=1000'),
      (1, 'Window Cleaning', 'Usafi wa Madirisha', 'Professional window cleaning service for crystal clear views', 'Huduma ya usafi wa madirisha kwa ajili ya maonyesho ya wazi', 30000, 60, 4.2, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000'),
      (1, 'Carpet Cleaning', 'Usafi wa Zulia', 'Professional carpet and upholstery cleaning service', 'Huduma ya usafi wa zulia na samani za kiti', 45000, 90, 4.6, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000'),
      (1, 'Kitchen Deep Clean', 'Usafi wa Kina wa Jikoni', 'Specialized kitchen cleaning including appliances and cabinets', 'Usafi maalum wa jikoni ikijumuisha vifaa na kabati', 60000, 150, 4.7, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000'),
      (1, 'Move-in/Move-out Cleaning', 'Usafi wa Kuhamia', 'Comprehensive cleaning for moving in or out of a property', 'Usafi kamili wa kuhamia ndani au nje ya mali', 100000, 300, 4.9, 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000'),

      -- Gardening Services (6)
      (2, 'Lawn Mowing', 'Kukata Nyasi', 'Professional lawn mowing and maintenance service', 'Huduma ya kukata na kudumisha nyasi', 40000, 90, 4.6, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000'),
      (2, 'Garden Design', 'Kubuni Bustani', 'Custom garden design and landscaping service', 'Huduma ya kubuni na kuboresha bustani', 150000, 360, 4.9, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000'),
      (2, 'Plant Care', 'Utunzaji wa Mimea', 'Professional plant care and maintenance service', 'Huduma ya utunzaji na kudumisha mimea', 35000, 60, 4.4, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000'),
      (2, 'Tree Trimming', 'Kupogoa Miti', 'Professional tree trimming and pruning service', 'Huduma ya kupogoa na kukata matawi ya miti', 55000, 120, 4.5, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000'),
      (2, 'Irrigation System', 'Mfumo wa Umwagiliaji', 'Installation and maintenance of irrigation systems', 'Ufungaji na udumishaji wa mifumo ya umwagiliaji', 120000, 180, 4.8, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000'),
      (2, 'Seasonal Cleanup', 'Usafi wa Msimu', 'Seasonal garden cleanup and preparation service', 'Huduma ya usafi wa bustani na kujiandaa kwa msimu', 45000, 90, 4.3, 'https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=1000'),

      -- Plumbing Services (6)
      (3, 'Leak Repair', 'Kurekebisha Mvuja', 'Professional leak detection and repair service', 'Huduma ya kugundua na kurekebisha mvuja', 45000, 90, 4.7, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000'),
      (3, 'Pipe Installation', 'Ufungaji wa Bomba', 'New pipe installation and replacement service', 'Huduma ya kufunga na kubadilisha bomba mpya', 120000, 180, 4.8, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000'),
      (3, 'Drain Cleaning', 'Kusafisha Mfereji', 'Professional drain cleaning and unclogging service', 'Huduma ya kusafisha na kufungua mifereji', 35000, 60, 4.5, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000'),
      (3, 'Water Heater Repair', 'Kurekebisha Jiko la Maji', 'Water heater installation and repair service', 'Huduma ya kufunga na kurekebisha jiko la maji', 80000, 120, 4.6, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000'),
      (3, 'Bathroom Remodeling', 'Kubadilisha Muonekano wa Bafu', 'Complete bathroom remodeling and renovation service', 'Huduma kamili ya kubadilisha muonekano wa bafu', 200000, 480, 4.9, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000'),
      (3, 'Sump Pump Installation', 'Ufungaji wa Pampu ya Maji', 'Sump pump installation and maintenance service', 'Huduma ya kufunga na kudumisha pampu ya maji', 90000, 150, 4.7, 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=1000'),

      -- Electrical Services (6)
      (4, 'Electrical Repair', 'Kurekebisha Umeme', 'Professional electrical repair and maintenance service', 'Huduma ya kurekebisha na kudumisha umeme', 55000, 120, 4.6, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'),
      (4, 'Light Installation', 'Ufungaji wa Taa', 'New light fixture installation service', 'Huduma ya kufunga vifaa vipya vya taa', 40000, 90, 4.7, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'),
      (4, 'Electrical Inspection', 'Ukaguzi wa Umeme', 'Comprehensive electrical system inspection service', 'Huduma ya ukaguzi wa kina wa mfumo wa umeme', 30000, 60, 4.8, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'),
      (4, 'Circuit Breaker Installation', 'Ufungaji wa Kizima Umeme', 'Circuit breaker and electrical panel installation', 'Ufungaji wa kizima umeme na paneli ya umeme', 75000, 120, 4.7, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'),
      (4, 'Generator Installation', 'Ufungaji wa Jenereta', 'Backup generator installation and maintenance', 'Ufungaji na udumishaji wa jenereta ya dharura', 150000, 240, 4.9, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'),
      (4, 'Smart Home Wiring', 'Uwiring wa Nyumba ya Kisasa', 'Smart home automation wiring and installation', 'Uwiring na ufungaji wa otomatiki ya nyumba ya kisasa', 100000, 180, 4.8, 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000'),

      -- Painting Services (6)
      (5, 'Interior Painting', 'Kupaka Ndani', 'Professional interior painting service', 'Huduma ya kupaka ndani ya nyumba', 60000, 120, 4.6, 'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000'),
      (5, 'Exterior Painting', 'Kupaka Nje', 'Professional exterior house painting service', 'Huduma ya kupaka nje ya nyumba', 80000, 180, 4.7, 'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000'),
      (5, 'Cabinet Painting', 'Kupaka Kabati', 'Kitchen and bathroom cabinet painting service', 'Huduma ya kupaka kabati za jikoni na bafu', 45000, 90, 4.5, 'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000'),
      (5, 'Wall Texture', 'Muundo wa Ukuta', 'Wall texturing and decorative painting service', 'Huduma ya kuunda muundo wa ukuta na kupaka kwa mapambo', 35000, 60, 4.4, 'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000'),
      (5, 'Commercial Painting', 'Kupaka Biashara', 'Commercial building painting service', 'Huduma ya kupaka majengo ya biashara', 120000, 240, 4.8, 'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000'),
      (5, 'Color Consultation', 'Ushauri wa Rangi', 'Professional color consultation and selection service', 'Huduma ya ushauri na uchaguzi wa rangi', 25000, 45, 4.6, 'https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1000'),

      -- Carpentry Services (6)
      (6, 'Custom Furniture', 'Samani Maalum', 'Custom furniture design and construction service', 'Huduma ya kubuni na kutengeneza samani maalum', 150000, 360, 4.9, 'https://images.unsplash.com/photo-1497219055242-93359eeed651?q=80&w=1449&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%3D%3D'),
      (6, 'Cabinet Installation', 'Ufungaji wa Kabati', 'Kitchen and bathroom cabinet installation service', 'Huduma ya kufunga kabati za jikoni na bafu', 80000, 150, 4.7, 'https://images.unsplash.com/photo-1497219055242-93359eeed651?q=80&w=1449&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%3D%3D'),
      (6, 'Door Installation', 'Ufungaji wa Milango', 'Interior and exterior door installation service', 'Huduma ya kufunga milango ya ndani na nje', 60000, 120, 4.6, 'https://images.unsplash.com/photo-1497219055242-93359eeed651?q=80&w=1449&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%3D%3D'),
      (6, 'Window Installation', 'Ufungaji wa Madirisha', 'Window replacement and installation service', 'Huduma ya kubadilisha na kufunga madirisha', 70000, 120, 4.5, 'https://images.unsplash.com/photo-1497219055242-93359eeed651?q=80&w=1449&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%3D%3D'),
      (6, 'Deck Building', 'Kujenga Ukumbi', 'Custom deck and outdoor structure building service', 'Huduma ya kujenga ukumbi na miundo ya nje', 120000, 240, 4.8, 'https://images.unsplash.com/photo-1497219055242-93359eeed651?q=80&w=1449&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%3D%3D'),
      (6, 'Furniture Repair', 'Ukarabati wa Samani', 'Professional furniture repair and restoration service', 'Huduma ya kurekebisha na kurejesha samani', 40000, 90, 4.4, 'https://images.unsplash.com/photo-1497219055242-93359eeed651?q=80&w=1449&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%3D%3D')
    `)

    // Insert provider users with login credentials
    console.log('👷 Inserting provider users...')
    const providerPasswordHash = await bcrypt.hash('12345', 10)
    await client.query(`
      INSERT INTO users (name, email, phone, password_hash, role, address, specialization, location, rating, totalJobs, verified) VALUES
      ('Juma Mwalimu', 'testprovider1@fasta.com', '+255700001001', $1, 'provider', 'Mikocheni, Dar es Salaam', 'Electrical work, wiring, installations', 'Dar es Salaam', 4.8, 156, true),
      ('Amina Salehe', 'testprovider2@fasta.com', '+255700001002', $1, 'provider', 'Soweto, Arusha', 'Plumbing repairs, installations', 'Arusha', 4.6, 98, true),
      ('Hassan Mwangi', 'testprovider3@fasta.com', '+255700001003', $1, 'provider', 'Mwanza City Center', 'House cleaning, deep cleaning', 'Mwanza', 4.9, 203, true),
      ('Grace Kimani', 'testprovider4@fasta.com', '+255700001004', $1, 'provider', 'Dodoma Makulu', 'Carpentry, furniture assembly', 'Dodoma', 4.7, 134, true),
      ('Mohamed Ali', 'testprovider5@fasta.com', '+255700001005', $1, 'provider', 'Mbeya City', 'Painting, interior design', 'Mbeya', 4.5, 87, true),
      ('Sarah Johnson', 'testprovider6@fasta.com', '+255700001006', $1, 'provider', 'Kijitonyama, Dar es Salaam', 'Gardening, landscaping', 'Dar es Salaam', 4.7, 112, true),
      ('Peter Mwangi', 'testprovider7@fasta.com', '+255700001007', $1, 'provider', 'Njiro, Arusha', 'Electrical repairs, maintenance', 'Arusha', 4.6, 89, true),
      ('Fatma Hassan', 'testprovider8@fasta.com', '+255700001008', $1, 'provider', 'Ilemela, Mwanza', 'Plumbing, water systems', 'Mwanza', 4.8, 145, true)
    `, [providerPasswordHash])

    // Insert service providers (linked to users)
    console.log('👷 Inserting service providers...')
    await client.query(`
      INSERT INTO service_providers (user_id, name, email, phone, specialization_en, specialization_sw, experience_years, rating, total_jobs, is_verified, location) VALUES
      (2, 'Juma Mwalimu', 'testprovider1@fasta.com', '+255700001001', 'Electrical work, wiring, installations', 'Kazi za umeme, uwiring, usakinishaji', 8, 4.8, 156, true, 'Dar es Salaam'),
      (3, 'Amina Salehe', 'testprovider2@fasta.com', '+255700001002', 'Plumbing repairs, installations', 'Ukarabati wa mabomba, usakinishaji', 6, 4.6, 98, true, 'Arusha'),
      (4, 'Hassan Mwangi', 'testprovider3@fasta.com', '+255700001003', 'House cleaning, deep cleaning', 'Usafi wa nyumba, usafi wa kina', 4, 4.9, 203, true, 'Mwanza'),
      (5, 'Grace Kimani', 'testprovider4@fasta.com', '+255700001004', 'Carpentry, furniture assembly', 'Useremala, kuunganisha samani', 10, 4.7, 134, true, 'Dodoma'),
      (6, 'Mohamed Ali', 'testprovider5@fasta.com', '+255700001005', 'Painting, interior design', 'Uchoraji, muundo wa ndani', 7, 4.5, 87, true, 'Mbeya'),
      (7, 'Sarah Johnson', 'testprovider6@fasta.com', '+255700001006', 'Gardening, landscaping', 'Bustani, kuboresha mandhari', 5, 4.7, 112, true, 'Dar es Salaam'),
      (8, 'Peter Mwangi', 'testprovider7@fasta.com', '+255700001007', 'Electrical repairs, maintenance', 'Ukarabati wa umeme, udumishaji', 9, 4.6, 89, true, 'Arusha'),
      (9, 'Fatma Hassan', 'testprovider8@fasta.com', '+255700001008', 'Plumbing, water systems', 'Mabomba, mifumo ya maji', 6, 4.8, 145, true, 'Mwanza')
    `)

    // Insert test users
    console.log('👤 Inserting test users...')
    const userPasswordHash = await bcrypt.hash('12345', 10)
    await client.query(`
      INSERT INTO users (name, email, phone, password_hash, role, address)
      VALUES 
        ('Test User', 'user@faster.com', '+255700000001', $1, 'customer', '456 User Avenue, Arusha'),
        ('John Mwangi', 'john@example.com', '+255700000002', $1, 'customer', '789 Main Street, Dar es Salaam'),
        ('Neema Mushi', 'neema@example.com', '+255700000003', $1, 'customer', '321 Oak Road, Mwanza'),
        ('David Kimani', 'david@example.com', '+255700000004', $1, 'customer', '654 Pine Street, Dodoma'),
        ('Mary Wanjiku', 'mary@example.com', '+255700000005', $1, 'customer', '987 Elm Avenue, Mbeya')
    `, [userPasswordHash])

    // Insert test bookings
    console.log('📅 Inserting test bookings...')
    await client.query(`
      INSERT INTO bookings (service_id, customer_id, provider_id, customer_name, customer_email, customer_phone, address, booking_date, booking_time, total_amount, status) VALUES
      (1, 10, 2, 'Test User', 'user@faster.com', '+255700000001', '456 User Avenue, Arusha', '2024-01-15', '10:00:00', 50000, 'completed'),
      (3, 10, 4, 'Test User', 'user@faster.com', '+255700000001', '456 User Avenue, Arusha', '2024-01-20', '14:00:00', 30000, 'pending'),
      (5, 11, 6, 'John Mwangi', 'john@example.com', '+255700000002', '789 Main Street, Dar es Salaam', '2024-01-18', '09:00:00', 40000, 'in_progress'),
      (7, 12, 8, 'Neema Mushi', 'neema@example.com', '+255700000003', '321 Oak Road, Mwanza', '2024-01-22', '16:00:00', 45000, 'pending'),
      (9, 13, 3, 'David Kimani', 'david@example.com', '+255700000004', '654 Pine Street, Dodoma', '2024-01-25', '11:00:00', 35000, 'assigned'),
      (11, 14, 5, 'Mary Wanjiku', 'mary@example.com', '+255700000005', '987 Elm Avenue, Mbeya', '2024-01-28', '13:00:00', 55000, 'completed')
    `)

    console.log('✅ Database fixed successfully!')
    console.log('📋 Provider Login Credentials:')
    console.log('testprovider1@fasta.com - 12345')
    console.log('testprovider2@fasta.com - 12345')
    console.log('testprovider3@fasta.com - 12345')
    console.log('testprovider4@fasta.com - 12345')
    console.log('testprovider5@fasta.com - 12345')
    console.log('testprovider6@fasta.com - 12345')
    console.log('testprovider7@fasta.com - 12345')
    console.log('testprovider8@fasta.com - 12345')
  } catch (error) {
    console.error('❌ Error fixing database:', error)
    throw error
  } finally {
    client.release()
  }
}

fixDatabase().catch(console.error) 