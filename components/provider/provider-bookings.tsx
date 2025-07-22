"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Eye, Calendar, Clock, User, MapPin, Phone, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/hooks/use-toast"

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

export function ProviderBookings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [bookings, setBookings] = useState<any[]>([])
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [statusNotes, setStatusNotes] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return;
    setIsLoading(true)
    fetch(`/api/providers/${user.id}/bookings`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setBookings(data)
        setIsLoading(false)
      })
      .catch(error => {
        setIsLoading(false)
        setBookings([
          {
            id: 1,
            service_name: "Electrical Repair",
            customer_name: "John Doe",
            customer_email: "john@example.com",
            customer_phone: "+255 123 456 789",
            customer_address: "123 Main St, Dar es Salaam",
            booking_date: "2024-01-20",
            booking_time: "10:00 AM",
            status: "confirmed",
            total_amount: 75000,
            quantity: 1,
            notes: "Circuit breaker needs replacement"
          },
          {
            id: 2,
            service_name: "House Cleaning",
            customer_name: "Jane Smith",
            customer_email: "jane@example.com",
            customer_phone: "+255 987 654 321",
            customer_address: "456 Oak Ave, Dar es Salaam",
            booking_date: "2024-01-22",
            booking_time: "2:00 PM",
            status: "pending",
            total_amount: 50000,
            quantity: 1,
            notes: "Deep cleaning required"
          }
        ])
      })
  }, [user])

  const updateBookingStatus = async () => {
    if (!selectedBooking || !newStatus) return;

    try {
      const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          provider_notes: statusNotes
        })
      })

      if (response.ok) {
        toast({
          title: "Status Updated!",
          description: `Booking status updated to ${newStatus}`,
          variant: "success",
        })
        
        // Update local state
        setBookings(prev => prev.map(b =>
          b.id === selectedBooking.id
            ? { ...b, status: newStatus }
            : b
        ))
        
        setIsStatusDialogOpen(false)
        setSelectedBooking(null)
        setNewStatus("")
        setStatusNotes("")
      } else {
        toast({
          title: "Error",
          description: "Failed to update booking status.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive",
      })
    }
  }

  const openStatusDialog = (booking: any) => {
    setSelectedBooking(booking)
    setNewStatus(booking.status)
    setStatusNotes("")
    setIsStatusDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
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

  if (bookings.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121] flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600">You haven't received any booking requests yet.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#212121] flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          My Bookings ({bookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-4 border rounded-lg mb-4 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-[#212121] text-lg">{booking.service_name}</span>
                  <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                </div>
                <div className="text-sm text-gray-600 mb-1">{booking.booking_date} at {booking.booking_time}</div>
                <div className="text-sm text-gray-600 mb-1">Location: {booking.customer_address || booking.address}</div>
                <div className="text-sm text-gray-600 mb-1">Customer: {booking.customer_name} ({booking.customer_phone})</div>
                <div className="text-xs text-gray-500">{booking.customer_email}</div>
                <div className="text-xs text-gray-500">Notes: {booking.notes}</div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className="font-bold text-[#2E7D32] text-lg">TSh {booking.total_amount?.toLocaleString()}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openStatusDialog(booking)}
                  className="mt-2"
                >
                  Update Status
                </Button>
              </div>
            </div>
          ))}
        </div>
        {/* Status Update Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Booking Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Add any notes about this status update..."
                  rows={3}
                />
              </div>
              <Button onClick={updateBookingStatus} className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]">
                Update Status
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
} 