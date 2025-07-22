import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(request: Request, { params }: { params: { providerId: string } }) {
  try {
    const { providerId } = params
    const { kyc_status, contract_status, is_active, admin_note } = await request.json()
    const client = await pool.connect()
    await client.query(
      `UPDATE users SET kyc_status = $1, contract_status = $2, is_active = $3, admin_note = $4 WHERE id = $5`,
      [kyc_status, contract_status, is_active, admin_note || null, providerId]
    )
    const result = await client.query('SELECT id, kyc_status, contract_status, is_active, admin_note FROM users WHERE id = $1', [providerId])
    client.release()
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error verifying provider:', error)
    return NextResponse.json({ error: 'Failed to verify provider' }, { status: 500 })
  }
} 