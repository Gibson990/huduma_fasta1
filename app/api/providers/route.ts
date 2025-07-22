import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import formidable, { File } from 'formidable'
import { promises as fs } from 'fs'
import path from 'path'
import { generateProviderContract } from '@/lib/generate-contract'

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

// Get all providers (unchanged)
export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query(`
      SELECT id, name, email, phone, role, kyc_document_type, kyc_document_url, kyc_status, contract_status, is_active
      FROM users WHERE role = 'provider' ORDER BY id DESC
    `)
    client.release()
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 })
  }
}

// POST: Provider registration with KYC document upload
export async function POST(req: any) {
  try {
    const { fields, files } = await parseFormData(req)
    const { 
      firstName,
      lastName,
      email, 
      phone, 
      password, // hash this in production!
      documentType,
    } = fields

    const documentFile = files.documentFile as File
    if (!firstName || !lastName || !email || !phone || !password || !documentType || !documentFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save the PDF file to /public/uploads/kyc/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'kyc')
    await fs.mkdir(uploadsDir, { recursive: true })
    const fileName = `${Date.now()}_${email.replace(/[^a-zA-Z0-9]/g, '')}_${documentFile.originalFilename}`
    const filePath = path.join(uploadsDir, fileName)
    await fs.copyFile(documentFile.filepath, filePath)
    const fileUrl = `/uploads/kyc/${fileName}`

    // Insert provider into users table
    const client = await pool.connect()
    const fullName = `${firstName} ${lastName}`
    const result = await client.query(
      `INSERT INTO users (name, email, phone, password_hash, role, kyc_document_type, kyc_document_url, kyc_status, contract_status, is_active)
       VALUES ($1, $2, $3, $4, 'provider', $5, $6, 'pending', 'pending', false)
       RETURNING id, name, email, phone, role, kyc_document_type, kyc_document_url, kyc_status, contract_status, is_active, created_at`,
      [fullName, email, phone, password, documentType, fileUrl]
    )
    const provider = result.rows[0]

    // Generate contract PDF
    const contractsDir = path.join(process.cwd(), 'public', 'uploads', 'contracts')
    await fs.mkdir(contractsDir, { recursive: true })
    const contractFileName = `${provider.id}_${Date.now()}_contract.pdf`
    const contractPath = path.join(contractsDir, contractFileName)
    await generateProviderContract({
      providerName: provider.name,
      providerEmail: provider.email,
      registrationDate: provider.created_at ? new Date(provider.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
      outputPath: contractPath,
    })
    const contractUrl = `/uploads/contracts/${contractFileName}`

    // Update user with contract_url
    await client.query(
      `UPDATE users SET contract_url = $1 WHERE id = $2`,
      [contractUrl, provider.id]
    )
    client.release()

    return NextResponse.json({ ...provider, contract_url: contractUrl, contract_download: contractUrl })
  } catch (error) {
    console.error('Error creating provider:', error)
    return NextResponse.json({ error: 'Failed to create provider' }, { status: 500 })
  }
} 