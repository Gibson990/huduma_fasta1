"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useAdminBookingsClient } from "@/lib/bookings-client"

export function RevenueChart() {
  const { getAllBookings } = useAdminBookingsClient()
  const allBookings = getAllBookings()

  // Generate data for the last 7 days
  const generateChartData = () => {
    const data = []
    const today = new Date()

    // Create an array of the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)

      // Format date as "Mon", "Tue", etc.
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

      // Calculate revenue for this day
      const dayRevenue = allBookings
        .filter((booking) => {
          const bookingDate = new Date(booking.booking_date)
          return (
            bookingDate.getDate() === date.getDate() &&
            bookingDate.getMonth() === date.getMonth() &&
            bookingDate.getFullYear() === date.getFullYear()
          )
        })
        .reduce((sum, booking) => sum + booking.total_amount, 0)

      data.push({
        name: dayName,
        revenue: dayRevenue,
      })
    }

    return data
  }

  const chartData = generateChartData()

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Revenue Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `TSh ${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`TSh ${value.toLocaleString()}`, "Revenue"]}
              labelFormatter={(label) => `Day: ${label}`}
            />
            <Line type="monotone" dataKey="revenue" stroke="#2E7D32" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
