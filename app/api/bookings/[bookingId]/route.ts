import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Get a specific booking
export async function GET(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const client = await pool.connect()
    const result = await client.query(`
      SELECT 
        b.*,
        s.name_en as service_name,
        u.name as provider_name,
        u.email as provider_email,
        u.phone as provider_phone
      FROM bookings b
      LEFT JOIN services s ON b.service_id = s.id
      LEFT JOIN users u ON b.provider_id = u.id
      WHERE b.id = $1
    `, [params.bookingId])
    client.release()

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}

// Update booking status (for provider cancellation, admin assignment, etc.)
export async function PATCH(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
  try {
    const body = await request.json()
    const { action, providerId, status, notes } = body

    const client = await pool.connect()

    // Get current booking details
    const bookingResult = await client.query(
      'SELECT * FROM bookings WHERE id = $1',
      [params.bookingId]
    )

    if (bookingResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    const booking = bookingResult.rows[0]

    // If no action is provided, treat as a generic status update
    if (!action && status) {
      await client.query(
        'UPDATE bookings SET status = $1, notes = $2 WHERE id = $3',
        [status, notes, params.bookingId]
      )
      client.release()
      return NextResponse.json({ success: true })
    }

    switch (action) {
      case 'provider_cancel':
        // Provider cancels the booking - try to reassign
        await handleProviderCancellation(client, booking)
        // Notify provider of cancellation
        if (booking.provider_id) {
          await client.query(
            `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              booking.provider_id,
              'booking_status',
              'Booking Cancelled',
              `A booking assigned to you was cancelled.`,
              booking.id,
              'booking'
            ]
          )
        }
        break

      case 'admin_assign':
        // Admin manually assigns a provider
        await client.query(
          'UPDATE bookings SET provider_id = $1, status = $2 WHERE id = $3',
          [providerId, 'assigned', params.bookingId]
        )
        // Notify provider of assignment
        if (providerId) {
          await client.query(
            `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              providerId,
              'booking_status',
              'You have been assigned a booking',
              `A booking has been assigned to you by an admin.`,
              booking.id,
              'booking'
            ]
          )
        }
        break

      case 'update_status':
        // Update booking status
        await client.query(
          'UPDATE bookings SET status = $1, notes = $2 WHERE id = $3',
          [status, notes, params.bookingId]
        )
        // Notify provider of status update
        if (booking.provider_id) {
          await client.query(
            `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              booking.provider_id,
              'booking_status',
              `Booking status updated to ${status}`,
              `The status of a booking assigned to you has changed to ${status}.`,
              booking.id,
              'booking'
            ]
          )
        }
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

// Handle provider cancellation and reassignment
async function handleProviderCancellation(client: any, booking: any) {
  try {
    // 1. Remove current provider assignment
    await client.query(
      'UPDATE bookings SET provider_id = NULL, status = $1 WHERE id = $2',
      ['unassigned', booking.id]
    )

    // 2. Try to find another available provider for the same service
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
      // 3. Assign to the best available provider
      const newProvider = alternativeProviders.rows[0]
      await client.query(
        'UPDATE bookings SET provider_id = $1, status = $2 WHERE id = $3',
        [newProvider.user_id, 'assigned', booking.id]
      )
      
      // 4. Log the reassignment (optional - could add to a notifications table)
      console.log(`Booking ${booking.id} reassigned from provider ${booking.provider_id} to ${newProvider.user_id}`)
    } else {
      // 5. No alternative providers available - keep as unassigned
      console.log(`No alternative providers available for booking ${booking.id}`)
    }
  } catch (error) {
    console.error('Error in provider cancellation handling:', error)
    throw error
  }
} 