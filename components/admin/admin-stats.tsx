"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, DollarSign, UserCheck, Clock, TrendingUp } from "lucide-react"
import { useAdminStats } from "@/lib/admin-stats-client"
import { Skeleton } from "@/components/ui/skeleton"

export function AdminStats() {
  const { stats, loading, error } = useAdminStats()

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error loading stats</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      description: "All time bookings",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Revenue",
      value: `TSh ${stats.totalRevenue.toLocaleString()}`,
      description: "All time revenue",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Tasks",
      value: stats.pendingBookings.toString(),
      description: "Awaiting assignment",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Active Providers",
      value: stats.activeProviders.toString(),
      description: "Available providers",
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      description: "Registered customers",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Today's Bookings",
      value: stats.todayBookings.toString(),
      description: "New bookings today",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statCards.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212121]">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            
            {/* Show status breakdown for bookings */}
            {stat.title === "Total Bookings" && stats.statusBreakdown && (
              <div className="mt-3 space-y-1">
                {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between text-xs">
                    <Badge variant="outline" className="text-xs capitalize">
                      {status.replace('_', ' ')}
                    </Badge>
                    <span className="text-gray-600">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
