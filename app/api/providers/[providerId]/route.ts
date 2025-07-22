import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Get a specific provider by ID
export async function GET(
  request: Request,
  { params }: { params: { providerId: string } }
) {
  try {
    const { providerId } = params
    const client = await pool.connect()
    const result = await client.query(`
      SELECT 
        id,
        name,
        email,
        phone,
        specialization_en,
        specialization_sw,
        experience_years,
        rating,
        total_jobs,
        is_verified,
        location,
        created_at
      FROM service_providers
      WHERE id = $1 AND is_available = true
    `, [providerId])
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching provider:', error)
    return NextResponse.json(
      { error: 'Failed to fetch provider' },
      { status: 500 }
    )
  }
}

// Update a provider
export async function PUT(
  request: Request,
  { params }: { params: { providerId: string } }
) {
  try {
    const { providerId } = params
    const body = await request.json()
    const {
      name,
      email,
      phone,
      specialization_en,
      specialization_sw,
      experience_years,
      location,
      is_verified
    } = body

    const client = await pool.connect()
    const result = await client.query(
      `UPDATE service_providers 
       SET name = $1, email = $2, phone = $3, specialization_en = $4, 
           specialization_sw = $5, experience_years = $6, location = $7, is_verified = $8
       WHERE id = $9 
       RETURNING *`,
      [name, email, phone, specialization_en, specialization_sw, experience_years, location, is_verified, providerId]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating provider:', error)
    return NextResponse.json(
      { error: 'Failed to update provider' },
      { status: 500 }
    )
  }
}

// Delete a provider
export async function DELETE(
  request: Request,
  { params }: { params: { providerId: string } }
) {
  try {
    const { providerId } = params
    const client = await pool.connect()
    const result = await client.query(
      'UPDATE service_providers SET is_available = false WHERE id = $1 RETURNING *',
      [providerId]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Provider deactivated successfully' })
  } catch (error) {
    console.error('Error deactivating provider:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate provider' },
      { status: 500 }
    )
  }
} 