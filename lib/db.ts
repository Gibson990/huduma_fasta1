import { Pool } from "pg"

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "huduma_db",
  password: "54642323",
  port: 5432,
})

export async function testConnection() {
  try {
    const client = await pool.connect()
    await client.query("SELECT NOW()")
    client.release()
    return true
  } catch (error) {
    console.error("Database connection error:", error)
    return false
  }
}

export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

export default pool 