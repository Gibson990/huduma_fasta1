import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // month, year, week
    const groupBy = searchParams.get('groupBy') || 'date' // date, provider, category

    let revenueQuery = ""
    let params: any[] = []

    switch (period) {
      case 'week':
        revenueQuery = `
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as bookings,
            COALESCE(SUM(total_amount), 0) as revenue
          FROM bookings 
          WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
            AND status = 'completed'
          GROUP BY DATE(created_at)
          ORDER BY date DESC
        `
        break
      
      case 'month':
        revenueQuery = `
          SELECT 
            DATE_TRUNC('day', created_at) as date,
            COUNT(*) as bookings,
            COALESCE(SUM(total_amount), 0) as revenue
          FROM bookings 
          WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
            AND status = 'completed'
          GROUP BY DATE_TRUNC('day', created_at)
          ORDER BY date DESC
        `
        break
      
      case 'year':
        revenueQuery = `
          SELECT 
            DATE_TRUNC('month', created_at) as date,
            COUNT(*) as bookings,
            COALESCE(SUM(total_amount), 0) as revenue
          FROM bookings 
          WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
            AND status = 'completed'
          GROUP BY DATE_TRUNC('month', created_at)
          ORDER BY date DESC
        `
        break
      
      default:
        revenueQuery = `
          SELECT 
            DATE_TRUNC('day', created_at) as date,
            COUNT(*) as bookings,
            COALESCE(SUM(total_amount), 0) as revenue
          FROM bookings 
          WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
            AND status = 'completed'
          GROUP BY DATE_TRUNC('day', created_at)
          ORDER BY date DESC
        `
    }

    const revenueResult = await query(revenueQuery, params)
    const revenueData = revenueResult.rows

    // Get revenue by provider
    const providerRevenueQuery = `
      SELECT 
        p.name as provider_name,
        COUNT(b.id) as bookings,
        COALESCE(SUM(b.total_amount), 0) as revenue,
        AVG(b.total_amount) as avg_booking_value
      FROM bookings b
      JOIN providers p ON b.provider_id = p.id
      WHERE b.status = 'completed'
        AND b.created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY p.id, p.name
      ORDER BY revenue DESC
      LIMIT 10
    `

    const providerRevenueResult = await query(providerRevenueQuery)
    const providerRevenue = providerRevenueResult.rows

    // Get revenue by service category
    const categoryRevenueQuery = `
      SELECT 
        c.name_en as category_name,
        COUNT(b.id) as bookings,
        COALESCE(SUM(b.total_amount), 0) as revenue,
        AVG(b.total_amount) as avg_booking_value
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN categories c ON s.category_id = c.id
      WHERE b.status = 'completed'
        AND b.created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY c.id, c.name_en
      ORDER BY revenue DESC
    `

    const categoryRevenueResult = await query(categoryRevenueQuery)
    const categoryRevenue = categoryRevenueResult.rows

    // Get summary statistics
    const summaryQuery = `
      SELECT 
        COUNT(*) as total_bookings,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        AVG(total_amount) as avg_booking_value,
        COUNT(DISTINCT customer_id) as unique_customers,
        COUNT(DISTINCT provider_id) as active_providers
      FROM bookings 
      WHERE status = 'completed'
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
    `

    const summaryResult = await query(summaryQuery)
    const summary = summaryResult.rows[0]

    // Get top performing providers
    const topProvidersQuery = `
      SELECT 
        p.name,
        p.rating,
        COUNT(b.id) as completed_jobs,
        COALESCE(SUM(b.total_amount), 0) as total_earnings
      FROM providers p
      LEFT JOIN bookings b ON p.id = b.provider_id AND b.status = 'completed'
      WHERE p.is_active = true
      GROUP BY p.id, p.name, p.rating
      ORDER BY total_earnings DESC
      LIMIT 5
    `

    const topProvidersResult = await query(topProvidersQuery)
    const topProviders = topProvidersResult.rows

    const analytics = {
      period,
      revenueData,
      providerRevenue,
      categoryRevenue,
      summary: {
        totalBookings: parseInt(summary.total_bookings) || 0,
        totalRevenue: parseFloat(summary.total_revenue) || 0,
        avgBookingValue: parseFloat(summary.avg_booking_value) || 0,
        uniqueCustomers: parseInt(summary.unique_customers) || 0,
        activeProviders: parseInt(summary.active_providers) || 0
      },
      topProviders
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Error fetching revenue analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch revenue analytics" },
      { status: 500 }
    )
  }
} 