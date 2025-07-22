"use client"

import { useState, useEffect } from 'react'

export interface AdminStats {
  totalBookings: number
  totalRevenue: number
  pendingBookings: number
  activeProviders: number
  totalUsers: number
  todayBookings: number
  todayRevenue: number
  statusBreakdown: Record<string, number>
  recentActivity: Array<{
    date: string
    bookings: number
    revenue: number
  }>
}

export interface RevenueAnalytics {
  period: string
  revenueData: Array<{
    date: string
    bookings: number
    revenue: number
  }>
  providerRevenue: Array<{
    provider_name: string
    bookings: number
    revenue: number
    avg_booking_value: number
  }>
  categoryRevenue: Array<{
    category_name: string
    bookings: number
    revenue: number
    avg_booking_value: number
  }>
  summary: {
    totalBookings: number
    totalRevenue: number
    avgBookingValue: number
    uniqueCustomers: number
    activeProviders: number
  }
  topProviders: Array<{
    name: string
    rating: number
    completed_jobs: number
    total_earnings: number
  }>
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/stats')
      if (!response.ok) {
        throw new Error('Failed to fetch admin stats')
      }
      
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

export function useRevenueAnalytics(period: string = 'month') {
  const [analytics, setAnalytics] = useState<RevenueAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/revenue?period=${period}`)
      if (!response.ok) {
        throw new Error('Failed to fetch revenue analytics')
      }
      
      const data = await response.json()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  }
}

export function useProviderAssignment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const assignProvider = async (bookingId: string, providerId: string, adminId: string, notes?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/bookings/${bookingId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId,
          adminId,
          notes
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to assign provider')
      }
      
      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const reassignProvider = async (bookingId: string, providerId: string, adminId: string, notes?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/bookings/${bookingId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId,
          adminId,
          notes
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to reassign provider')
      }
      
      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeAssignment = async (bookingId: string, adminId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/bookings/${bookingId}/assign`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove assignment')
      }
      
      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    assignProvider,
    reassignProvider,
    removeAssignment,
    loading,
    error
  }
} 