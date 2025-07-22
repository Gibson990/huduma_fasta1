import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

// GET /api/reviews?providerId=...&userId=...&bookingId=...&limit=...&offset=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")
    const userId = searchParams.get("userId")
    const bookingId = searchParams.get("bookingId")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")

    let query = `
      SELECT r.*, u.name as user_name, u.email as user_email, p.name as provider_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN providers p ON r.provider_id = p.id
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    if (providerId) {
      query += ` AND r.provider_id = $${paramIndex++}`
      params.push(providerId)
    }
    if (userId) {
      query += ` AND r.user_id = $${paramIndex++}`
      params.push(userId)
    }
    if (bookingId) {
      query += ` AND r.booking_id = $${paramIndex++}`
      params.push(bookingId)
    }

    query += ` ORDER BY r.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`
    params.push(limit, offset)

    const result = await pool.query(query, params)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, userId, providerId, rating, reviewText } = body

    if (!userId || !providerId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const query = `
      INSERT INTO reviews (booking_id, user_id, provider_id, rating, review_text)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `

    const result = await pool.query(query, [
      bookingId || null,
      userId,
      providerId,
      rating,
      reviewText || null
    ])

    // Trigger notification for the provider
    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        providerId,
        'review',
        'You received a new review',
        reviewText || `Rating: ${rating}`,
        result.rows[0].id,
        'review'
      ]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    )
  }
} 