import { Pool } from 'pg'
<<<<<<< HEAD
import * as fs from 'fs'
import * as path from 'path'
import * as bcrypt from 'bcrypt'
=======
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
>>>>>>> provider-dashboard-enhancement

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432,
})

async function setupDatabase() {
  const client = await pool.connect()
<<<<<<< HEAD
  try {
    console.log('🔄 Setting up database...')

    // Drop existing tables
    console.log('🗑️  Dropping existing tables...')
    await client.query(`
      DROP TABLE IF EXISTS invoices CASCADE;
      DROP TABLE IF EXISTS reviews CASCADE;
      DROP TABLE IF EXISTS booking_services CASCADE;
      DROP TABLE IF EXISTS bookings CASCADE;
      DROP TABLE IF EXISTS cart_items CASCADE;
      DROP TABLE IF EXISTS provider_services CASCADE;
      DROP TABLE IF EXISTS service_providers CASCADE;
      DROP TABLE IF EXISTS services CASCADE;
      DROP TABLE IF EXISTS service_categories CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `)

    // Create tables and insert initial data
    console.log('📝 Creating tables and inserting initial data...')
    const schemaPath = path.join(__dirname, '01-create-database.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    await client.query(schema)

    // Insert default categories
    console.log('📑 Inserting default categories...')
    const categoriesPath = path.join(__dirname, '02-insert-categories.sql')
    const categories = fs.readFileSync(categoriesPath, 'utf8')
    await client.query(categories)

    // Insert test services
    console.log('🔧 Inserting test services...')
    const servicesPath = path.join(__dirname, '02-insert-test-data.sql')
    const services = fs.readFileSync(servicesPath, 'utf8')
    await client.query(services)

    // Insert test users
    console.log('👤 Inserting test users...')
    const adminPasswordHash = await bcrypt.hash('12345', 10)
    const userPasswordHash = await bcrypt.hash('12345', 10)

    await client.query(`
      INSERT INTO users (name, email, phone, password_hash, role, address)
      VALUES 
        ('Admin User', 'admin@faster.com', '+255700000000', $1, 'admin', '123 Admin Street, Dar es Salaam'),
        ('Test User', 'user@faster.com', '+255700000001', $2, 'customer', '456 User Avenue, Arusha')
    `, [adminPasswordHash, userPasswordHash])

    console.log('✅ Database setup completed successfully!')
  } catch (error) {
    console.error('❌ Error setting up database:', error)
    throw error
  } finally {
    client.release()
=======
  
  try {
    console.log('Setting up database...')
    
    // Read and execute the main schema
    const schemaPath = path.join(__dirname, '01-create-database.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    await client.query(schema)
    console.log('✓ Database schema created')

    // Read and execute categories
    const categoriesPath = path.join(__dirname, '02-insert-categories.sql')
    const categories = fs.readFileSync(categoriesPath, 'utf8')
    await client.query(categories)
    console.log('✓ Categories inserted')

    // Read and execute services
    const servicesPath = path.join(__dirname, '02-insert-test-data.sql')
    const services = fs.readFileSync(servicesPath, 'utf8')
    await client.query(services)
    console.log('✓ Services inserted')
    
    // Create test users with hashed passwords
    const password = '12345' // Simple password for testing
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const testUsers = [
      {
        name: 'Admin User',
        email: 'admin@test.com',
        phone: '+255 555 123 456',
        password_hash: hashedPassword,
        role: 'admin',
        address: '789 Admin St, Dar es Salaam'
      },
      {
        name: 'Test User',
        email: 'user@test.com',
        phone: '+255 987 654 321',
        password_hash: hashedPassword,
        role: 'user',
        address: '456 User St, Dar es Salaam'
      },
      {
        name: 'Test Provider',
        email: 'provider@test.com',
        phone: '+255 123 456 789',
        password_hash: hashedPassword,
        role: 'provider',
        address: '123 Provider St, Dar es Salaam'
      }
    ]
    
    for (const user of testUsers) {
      await client.query(
        `INSERT INTO users (name, email, phone, password_hash, role, address, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW())
         ON CONFLICT (email) DO NOTHING`,
        [user.name, user.email, user.phone, user.password_hash, user.role, user.address]
      )
    }
    console.log('✓ Test users created')
    
    // Create some test bookings
    const testBookings = [
      {
        service_id: 1,
        customer_id: 2, // user@test.com
        customer_name: 'Test User',
        customer_email: 'user@test.com',
        customer_phone: '+255 987 654 321',
        address: '456 User St, Dar es Salaam',
        booking_date: '2024-01-20',
        booking_time: '10:00',
        total_amount: 50000,
        status: 'pending'
      },
      {
        service_id: 2,
        customer_id: 2,
        customer_name: 'Test User',
        customer_email: 'user@test.com',
        customer_phone: '+255 987 654 321',
        address: '456 User St, Dar es Salaam',
        booking_date: '2024-01-22',
        booking_time: '14:00',
        total_amount: 80000,
        status: 'completed'
      }
    ]
    
    for (const booking of testBookings) {
      await client.query(
        `INSERT INTO bookings (service_id, customer_id, customer_name, customer_email, customer_phone, address, booking_date, booking_time, total_amount, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
        [booking.service_id, booking.customer_id, booking.customer_name, booking.customer_email, booking.customer_phone, booking.address, booking.booking_date, booking.booking_time, booking.total_amount, booking.status]
      )
    }
    console.log('✓ Test bookings created')
    
    console.log('\n🎉 Database setup completed successfully!')
    console.log('\nTest credentials:')
    console.log('Admin: admin@test.com / 12345')
    console.log('User: user@test.com / 12345')
    console.log('Provider: provider@test.com / 12345')
    
  } catch (error) {
    console.error('Error setting up database:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
>>>>>>> provider-dashboard-enhancement
  }
}

setupDatabase().catch(console.error) 