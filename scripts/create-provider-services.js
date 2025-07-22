const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432,
})

async function createProviderServices() {
  const client = await pool.connect()
  try {
    console.log('🔗 Creating provider-service links...')

    // Clear existing provider_services
    await client.query('DELETE FROM provider_services')

    // Define which providers offer which services
    // Provider 1 (Juma Mwalimu - Electrical) - Services 13-18 (Electrical services)
    for (let serviceId = 13; serviceId <= 18; serviceId++) {
      await client.query(
        'INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)',
        [1, serviceId]
      )
    }

    // Provider 2 (Amina Salehe - Plumbing) - Services 19-24 (Plumbing services)
    for (let serviceId = 19; serviceId <= 24; serviceId++) {
      await client.query(
        'INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)',
        [2, serviceId]
      )
    }

    // Provider 3 (Hassan Mwangi - Cleaning) - Services 1-6 (Cleaning services)
    for (let serviceId = 1; serviceId <= 6; serviceId++) {
      await client.query(
        'INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)',
        [3, serviceId]
      )
    }

    // Provider 4 (Grace Kimani - Carpentry) - Services 31-36 (Carpentry services)
    for (let serviceId = 31; serviceId <= 36; serviceId++) {
      await client.query(
        'INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)',
        [4, serviceId]
      )
    }

    // Provider 5 (Mohamed Ali - Painting) - Services 25-30 (Painting services)
    for (let serviceId = 25; serviceId <= 30; serviceId++) {
      await client.query(
        'INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)',
        [5, serviceId]
      )
    }

    // Provider 6 (Sarah Johnson - Gardening) - Services 7-12 (Gardening services)
    for (let serviceId = 7; serviceId <= 12; serviceId++) {
      await client.query(
        'INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)',
        [6, serviceId]
      )
    }

    // Provider 7 (Peter Mwangi - Electrical) - Services 13-18 (Electrical services)
    for (let serviceId = 13; serviceId <= 18; serviceId++) {
      await client.query(
        'INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)',
        [7, serviceId]
      )
    }

    // Provider 8 (Fatma Hassan - Plumbing) - Services 19-24 (Plumbing services)
    for (let serviceId = 19; serviceId <= 24; serviceId++) {
      await client.query(
        'INSERT INTO provider_services (provider_id, service_id) VALUES ($1, $2)',
        [8, serviceId]
      )
    }

    console.log('✅ Provider-service links created successfully!')
  } catch (error) {
    console.error('❌ Error creating provider services:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

createProviderServices().catch(console.error) 