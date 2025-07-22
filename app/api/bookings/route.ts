import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// Get all bookings with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const location = searchParams.get('location')
    const serviceId = searchParams.get('serviceId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let queryString = `
      SELECT 
        b.id,
        b.service_id,
        s.name_en as service_name,
        b.customer_id,
        b.customer_name,
        b.customer_email,
        b.customer_phone,
        b.address,
        b.booking_date,
        b.booking_time,
        b.total_amount,
        b.status,
        b.notes,
        b.created_at,
        b.provider_id,
        u.name as provider_name,
        CASE WHEN r.id IS NOT NULL THEN true ELSE false END as has_review
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      LEFT JOIN users u ON b.provider_id = u.id
      LEFT JOIN reviews r ON b.id = r.booking_id
      WHERE 1=1
    `
    const queryParams: any[] = []

    if (userId) {
      queryString += ' AND b.customer_id = $' + (queryParams.length + 1)
      queryParams.push(userId)
    }
    if (status) {
      queryString += ' AND b.status = $' + (queryParams.length + 1)
      queryParams.push(status)
    }
    if (location) {
      queryString += ' AND b.address ILIKE $' + (queryParams.length + 1)
      queryParams.push(`%${location}%`)
    }
    if (serviceId) {
      queryString += ' AND b.service_id = $' + (queryParams.length + 1)
      queryParams.push(serviceId)
    }

    queryString += ` ORDER BY b.created_at DESC LIMIT ${limit} OFFSET ${offset}`

    const client = await pool.connect()
    try {
    const result = await client.query(queryString, queryParams)
      return NextResponse.json(result.rows)
    } finally {
    client.release()
    }
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

// Create a new booking
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      serviceId,
      name,
      email,
      phone,
      address,
      date,
      time,
      notes,
      userId
    } = body

    // Get service price
    const client = await pool.connect()
    const serviceResult = await client.query(
      'SELECT base_price FROM services WHERE id = $1',
      [serviceId]
    )

    if (serviceResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    const basePrice = serviceResult.rows[0].base_price

    // --- Provider Auto-Assignment Logic ---
    // Find available, verified providers for this service and location
    // 1. Find providers linked to this service
    // 2. Filter by location (if possible)
    // 3. Pick the best (highest rating, or random)
    let assignedProviderId = null
    let bookingStatus = 'pending'
    try {
      // Find providers for this service
      const providerQuery = await client.query(`
        SELECT sp.id, sp.user_id, sp.location, sp.rating
        FROM service_providers sp
        JOIN provider_services ps ON sp.id = ps.provider_id
        WHERE ps.service_id = $1 AND sp.is_verified = true
      `, [serviceId])
      let providers = providerQuery.rows
      // Filter by location (if address is provided)
      if (address && providers.length > 0) {
        const userLocation = address.toLowerCase()
        providers = providers.filter(p => p.location && userLocation.includes(p.location.toLowerCase()))
      }
      // Pick the best provider (highest rating)
      if (providers.length > 0) {
        providers.sort((a, b) => b.rating - a.rating)
        assignedProviderId = providers[0].user_id
      } else {
        bookingStatus = 'unassigned'
      }
    } catch (err) {
      console.error('Error finding provider:', err)
      bookingStatus = 'unassigned'
    }

    // Create booking with provider_id
    const result = await client.query(
      `INSERT INTO bookings (
        service_id,
        customer_id,
        provider_id,
        customer_name,
        customer_email,
        customer_phone,
        address,
        booking_date,
        booking_time,
        total_amount,
        status,
        notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, provider_id`,
      [
        serviceId,
        userId,
        assignedProviderId,
        name,
        email,
        phone,
        address,
        date,
        time,
        basePrice,
        bookingStatus,
        notes
      ]
    )

    // Notify provider if assigned
    if (assignedProviderId) {
      await client.query(
        `INSERT INTO notifications (user_id, type, title, message, related_id, related_type)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          assignedProviderId,
          'booking',
          'You have a new booking',
          `A new booking has been assigned to you.`,
          result.rows[0].id,
          'booking'
        ]
      )
    }
    client.release()

    return NextResponse.json({ id: result.rows[0].id })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
} 