import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Get total bookings
    const totalBookingsResult = await query("SELECT COUNT(*) as total FROM bookings")
    const totalBookings = parseInt(totalBookingsResult.rows[0].total)

    // Get total revenue
    const totalRevenueResult = await query("SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status = 'completed'")
    const totalRevenue = parseFloat(totalRevenueResult.rows[0].total)

    // Get pending bookings
    const pendingBookingsResult = await query("SELECT COUNT(*) as total FROM bookings WHERE status = 'pending'")
    const pendingBookings = parseInt(pendingBookingsResult.rows[0].total)

    // Get active providers
    const activeProvidersResult = await query("SELECT COUNT(*) as total FROM providers WHERE is_active = true")
    const activeProviders = parseInt(activeProvidersResult.rows[0].total)

    // Get total users
    const totalUsersResult = await query("SELECT COUNT(*) as total FROM users WHERE role = 'customer'")
    const totalUsers = parseInt(totalUsersResult.rows[0].total)

    // Get today's bookings
    const todayBookingsResult = await query(`
      SELECT COUNT(*) as total 
      FROM bookings 
      WHERE DATE(created_at) = CURRENT_DATE
    `)
    const todayBookings = parseInt(todayBookingsResult.rows[0].total)

    // Get today's revenue
    const todayRevenueResult = await query(`
      SELECT COALESCE(SUM(total_amount), 0) as total 
      FROM bookings 
      WHERE DATE(created_at) = CURRENT_DATE AND status = 'completed'
    `)
    const todayRevenue = parseFloat(todayRevenueResult.rows[0].total)

    // Get bookings by status
    const statusBreakdownResult = await query(`
      SELECT status, COUNT(*) as count 
      FROM bookings 
      GROUP BY status
    `)
    const statusBreakdown = statusBreakdownResult.rows.reduce((acc: any, row) => {
      acc[row.status] = parseInt(row.count)
      return acc
    }, {})

    // Get recent activity (last 7 days)
    const recentActivityResult = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as bookings,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END), 0) as revenue
      FROM bookings 
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `)
    const recentActivity = recentActivityResult.rows

    const stats = {
      totalBookings,
      totalRevenue,
      pendingBookings,
      activeProviders,
      totalUsers,
      todayBookings,
      todayRevenue,
      statusBreakdown,
      recentActivity
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 }
    )
  }
} 