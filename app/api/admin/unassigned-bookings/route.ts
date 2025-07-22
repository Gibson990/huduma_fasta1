import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Get all unassigned bookings
export async function GET(request: Request) {
  try {
    const client = await pool.connect()
    const result = await client.query(`
      SELECT 
        b.id,
        b.service_id,
        s.name_en as service_name,
        b.customer_name,
        b.customer_email,
        b.customer_phone,
        b.address,
        b.booking_date,
        b.booking_time,
        b.total_amount,
        b.status,
        b.notes,
        b.created_at
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.provider_id IS NULL AND b.status = 'unassigned'
      ORDER BY b.created_at ASC
    `)
    client.release()

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching unassigned bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch unassigned bookings' },
      { status: 500 }
    )
  }
}

// Admin manually assigns a provider to an unassigned booking
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bookingId, providerId, notes } = body

    const client = await pool.connect()

    // Verify the booking is unassigned
    const bookingResult = await client.query(
      'SELECT * FROM bookings WHERE id = $1 AND provider_id IS NULL AND status = $2',
      [bookingId, 'unassigned']
    )

    if (bookingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found or already assigned' },
        { status: 404 }
      )
    }

    // Verify the provider exists and is verified
    const providerResult = await client.query(
      'SELECT * FROM service_providers WHERE user_id = $1 AND is_verified = true',
      [providerId]
    )

    if (providerResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Provider not found or not verified' },
        { status: 404 }
      )
    }

    // Assign the provider
    await client.query(
      'UPDATE bookings SET provider_id = $1, status = $2, notes = $3 WHERE id = $4',
      [providerId, 'assigned', notes, bookingId]
    )

    client.release()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error assigning provider:', error)
    return NextResponse.json(
      { error: 'Failed to assign provider' },
      { status: 500 }
    )
  }
} 