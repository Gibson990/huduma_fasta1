const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432,
})

async function verifyDatabase() {
  const client = await pool.connect()
  try {
    console.log('🔍 Verifying database setup...')

    // Check categories
    const categoriesResult = await client.query('SELECT COUNT(*) as count FROM service_categories')
    console.log(`📑 Categories: ${categoriesResult.rows[0].count}`)

    // Check services
    const servicesResult = await client.query('SELECT COUNT(*) as count FROM services')
    console.log(`🔧 Services: ${servicesResult.rows[0].count}`)

    // Check providers
    const providersResult = await client.query('SELECT COUNT(*) as count FROM service_providers')
    console.log(`👷 Service Providers: ${providersResult.rows[0].count}`)

    // Check provider users
    const providerUsersResult = await client.query("SELECT COUNT(*) as count FROM users WHERE role = 'provider'")
    console.log(`👤 Provider Users: ${providerUsersResult.rows[0].count}`)

    // Check customer users
    const customerUsersResult = await client.query("SELECT COUNT(*) as count FROM users WHERE role = 'customer'")
    console.log(`👤 Customer Users: ${customerUsersResult.rows[0].count}`)

    // Check provider services
    const providerServicesResult = await client.query('SELECT COUNT(*) as count FROM provider_services')
    console.log(`🔗 Provider-Service Links: ${providerServicesResult.rows[0].count}`)

    // Check bookings
    const bookingsResult = await client.query('SELECT COUNT(*) as count FROM bookings')
    console.log(`📅 Bookings: ${bookingsResult.rows[0].count}`)

    // Check unassigned bookings
    const unassignedResult = await client.query("SELECT COUNT(*) as count FROM bookings WHERE provider_id IS NULL AND status = 'unassigned'")
    console.log(`⚠️  Unassigned Bookings: ${unassignedResult.rows[0].count}`)

    // Show sample data
    console.log('\n📋 Sample Provider Users:')
    const sampleProviders = await client.query("SELECT name, email, role FROM users WHERE role = 'provider' LIMIT 3")
    sampleProviders.rows.forEach(provider => {
      console.log(`  - ${provider.name} (${provider.email})`)
    })

    console.log('\n📋 Sample Services:')
    const sampleServices = await client.query('SELECT name_en, base_price FROM services LIMIT 3')
    sampleServices.rows.forEach(service => {
      console.log(`  - ${service.name_en} (TZS ${service.base_price})`)
    })

    console.log('\n✅ Database verification completed!')
    console.log('\n🔑 Provider Login Credentials:')
    console.log('testprovider1@fasta.com - 12345')
    console.log('testprovider2@fasta.com - 12345')
    console.log('testprovider3@fasta.com - 12345')
    console.log('testprovider4@fasta.com - 12345')
    console.log('testprovider5@fasta.com - 12345')
    console.log('testprovider6@fasta.com - 12345')
    console.log('testprovider7@fasta.com - 12345')
    console.log('testprovider8@fasta.com - 12345')

  } catch (error) {
    console.error('❌ Error verifying database:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

verifyDatabase().catch(console.error) 