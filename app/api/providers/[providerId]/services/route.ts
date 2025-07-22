import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Get services for a specific provider
export async function GET(
  request: Request,
  { params }: { params: { providerId: string } }
) {
  try {
    const { providerId } = params
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
        ps.custom_price
      FROM services s
      JOIN provider_services ps ON s.id = ps.service_id
      WHERE ps.provider_id = $1
      ORDER BY s.name_en
    `, [providerId])
    client.release()

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching provider services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch provider services' },
      { status: 500 }
    )
  }
}

// Add a service to a provider
export async function POST(
  request: Request,
  { params }: { params: { providerId: string } }
) {
  try {
    const { providerId } = params
    const body = await request.json()
    const { serviceId, customPrice } = body

    const client = await pool.connect()
    const result = await client.query(
      `INSERT INTO provider_services (provider_id, service_id, custom_price)
       VALUES ($1, $2, $3) RETURNING *`,
      [providerId, serviceId, customPrice]
    )
    client.release()

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error adding service to provider:', error)
    return NextResponse.json(
      { error: 'Failed to add service to provider' },
      { status: 500 }
    )
  }
} 