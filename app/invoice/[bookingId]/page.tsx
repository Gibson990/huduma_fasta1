"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Calendar, MapPin, Clock, User, Phone, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

interface Booking {
  id: number
  service_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  booking_date: string
  booking_time: string
  total_amount: number
  status: string
  created_at: string
  notes?: string
}

export default function InvoicePage({ params }: { params: Promise<{ bookingId: string }> }) {
  const { user } = useAuth()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Unwrap the params Promise using React.use()
  const { bookingId } = use(params)

  useEffect(() => {
    if (!user) return

    fetch(`/api/bookings?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        const foundBooking = data.find((b: Booking) => b.id.toString() === bookingId)
        setBooking(foundBooking || null)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching booking:', error)
        setLoading(false)
      })
  }, [user, bookingId])

  const downloadInvoice = () => {
    // Generate PDF invoice logic here
    alert('Invoice download feature coming soon!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/dashboard/user">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard/user">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
          </div>
          <Button onClick={downloadInvoice} className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Invoice Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Huduma Faster
                </CardTitle>
                <p className="text-gray-600">Service Booking Invoice</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Invoice #</div>
                <div className="text-lg font-bold">{booking.id}</div>
                <Badge className={`mt-2 ${getStatusColor(booking.status)}`}>
                  {booking.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Name:</span> {booking.customer_name}
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {booking.customer_email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {booking.customer_phone}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {booking.address}
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Service Details</h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Service:</span> {booking.service_name}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    {booking.booking_time}
                  </div>
                  {booking.notes && (
                    <div>
                      <span className="font-medium">Notes:</span> {booking.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Total Amount</h3>
                  <p className="text-gray-600">Including all applicable taxes</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    TSh {booking.total_amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Created on {new Date(booking.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Terms & Conditions</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Payment is due upon service completion</li>
                <li>• Cancellation policy: 24 hours notice required</li>
                <li>• Service provider will contact you to confirm appointment</li>
                <li>• Please ensure someone is available at the service address</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 