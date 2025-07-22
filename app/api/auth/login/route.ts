import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const client = await pool.connect()

    try {
      // Find user by email
      const userResult = await client.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )

      if (userResult.rows.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        )
      }

      const user = userResult.rows[0]

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash)

      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        )
      }

      // Return user data (without password)
      const { password_hash, ...userData } = user

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: userData
      })
    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 