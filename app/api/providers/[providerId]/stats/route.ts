import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { providerId: string } }
) {
  try {
    const client = await pool.connect()
    
    // Get provider stats
    const statsResult = await client.query(`
      SELECT 
        COUNT(CASE WHEN b.status IN ('pending', 'assigned') THEN 1 END) as pending_bookings,
        COUNT(CASE WHEN b.status = 'completed' AND DATE(b.booking_date) = CURRENT_DATE THEN 1 END) as completed_today,
        COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as total_jobs,
        COALESCE(AVG(sp.rating), 0) as average_rating,
        COALESCE(SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END), 0) as total_earnings
      FROM service_providers sp
      LEFT JOIN bookings b ON sp.user_id = b.provider_id
      WHERE sp.user_id = $1
      GROUP BY sp.user_id, sp.rating
    `, [params.providerId])

    // Get monthly earnings (last 30 days)
    const monthlyResult = await client.query(`
      SELECT COALESCE(SUM(total_amount), 0) as monthly_earnings
      FROM bookings 
      WHERE provider_id = $1 
        AND status = 'completed' 
        AND booking_date >= CURRENT_DATE - INTERVAL '30 days'
    `, [params.providerId])

    client.release()

    const stats = statsResult.rows[0] || {
      pending_bookings: 0,
      completed_today: 0,
      total_jobs: 0,
      average_rating: 0,
      total_earnings: 0
    }

    const monthlyEarnings = monthlyResult.rows[0]?.monthly_earnings || 0

    return NextResponse.json({
      pendingBookings: parseInt(stats.pending_bookings) || 0,
      completedToday: parseInt(stats.completed_today) || 0,
      totalJobs: parseInt(stats.total_jobs) || 0,
      averageRating: parseFloat(stats.average_rating) || 0,
      totalEarnings: parseFloat(stats.total_earnings) || 0,
      monthlyEarnings: parseFloat(monthlyEarnings) || 0
    })
  } catch (error) {
    console.error('Error fetching provider stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch provider stats' },
      { status: 500 }
    )
  }
} 