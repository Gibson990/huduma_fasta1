import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Handle contact form submissions
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      providerId,
      providerEmail,
      name,
      email,
      phone,
      subject,
      message,
      userId // Accept userId from request
    } = body

    const client = await pool.connect()
    
    // Store the contact message in the database
    const result = await client.query(
      `INSERT INTO contact_messages (
        provider_id,
        customer_id,
        customer_name,
        customer_email,
        customer_phone,
        subject,
        message,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id`,
      [providerId, userId || null, name, email, phone, subject, message, 'unread']
    )
    
    client.release()

    // In a real application, you would send an email here
    // For now, we'll just log the message
    console.log('Contact message received:', {
      providerId,
      providerEmail,
      name,
      email,
      phone,
      subject,
      message
    })

    return NextResponse.json({ 
      success: true, 
      messageId: result.rows[0].id 
    })
  } catch (error) {
    console.error('Error processing contact message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
} 