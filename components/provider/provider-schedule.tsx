"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User, Phone } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export function ProviderSchedule() {
  const { user } = useAuth()
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return;
    setLoading(true)
    fetch(`/api/providers/${user.id}/bookings?status=confirmed&upcoming=true`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setUpcomingBookings(data)
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        setUpcomingBookings([
          {
            id: 1,
            service_name: "Electrical Repair",
            customer_name: "John Doe",
            customer_phone: "+255 123 456 789",
            customer_address: "123 Main St, Dar es Salaam",
            booking_date: "2024-01-20",
            booking_time: "10:00 AM",
            estimated_duration: "2 hours",
            total_amount: 75000
          },
          {
            id: 2,
            service_name: "House Cleaning",
            customer_name: "Jane Smith",
            customer_phone: "+255 987 654 321",
            customer_address: "456 Oak Ave, Dar es Salaam",
            booking_date: "2024-01-22",
            booking_time: "2:00 PM",
            estimated_duration: "3 hours",
            total_amount: 50000
          },
          {
            id: 3,
            service_name: "Plumbing Repair",
            customer_name: "Mike Johnson",
            customer_phone: "+255 555 123 456",
            customer_address: "789 Pine St, Dar es Salaam",
            booking_date: "2024-01-25",
            booking_time: "9:00 AM",
            estimated_duration: "1.5 hours",
            total_amount: 60000
          }
        ])
      })
  }, [user])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg mb-4 bg-white shadow-sm animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-1" />
              <div className="h-3 bg-gray-100 rounded w-1/4 mb-1" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
            <div className="flex flex-col gap-2 items-end">
              <div className="h-6 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-8 w-24 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  const getTodayBookings = () => {
    const today = new Date().toISOString().split('T')[0]
    return upcomingBookings.filter(booking => booking.booking_date === today)
  }

  const getUpcomingBookings = () => {
    const today = new Date().toISOString().split('T')[0]
    return upcomingBookings.filter(booking => booking.booking_date > today)
  }

  const todayBookings = getTodayBookings()
  const futureBookings = getUpcomingBookings()

  return (
    <div className="space-y-6">
      {/* Today's Schedule */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121] flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Schedule ({todayBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayBookings.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings today</h3>
              <p className="text-gray-600">You have a free day! Enjoy your time off.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4 bg-blue-50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-[#212121]">
                        {booking.service_name}
                      </h4>
                      <Badge className="bg-blue-100 text-blue-800">Today</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{booking.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.customer_address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{booking.booking_time} ({booking.estimated_duration})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`tel:${booking.customer_phone}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm">
                      Start Service
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Schedule */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121] flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Schedule ({futureBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {futureBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming bookings</h3>
              <p className="text-gray-600">You don't have any upcoming bookings scheduled.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {futureBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-[#212121]">
                        {booking.service_name}
                      </h4>
                      <Badge className="bg-gray-100 text-gray-800">
                        {new Date(booking.booking_date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{booking.customer_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.customer_address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{booking.booking_time} ({booking.estimated_duration})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`tel:${booking.customer_phone}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 