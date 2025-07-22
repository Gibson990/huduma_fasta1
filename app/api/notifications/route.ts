import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

// GET /api/notifications?userId=...&limit=...&offset=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = parseInt(searchParams.get("limit") || "20")
    const offset = parseInt(searchParams.get("offset") || "0")
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    let query = `
      SELECT 
        n.*,
        u.name as user_name,
        u.email as user_email
      FROM notifications n
      JOIN users u ON n.user_id = u.id
      WHERE n.user_id = $1
    `
    const params: any[] = [userId]

    if (unreadOnly) {
      query += " AND n.is_read = false"
    }

    query += " ORDER BY n.created_at DESC LIMIT $2 OFFSET $3"
    params.push(limit, offset)

    const result = await pool.query(query, params)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

// POST /api/notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, title, message, relatedId, relatedType } = body

    // Validate required fields
    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const query = `
      INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `

    const result = await pool.query(query, [
      userId,
      type,
      title,
      message,
      relatedId || null,
      relatedType || null
    ])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    )
  }
} 