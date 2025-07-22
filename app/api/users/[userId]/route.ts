import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import formidable, { File } from 'formidable'
import { promises as fs } from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

// Helper to parse multipart/form-data
async function parseFormData(req: any): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false, uploadDir: '/tmp', keepExtensions: true })
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      else resolve({ fields, files })
    })
  })
}

export async function POST(req: any, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    const { files } = await parseFormData(req)
    const signedContract = files.signedContract as File
    if (!signedContract) {
      return NextResponse.json({ error: 'No contract file uploaded' }, { status: 400 })
    }
    // Save the PDF file to /public/uploads/contracts/
    const contractsDir = path.join(process.cwd(), 'public', 'uploads', 'contracts')
    await fs.mkdir(contractsDir, { recursive: true })
    const fileName = `${userId}_${Date.now()}_signed_contract.pdf`
    const filePath = path.join(contractsDir, fileName)
    await fs.copyFile(signedContract.filepath, filePath)
    const fileUrl = `/uploads/contracts/${fileName}`
    // Update user contract_url and contract_status
    const client = await pool.connect()
    await client.query(
      `UPDATE users SET contract_url = $1, contract_status = 'uploaded' WHERE id = $2`,
      [fileUrl, userId]
    )
    const result = await client.query('SELECT id, kyc_status, contract_status, is_active FROM users WHERE id = $1', [userId])
    client.release()
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error uploading signed contract:', error)
    return NextResponse.json({ error: 'Failed to upload contract' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    const body = await request.json()
    const { name, email, phone, address, currentPassword, newPassword } = body

    const client = await pool.connect()

    // First, get the current user data
    const currentUser = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    )

    if (currentUser.rows.length === 0) {
      client.release()
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = currentUser.rows[0]

    // If password change is requested, verify current password
    if (newPassword && currentPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isPasswordValid) {
        client.release()
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      }
    }

    // Prepare update fields
    const updateFields = []
    const updateValues = []
    let paramCount = 1

    if (name) {
      updateFields.push(`name = $${paramCount}`)
      updateValues.push(name)
      paramCount++
    }

    if (email) {
      updateFields.push(`email = $${paramCount}`)
      updateValues.push(email)
      paramCount++
    }

    if (phone !== undefined) {
      updateFields.push(`phone = $${paramCount}`)
      updateValues.push(phone)
      paramCount++
    }

    if (address !== undefined) {
      updateFields.push(`address = $${paramCount}`)
      updateValues.push(address)
      paramCount++
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      updateFields.push(`password = $${paramCount}`)
      updateValues.push(hashedPassword)
      paramCount++
    }

    if (updateFields.length === 0) {
      client.release()
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    // Add updated_at timestamp
    updateFields.push(`updated_at = NOW()`)

    // Add userId to values array
    updateValues.push(userId)

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, phone, address, role, created_at, updated_at
    `

    const result = await client.query(query, updateValues)
    client.release()

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    })

  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params
    const body = await request.json()
    const { password } = body

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

    // Delete user
    await client.query('DELETE FROM users WHERE id = $1', [userId])
    client.release()

    return NextResponse.json({ message: 'Account deleted successfully' })

  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    )
  }
} 