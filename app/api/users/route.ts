import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Get all users
export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query(`
      SELECT 
        id,
        name,
        email,
        phone,
        role,
        is_active,
        image,
        specialization,
        location,
        rating,
        totalJobs,
        verified,
        address,
        created_at
      FROM users 
      ORDER BY id DESC
    `)
    client.release()
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      name, 
      email, 
      phone, 
      password_hash, 
      role = 'customer',
      is_active = true
    } = body

    const client = await pool.connect()
    const result = await client.query(
      `INSERT INTO users (name, email, phone, password_hash, role, is_active)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, phone, password_hash, role, is_active]
    )
    client.release()
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 