import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Get all categories
export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query(`
      SELECT 
        id,
        name_en,
        name_sw,
        description_en,
        description_sw,
        image_url
      FROM service_categories
      WHERE is_active = true
      ORDER BY id
    `)
    client.release()
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// Create a new category
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name_en,
      name_sw,
      description_en,
      description_sw,
      image_url
    } = body

    const client = await pool.connect()
    const result = await client.query(
      `INSERT INTO service_categories (name_en, name_sw, description_en, description_sw, image_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name_en, name_sw, description_en, description_sw, image_url]
    )
    client.release()
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
} 