import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Get a specific service by ID
export async function GET(
  request: Request,
  { params }: { params: { serviceId: string } }
) {
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
      WHERE s.id = $1
    `, [params.serviceId])
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

// Update a service
export async function PUT(
  request: Request,
  { params }: { params: { serviceId: string } }
) {
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
      `UPDATE services 
       SET name_en = $1, name_sw = $2, description_en = $3, description_sw = $4, 
           base_price = $5, duration_minutes = $6, category_id = $7, image_url = $8
       WHERE id = $9 
       RETURNING *`,
      [name_en, name_sw, description_en, description_sw, base_price, duration_minutes, category_id, image_url, params.serviceId]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// Patch a service (for partial updates like status toggle)
export async function PATCH(
  request: Request,
  { params }: { params: { serviceId: string } }
) {
  try {
    const body = await request.json()
    const { is_active } = body

    const client = await pool.connect()
    const result = await client.query(
      `UPDATE services 
       SET is_active = $1
       WHERE id = $2 
       RETURNING *`,
      [is_active, params.serviceId]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating service status:', error)
    return NextResponse.json(
      { error: 'Failed to update service status' },
      { status: 500 }
    )
  }
}

// Delete a service
export async function DELETE(
  request: Request,
  { params }: { params: { serviceId: string } }
) {
  try {
    const client = await pool.connect()
    const result = await client.query(
      'DELETE FROM services WHERE id = $1 RETURNING *',
      [params.serviceId]
    )
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
} 