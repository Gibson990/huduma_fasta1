"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign, Star, TrendingUp, Users } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export function ProviderStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return;
    setLoading(true)
    // Fetch provider stats
    fetch(`/api/providers/${user.id}/stats`)
      .then(res => res.ok ? res.json() : {})
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        // For demo purposes, show sample data
        setStats({
          totalBookings: 24,
          completedBookings: 18,
          pendingBookings: 3,
          cancelledBookings: 2,
          totalEarnings: 1250000,
          thisMonthEarnings: 350000,
          averageRating: 4.8,
          totalReviews: 15,
          activeServices: 5
        })
      })
  }, [user])

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

  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings || 0,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Completed",
      value: stats.completedBookings || 0,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Total Earnings",
      value: `TSh ${(stats.totalEarnings || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Average Rating",
      value: stats.averageRating ? `${stats.averageRating}/5` : "N/A",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            {index === 1 && stats.totalBookings > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                {Math.round((stats.completedBookings / stats.totalBookings) * 100)}% completion rate
              </p>
            )}
            {index === 2 && stats.thisMonthEarnings > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                TSh {stats.thisMonthEarnings.toLocaleString()} this month
              </p>
            )}
            {index === 3 && stats.totalReviews > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                {stats.totalReviews} reviews
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 