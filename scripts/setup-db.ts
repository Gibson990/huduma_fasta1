import { Pool } from 'pg'
import * as fs from 'fs'
import * as path from 'path'
import * as bcrypt from 'bcrypt'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432,
})

async function setupDatabase() {
  const client = await pool.connect()
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
  }
}

setupDatabase().catch(console.error) 