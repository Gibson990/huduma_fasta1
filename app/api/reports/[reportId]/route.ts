import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

// PATCH /api/reports/[reportId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const { reportId } = params
    const body = await request.json()
    const { status, adminNotes } = body

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    const query = `
      UPDATE reports 
      SET status = $1, admin_notes = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `

    const result = await pool.query(query, [status, adminNotes || null, reportId])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error updating report:", error)
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    // TODO: Add proper admin authentication
    // For now, allow the request to proceed
    // In production, you should implement proper admin authentication

    const reportId = params.reportId

    const result = await pool.query(
      "DELETE FROM reports WHERE id = $1 RETURNING id",
      [reportId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Report deleted successfully" })
  } catch (error) {
    console.error("Error deleting report:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 