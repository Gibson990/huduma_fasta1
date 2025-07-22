const { Pool } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db',
  password: '54642323',
  port: 5432,
})

async function insertProviderServices() {
  const client = await pool.connect()
  try {
    console.log('🔄 Inserting provider-service relationships...')

    const relationships = [
      // John Mwangi (Cleaning Specialist) - Services 1, 2, 3
      [1, 1, 55000], [1, 2, 85000], [1, 3, 32000],
      
      // Sarah Kimani (Gardener) - Services 4, 5, 6
      [2, 4, 42000], [2, 5, 160000], [2, 6, 38000],
      
      // David Ochieng (Plumber) - Services 7, 8, 9
      [3, 7, 48000], [3, 8, 125000], [3, 9, 38000],
      
      // Grace Wanjiku (Electrician) - Services 10, 11, 12
      [4, 10, 58000], [4, 11, 42000], [4, 12, 32000],
      
      // Michael Odhiambo (Painter) - Services 1, 2
      [5, 1, 52000], [5, 2, 82000],
      
      // Lucy Akinyi (Home Maintenance) - Services 1, 2, 4, 6
      [6, 1, 48000], [6, 2, 78000], [6, 4, 38000], [6, 6, 32000],
      
      // Peter Njoroge (Carpenter) - Services 1, 2
      [7, 1, 50000], [7, 2, 80000],
      
      // Mary Wambui (Interior Design) - Services 1, 2, 3
      [8, 1, 55000], [8, 2, 88000], [8, 3, 35000],
      
      // James Kiprop (Security) - Services 10, 11, 12
      [9, 10, 60000], [9, 11, 45000], [9, 12, 35000],
      
      // Ann Muthoni (Appliance Repair) - Services 7, 10, 11
      [10, 7, 50000], [10, 10, 62000], [10, 11, 48000]
    ]

    for (const [providerId, serviceId, customPrice] of relationships) {
      await client.query(
        'INSERT INTO provider_services (provider_id, service_id, custom_price) VALUES ($1, $2, $3)',
        [providerId, serviceId, customPrice]
      )
    }

    console.log('✅ Provider-service relationships inserted successfully!')
  } catch (error) {
    console.error('❌ Error inserting provider-service relationships:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

insertProviderServices() 