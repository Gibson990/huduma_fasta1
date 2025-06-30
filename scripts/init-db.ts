import { Pool } from 'pg'
import fs from 'fs'
import path from 'path'

async function initDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    // Read schema file
    const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    // Execute schema
    await pool.query(schema)
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

initDatabase() 