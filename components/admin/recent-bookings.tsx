"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MoreHorizontal, Calendar, Check, X, Clock, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200"
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "confirmed":
      return "bg-purple-100 text-purple-800 border-purple-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200"
    case "assigned":
      return "bg-indigo-100 text-indigo-800 border-indigo-200"
    case "unassigned":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <Check className="h-3 w-3" />
    case "in_progress":
      return <Clock className="h-3 w-3" />
    case "confirmed":
      return <Check className="h-3 w-3" />
    case "pending":
      return <Clock className="h-3 w-3" />
    case "cancelled":
      return <X className="h-3 w-3" />
    case "assigned":
      return <Check className="h-3 w-3" />
    case "unassigned":
      return <AlertCircle className="h-3 w-3" />
    default:
      return <Clock className="h-3 w-3" />
  }
}

const providers = [
  { id: 1, name: "Juma Mwalimu" },
  { id: 2, name: "Amina Salehe" },
  { id: 3, name: "Hassan Mwangi" },
  { id: 4, name: "Grace Kimani" },
  { id: 5, name: "Mohamed Ali" },
  { id: 6, name: "Fatma Hassan" },
]

// Add this array for status options
const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "unassigned", label: "Unassigned" },
]

export function RecentBookings({ showAll = false }: { showAll?: boolean }) {
  const [allBookings, setAllBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    setLoading(true)
    fetch('/api/bookings')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        // Transform the data to match the expected format
        const transformedData = data.map((booking: any) => ({
          ...booking,
          serviceName: booking.service_name,
          providerName: booking.provider_name || 'Unassigned',
          scheduledDate: booking.booking_date ? new Date(booking.booking_date) : null,
          scheduledTime: booking.booking_time,
          servicePrice: booking.total_amount,
          customerName: booking.customer_name,
          quantity: booking.quantity || 1,
        }))
        setAllBookings(transformedData)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setAllBookings([])
      })
  }, [])
  
  const displayBookings = showAll ? allBookings : allBookings.slice(0, 5)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [selectedProvider, setSelectedProvider] = useState<string>("")

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: 'update_status',
          status: newStatus 
        }),
      })
      if (!res.ok) throw new Error("Failed to update status")
      setAllBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      )
      toast.success(`Status updated: Booking status changed to ${newStatus}`)
    } catch (err) {
      toast.error("Could not update status")
    }
  }

  const handleAssignProvider = () => {
    if (selectedBooking && selectedProvider) {
      const provider = providers.find((p) => p.id.toString() === selectedProvider)
      if (provider) {
        // ... existing code ...
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg mb-4 bg-white shadow-sm animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-1" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-1" />
              <div className="h-3 bg-gray-100 rounded w-1/4 mb-1" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-gray-200 rounded" />
              <div className="h-8 w-16 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (allBookings.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121] flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {showAll ? "All Bookings" : "Recent Bookings"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600">No bookings have been made yet.</p>
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
          {showAll ? "All Bookings" : "Recent Bookings"} ({allBookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                  <h4 className="font-medium text-[#212121] truncate">{booking.customerName}</h4>
                  <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1 px-2 py-1 text-xs font-medium`}>
                    {getStatusIcon(booking.status)}
                    {booking.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="line-clamp-1">
                    {booking.serviceName} {booking.quantity > 1 ? `(x${booking.quantity})` : ""}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span>
                      {booking.scheduledDate ? booking.scheduledDate.toLocaleDateString() : 'No date'} • {booking.providerName}
                    </span>
                    <span className="font-medium text-[#2E7D32]">TSh {booking.servicePrice?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/invoice/${booking.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Select value={booking.status} onValueChange={(value) => handleStatusChange(booking.id, value)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}