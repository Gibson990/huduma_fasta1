"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, MapPin, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

interface BookingSuccessProps {
  bookingId?: string
  serviceName?: string
  date?: string
  time?: string
  address?: string
  amount?: number
}

export function BookingSuccess({ 
  bookingId, 
  serviceName, 
  date, 
  time, 
  address, 
  amount 
}: BookingSuccessProps) {
  return (
    <Card className="border-0 shadow-sm max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-600">
          Booking Successful!
        </CardTitle>
        <p className="text-gray-600">
          Your service has been booked successfully. We'll send you a confirmation email shortly.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Booking Details */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-900">Booking Details</h3>
          {bookingId && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-medium">#{bookingId}</span>
            </div>
          )}
          {serviceName && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium">{serviceName}</span>
            </div>
          )}
          {date && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Date:
              </span>
              <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
            </div>
          )}
          {time && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Time:
              </span>
              <span className="font-medium">{time}</span>
            </div>
          )}
          {address && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Address:
              </span>
              <span className="font-medium text-right max-w-xs">{address}</span>
            </div>
          )}
          {amount && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-green-600">TSh {amount.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You'll receive a confirmation email with booking details</li>
            <li>• Our team will review your booking and assign a provider</li>
            <li>• The provider will contact you to confirm the appointment</li>
            <li>• You can track your booking status in your dashboard</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
            <Link href="/dashboard">
              <ArrowRight className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href="/services">
              Book Another Service
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 