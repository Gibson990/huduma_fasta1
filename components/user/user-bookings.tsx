"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Eye, 
  Star, 
  Download, 
  Calendar, 
  Search, 
  Filter,
  MessageSquare,
  AlertTriangle,
  Loader2
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import Link from "next/link"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

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
  provider_id?: number
  provider_name?: string
  has_review?: boolean
}

interface Review {
  rating: number
  comment: string
}

interface Report {
  reason: string
  description: string
}

export function UserBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [review, setReview] = useState<Review>({ rating: 5, comment: "" })
  const [report, setReport] = useState<Report>({ reason: "", description: "" })
  const [submitting, setSubmitting] = useState(false)

  const itemsPerPage = 10

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, statusFilter])

  const fetchBookings = async (page = 1) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/bookings?userId=${user?.id}&page=${page}&limit=${itemsPerPage}`)
      const data = await response.json()
      
      if (response.ok) {
        if (page === 1) {
          setBookings(data)
        } else {
          setBookings(prev => [...prev, ...data])
        }
        setHasMore(data.length === itemsPerPage)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  // Show shimmer loading while fetching initial data
  if (loading && bookings.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="h-10 bg-gray-200 rounded w-full" />
                </div>
              </div>
              <div className="h-10 w-48 bg-gray-200 rounded" />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 border rounded-lg bg-white shadow-sm animate-pulse">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-1" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-1" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-1" />
                  <div className="h-3 bg-gray-100 rounded w-1/4 mb-1" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded" />
                  <div className="h-8 w-8 bg-gray-200 rounded" />
                  <div className="h-8 w-8 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const filterBookings = () => {
    let filtered = bookings

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.booking_date.includes(searchTerm)
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchBookings(currentPage + 1)
    }
  }

  const handleReviewSubmit = async () => {
    if (!selectedBooking) return

    try {
      setSubmitting(true)
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          providerId: selectedBooking.provider_id,
          rating: review.rating,
          reviewText: review.comment,
          userId: user?.id
        })
      })

      if (response.ok) {
        toast.success('Review submitted successfully')
        setShowReviewDialog(false)
        setReview({ rating: 5, comment: "" })
        setSelectedBooking(null)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit review')
      }
    } catch (error) {
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReportSubmit = async () => {
    if (!selectedBooking) return

    try {
      setSubmitting(true)
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType: 'booking',
          targetId: selectedBooking.id.toString(),
          targetName: selectedBooking.service_name,
          reason: report.reason,
          description: report.description,
          reporterId: user?.id,
          reporterName: user?.name
        })
      })

      if (response.ok) {
        toast.success('Report submitted successfully')
        setShowReportDialog(false)
        setReport({ reason: "", description: "" })
        setSelectedBooking(null)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit report')
      }
    } catch (error) {
      toast.error('Failed to submit report')
    } finally {
      setSubmitting(false)
    }
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

  const canReview = (booking: Booking) => {
    return booking.status === 'completed' && !booking.has_review
  }

  const canReport = (booking: Booking) => {
    return ['pending', 'confirmed', 'in_progress', 'completed'].includes(booking.status)
  }

    return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
        <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.service_name}
                    </h3>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status.replace("_", " ")}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Time:</span>
                      {booking.booking_time}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Amount:</span>
                      TSh {booking.total_amount.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Provider:</span>
                      {booking.provider_name || 'Not assigned'}
                </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <strong>Notes:</strong> {booking.notes}
                    </div>
                  )}
                </div>

                {/* Icon-only actions with tooltips */}
                <div className="flex flex-row gap-2 items-center justify-end min-w-[120px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button asChild variant="ghost" size="icon">
                  <Link href={`/invoice/${booking.id}`}>
                            <Eye className="h-5 w-5" />
                  </Link>
                </Button>
                      </TooltipTrigger>
                      <TooltipContent>View Invoice</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/invoice/${booking.id}`} download>
                            <Download className="h-5 w-5" />
                          </Link>
                </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download Invoice</TooltipContent>
                    </Tooltip>
                    {canReview(booking) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowReviewDialog(true)
                            }}
                          >
                            <Star className="h-5 w-5" />
                  </Button>
                        </TooltipTrigger>
                        <TooltipContent>Rate/Review</TooltipContent>
                      </Tooltip>
                    )}
                    {canReport(booking) && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowReportDialog(true)
                            }}
                          >
                            <AlertTriangle className="h-5 w-5" />
                    </Button>
                        </TooltipTrigger>
                        <TooltipContent>Report</TooltipContent>
                      </Tooltip>
                    )}
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {!loading && filteredBookings.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="text-center py-8">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters"
                  : "You haven't made any bookings yet"
                }
              </p>
              {!searchTerm && statusFilter === "all" && (
                <Button asChild className="bg-[#2E7D32] hover:bg-[#1B5E20]">
                  <Link href="/services">Book a Service</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {hasMore && !loading && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Load More
            </Button>
            </div>
        )}
        </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
          <DialogContent>
            <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Rating</Label>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReview(prev => ({ ...prev, rating: star }))}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {review.rating} star{review.rating !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            <div>
              <Label>Comment</Label>
              <Textarea
                value={review.comment}
                onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="Share your experience..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleReviewSubmit}
                disabled={submitting || !review.comment.trim()}
                className="bg-[#2E7D32] hover:bg-[#1B5E20]"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Submit Review
              </Button>
                </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Report Dialog */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Issue</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Reason</Label>
              <Select value={report.reason} onValueChange={(value) => setReport(prev => ({ ...prev, reason: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="poor_service">Poor Service Quality</SelectItem>
                  <SelectItem value="no_show">Provider No Show</SelectItem>
                  <SelectItem value="late_arrival">Late Arrival</SelectItem>
                  <SelectItem value="incomplete_work">Incomplete Work</SelectItem>
                  <SelectItem value="damage">Property Damage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              </div>
              <div>
              <Label>Description</Label>
                <Textarea
                value={report.description}
                onChange={(e) => setReport(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Please describe the issue..."
                rows={4}
                />
              </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReportDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleReportSubmit}
                disabled={submitting || !report.reason || !report.description.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Submit Report
              </Button>
            </div>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  )
} 