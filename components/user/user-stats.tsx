import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"

const stats = [
  {
    title: "Total Bookings",
    value: "12",
    icon: Calendar,
    color: "text-[#2E7D32]",
  },
  {
    title: "Pending Services",
    value: "2",
    icon: Clock,
    color: "text-orange-600",
  },
  {
    title: "Completed Services",
    value: "8",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Average Rating Given",
    value: "4.6",
    icon: Star,
    color: "text-yellow-600",
  },
]

export function UserStats() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userStats, setUserStats] = useState(stats)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    // Fetch user stats from API
    fetch(`/api/bookings?userId=${user.id}`)
      .then(res => res.ok ? res.json() : [])
      .then(bookings => {
        const totalBookings = bookings.length
        const pendingBookings = bookings.filter((b: any) => b.status === 'pending').length
        const completedBookings = bookings.filter((b: any) => b.status === 'completed').length
        
        setUserStats([
          {
            title: "Total Bookings",
            value: totalBookings.toString(),
            icon: Calendar,
            color: "text-[#2E7D32]",
          },
          {
            title: "Pending Services",
            value: pendingBookings.toString(),
            icon: Clock,
            color: "text-orange-600",
          },
          {
            title: "Completed Services",
            value: completedBookings.toString(),
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            title: "Average Rating Given",
            value: "4.6", // This would need to be calculated from reviews
            icon: Star,
            color: "text-yellow-600",
          },
        ])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [user])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 w-4 bg-gray-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {userStats.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <Card key={index} className="border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <IconComponent className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#212121]">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 