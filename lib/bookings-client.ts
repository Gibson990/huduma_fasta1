import { useState, useEffect } from "react"

export interface Booking {
  id: number
  service_id: number
  service_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  address: string
  booking_date: Date
  booking_time: string
  total_amount: number
  status: string
  created_at: Date
  provider_id?: number
  provider_name?: string
}

// Client-side only hook for admin components (no database imports)
export function useAdminBookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/bookings")
        if (!res.ok) throw new Error("Failed to fetch bookings")
        const data = await res.json()
        // Convert date strings to Date objects
        setBookings(data.map((booking: any) => ({
          id: Number(booking.id),
          service_id: Number(booking.service_id),
          service_name: booking.service_name,
          customer_name: booking.customer_name,
          customer_email: booking.customer_email,
          customer_phone: booking.customer_phone,
          address: booking.address,
          booking_date: new Date(booking.booking_date),
          booking_time: booking.booking_time,
          total_amount: Number(booking.total_amount),
          status: booking.status,
          created_at: new Date(booking.created_at),
          provider_id: booking.provider_id ? Number(booking.provider_id) : undefined,
          provider_name: booking.provider_name
        })))
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const getTotalRevenue = () =>
    bookings.filter((b) => b.status === "completed").reduce((sum, b) => sum + b.total_amount, 0)
  const getPendingBookingsCount = () => bookings.filter((b) => b.status === "pending").length
  const getCompletedBookingsCount = () => bookings.filter((b) => b.status === "completed").length
  const getAllBookings = () => bookings

  return {
    bookings,
    loading,
    error,
    getTotalRevenue,
    getPendingBookingsCount,
    getCompletedBookingsCount,
    getAllBookings,
  }
} 