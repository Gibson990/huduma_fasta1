import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Get all bookings assigned to a specific provider
export async function GET(
  request: Request,
  { params }: { params: { providerId: string } }
) {
  try {
    const { providerId } = params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let queryString = `
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
      WHERE b.provider_id = $1
    `
    const queryParams = [providerId]

    if (status) {
      queryString += ' AND b.status = $2'
      queryParams.push(status)
    }

    queryString += ' ORDER BY b.booking_date ASC, b.booking_time ASC'

    const client = await pool.connect()
    const result = await client.query(queryString, queryParams)
    client.release()

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching provider bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// Provider actions on bookings (accept/cancel)
export async function POST(
  request: Request,
  { params }: { params: { providerId: string } }
) {
  try {
    const { providerId } = params
    const body = await request.json()
    const { bookingId, action, notes } = body

    const client = await pool.connect()

    // Verify the booking is assigned to this provider
    const bookingResult = await client.query(
      'SELECT * FROM bookings WHERE id = $1 AND provider_id = $2',
      [bookingId, providerId]
    )

    if (bookingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found or not assigned to this provider' },
        { status: 404 }
      )
    }

    const booking = bookingResult.rows[0]

    switch (action) {
      case 'accept':
        await client.query(
          'UPDATE bookings SET status = $1, provider_notes = $2 WHERE id = $3',
          ['accepted', notes, bookingId]
        )
        break

      case 'cancel':
        // Provider cancels - trigger reassignment
        await client.query(
          'UPDATE bookings SET provider_id = NULL, status = $1, provider_notes = $2 WHERE id = $3',
          ['unassigned', notes, bookingId]
        )
        
        // Try to reassign to another provider
        await handleProviderCancellation(client, booking)
        break

      case 'complete':
        await client.query(
          'UPDATE bookings SET status = $1, completed_at = NOW(), provider_notes = $2 WHERE id = $3',
          ['completed', notes, bookingId]
        )
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    client.release()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating booking:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

// Handle provider cancellation and reassignment (same logic as in booking route)
async function handleProviderCancellation(client: any, booking: any) {
  try {
    // Find another available provider for the same service
    const alternativeProviders = await client.query(`
      SELECT sp.id, sp.user_id, sp.location, sp.rating
      FROM service_providers sp
      JOIN provider_services ps ON sp.id = ps.provider_id
      WHERE ps.service_id = $1 
        AND sp.is_verified = true 
        AND sp.user_id != $2
      ORDER BY sp.rating DESC
    `, [booking.service_id, booking.provider_id])

    if (alternativeProviders.rows.length > 0) {
      // Assign to the best available provider
      const newProvider = alternativeProviders.rows[0]
      await client.query(
        'UPDATE bookings SET provider_id = $1, status = $2 WHERE id = $3',
        [newProvider.user_id, 'assigned', booking.id]
      )
      
      console.log(`Booking ${booking.id} reassigned from provider ${booking.provider_id} to ${newProvider.user_id}`)
    } else {
      console.log(`No alternative providers available for booking ${booking.id}`)
    }
  } catch (error) {
    console.error('Error in provider cancellation handling:', error)
    throw error
  }
} 