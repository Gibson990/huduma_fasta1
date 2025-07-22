import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { bookingId } = params
    const { providerId, adminId, notes } = await request.json()

    if (!providerId || !adminId) {
      return NextResponse.json(
        { error: "Provider ID and Admin ID are required" },
        { status: 400 }
      )
    }

    // Verify the booking exists and is pending
    const bookingResult = await query(
      "SELECT * FROM bookings WHERE id = $1 AND status = 'pending'",
      [bookingId]
    )

    if (bookingResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Booking not found or not available for assignment" },
        { status: 404 }
      )
    }

    // Verify the provider exists and is active
    const providerResult = await query(
      "SELECT * FROM providers WHERE id = $1 AND is_active = true",
      [providerId]
    )

    if (providerResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Provider not found or not active" },
        { status: 404 }
      )
    }

    // Start a transaction
    await query("BEGIN")

    try {
      // Update the booking with provider assignment
      await query(
        `UPDATE bookings 
         SET provider_id = $1, admin_id = $2, assigned_at = CURRENT_TIMESTAMP, status = 'confirmed'
         WHERE id = $3`,
        [providerId, adminId, bookingId]
      )

      // Record the assignment in assignment_history
      await query(
        `INSERT INTO assignment_history (booking_id, provider_id, admin_id, notes)
         VALUES ($1, $2, $3, $4)`,
        [bookingId, providerId, adminId, notes || null]
      )

      // Record admin action
      await query(
        `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, details)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          adminId,
          'assign_provider',
          'booking',
          bookingId,
          JSON.stringify({
            providerId,
            providerName: providerResult.rows[0].name,
            notes
          })
        ]
      )

      await query("COMMIT")

      // Get the updated booking with provider details
      const updatedBookingResult = await query(
        `SELECT b.*, p.name as provider_name, p.email as provider_email, p.phone as provider_phone
         FROM bookings b
         LEFT JOIN providers p ON b.provider_id = p.id
         WHERE b.id = $1`,
        [bookingId]
      )

      return NextResponse.json({
        success: true,
        message: "Provider assigned successfully",
        booking: updatedBookingResult.rows[0]
      })

    } catch (error) {
      await query("ROLLBACK")
      throw error
    }

  } catch (error) {
    console.error("Error assigning provider:", error)
    return NextResponse.json(
      { error: "Failed to assign provider" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { bookingId } = params
    const { providerId, adminId, notes } = await request.json()

    if (!providerId || !adminId) {
      return NextResponse.json(
        { error: "Provider ID and Admin ID are required" },
        { status: 400 }
      )
    }

    // Update the assignment
    await query(
      `UPDATE assignment_history 
       SET provider_id = $1, notes = $2, assigned_at = CURRENT_TIMESTAMP
       WHERE booking_id = $3`,
      [providerId, notes, bookingId]
    )

    // Update the booking
    await query(
      `UPDATE bookings 
       SET provider_id = $1, assigned_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [providerId, bookingId]
    )

    // Record admin action
    await query(
      `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        adminId,
        'reassign_provider',
        'booking',
        bookingId,
        JSON.stringify({
          providerId,
          notes
        })
      ]
    )

    return NextResponse.json({
      success: true,
      message: "Provider reassigned successfully"
    })

  } catch (error) {
    console.error("Error reassigning provider:", error)
    return NextResponse.json(
      { error: "Failed to reassign provider" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { bookingId } = params
    const { adminId } = await request.json()

    if (!adminId) {
      return NextResponse.json(
        { error: "Admin ID is required" },
        { status: 400 }
      )
    }

    // Remove the assignment
    await query(
      `UPDATE bookings 
       SET provider_id = NULL, admin_id = NULL, assigned_at = NULL, status = 'pending'
       WHERE id = $1`,
      [bookingId]
    )

    // Update assignment history
    await query(
      `UPDATE assignment_history 
       SET status = 'removed', notes = CONCAT(COALESCE(notes, ''), ' - Assignment removed by admin')
       WHERE booking_id = $1`,
      [bookingId]
    )

    // Record admin action
    await query(
      `INSERT INTO admin_actions (admin_id, action_type, target_type, target_id, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        adminId,
        'remove_assignment',
        'booking',
        bookingId,
        JSON.stringify({
          reason: 'Admin removed assignment'
        })
      ]
    )

    return NextResponse.json({
      success: true,
      message: "Provider assignment removed successfully"
    })

  } catch (error) {
    console.error("Error removing provider assignment:", error)
    return NextResponse.json(
      { error: "Failed to remove provider assignment" },
      { status: 500 }
    )
  }
} 