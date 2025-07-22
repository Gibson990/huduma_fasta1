import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json()

    const client = await pool.connect()

    // Get user data
    const user = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    )

    if (user.rows.length === 0) {
      client.release()
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password)
    if (!isPasswordValid) {
      client.release()
      return NextResponse.json({ error: 'Password is incorrect' }, { status: 400 })
    }

    // Delete user's bookings first
    await client.query('DELETE FROM bookings WHERE customer_id = $1', [userId])
    
    // Delete user's reviews
    await client.query('DELETE FROM reviews WHERE user_id = $1', [userId])
    
    // Delete user's reports
    await client.query('DELETE FROM reports WHERE reporter_id = $1', [userId])
    
    // Delete user's notifications
    await client.query('DELETE FROM notifications WHERE user_id = $1', [userId])

    // Finally delete the user
    await client.query('DELETE FROM users WHERE id = $1', [userId])
    
    client.release()

    return NextResponse.json({ message: 'Account deleted successfully' })

  } catch (error) {
    console.error('Error deleting user account:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
} 