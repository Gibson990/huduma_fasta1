import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Get all services
export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query(`
      SELECT 
        s.id,
        s.name_en,
        s.name_sw,
        s.description_en,
        s.description_sw,
        s.base_price,
        s.duration_minutes,
        s.rating,
        s.image_url,
        s.category_id,
        c.name_en as category_name
      FROM services s
      LEFT JOIN categories c ON s.category_id = c.id
      ORDER BY s.id DESC
    `)
    client.release()
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// Create a new service
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name_en,
      name_sw,
      description_en,
      description_sw,
      base_price,
      duration_minutes,
      category_id,
      image_url
    } = body

    const client = await pool.connect()
    const result = await client.query(
      `INSERT INTO services (name_en, name_sw, description_en, description_sw, base_price, duration_minutes, category_id, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name_en, name_sw, description_en, description_sw, base_price, duration_minutes, category_id, image_url]
    )
    client.release()
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
} 