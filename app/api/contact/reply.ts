import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// POST /api/contact/reply
export async function POST(request: NextRequest) {
  try {
    const { messageId, providerId, reply } = await request.json();
    if (!messageId || !providerId || !reply) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const client = await pool.connect();
    // Update the contact message with the reply
    const updateResult = await client.query(
      `UPDATE contact_messages SET reply = $1, status = 'replied', replied_at = NOW() WHERE id = $2 AND provider_id = $3 RETURNING *`,
      [reply, messageId, providerId]
    );
    if (updateResult.rows.length === 0) {
      client.release();
      return NextResponse.json({ error: "Message not found or not authorized" }, { status: 404 });
    }
    const message = updateResult.rows[0];
    // Trigger a notification for the user
    await client.query(
      `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        message.customer_id || null, // If customer_id is available
        'message_reply',
        'Provider replied to your message',
        reply,
        messageId,
        'contact_message'
      ]
    );
    client.release();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error replying to contact message:", error);
    return NextResponse.json({ error: "Failed to reply to message" }, { status: 500 });
  }
} 