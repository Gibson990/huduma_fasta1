import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

// GET /api/reports?providerId=...&userId=...&status=...&limit=...&offset=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    let query = `
      SELECT 
        r.id,
        r.report_type as "reportType",
        r.description as reason,
        r.status,
        r.admin_notes as "adminNotes",
        r.created_at as "createdAt",
        r.updated_at as "updatedAt",
        u.name as "reporterName",
        u.phone as "reporterPhone",
        CASE 
          WHEN r.report_type = 'booking' THEN bp.name
          ELSE p.name 
        END as "targetName",
        CASE 
          WHEN r.report_type = 'booking' THEN bp.phone
          ELSE p.phone 
        END as "targetPhone",
        CASE 
          WHEN r.report_type = 'booking' THEN r.booking_id
          ELSE r.provider_id 
        END as "targetId"
      FROM reports r
      LEFT JOIN users u ON r.reporter_id = u.id
      LEFT JOIN providers p ON r.provider_id = p.id
      LEFT JOIN bookings b ON r.booking_id = b.id
      LEFT JOIN providers bp ON b.provider_id = bp.id
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    if (providerId) {
      query += ` AND r.provider_id = $${paramIndex++}`
      params.push(providerId)
    }
    if (userId) {
      query += ` AND r.reporter_id = $${paramIndex++}`
      params.push(userId)
    }
    if (status) {
      query += ` AND r.status = $${paramIndex++}`
      params.push(status)
    }

    query += ` ORDER BY r.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
    params.push(limit, offset)

    const result = await pool.query(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    )
  }
}

// POST /api/reports
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      reporterId, 
      reporterName,
      targetId, 
      targetName,
      reason,
      description, 
      reportType 
    } = body

    if (!reporterId || !reportType || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Determine the appropriate fields based on report type
    let providerId = null
    let bookingId = null
    let reportedUserId = null

    if (reportType === 'booking' && targetId) {
      // For booking reports, get the provider_id from the booking
      const bookingQuery = await pool.query(
        'SELECT provider_id FROM bookings WHERE id = $1',
        [targetId]
      )
      if (bookingQuery.rows.length > 0) {
        providerId = bookingQuery.rows[0].provider_id
        bookingId = targetId
      }
    } else if (reportType === 'provider' && targetId) {
      providerId = targetId
    } else if (reportType === 'user' && targetId) {
      reportedUserId = targetId
    }

    // Combine reason and description for the full description
    const fullDescription = reason ? `${reason}: ${description}` : description

    const query = `
      INSERT INTO reports (reporter_id, reported_user_id, provider_id, booking_id, report_type, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `

    const result = await pool.query(query, [
      reporterId,
      reportedUserId,
      providerId,
      bookingId,
      reportType,
      fullDescription
    ])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    )
  }
} 