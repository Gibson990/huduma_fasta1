import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'huduma_db', // Connect to huduma_db
  password: '54642323',
  port: 5432
})

async function resetDatabase() {
  const client = await pool.connect()
  try {
    console.log('🔄 Resetting database...')
    
    // Read and execute the drops.sql file
    const dropsSQL = fs.readFileSync(path.join(__dirname, 'drops.sql'), 'utf8')
    await client.query(dropsSQL)
    
    console.log('✅ Database reset successfully!')
  } catch (error) {
    console.error('❌ Error resetting database:', error)
  } finally {
    client.release()
    await pool.end()
  }
}

resetDatabase() 