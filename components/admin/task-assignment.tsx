"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserCheck, Clock, MapPin, Loader2, UserPlus } from "lucide-react"
import { useAdminBookingsClient } from "@/lib/bookings-client"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Helper function to determine urgency based on date
const determineUrgency = (date: Date): string => {
  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 1) return "high"
  if (diffDays <= 3) return "medium"
  return "low"
}

// Helper function to get providers by service category
const getProvidersByCategory = (category: string, providersList: any[]) => {
  return providersList.filter((provider) => 
    provider.specialization?.toLowerCase().includes(category.toLowerCase()) || 
    category.toLowerCase().includes(provider.specialization?.toLowerCase() || '')
  )
}

export function TaskAssignment() {
  const { getAllBookings } = useAdminBookingsClient()

  const [unassignedBookings, setUnassignedBookings] = useState<any[]>([])
  const [providers, setProviders] = useState<any[]>([])
  const [pendingBookings, setPendingBookings] = useState<any[]>([])
  const [filteredProviders, setFilteredProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [providersLoaded, setProvidersLoaded] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [selectedProvider, setSelectedProvider] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch unassigned bookings on mount
  useEffect(() => {
    setLoading(true)
    fetch("/api/admin/unassigned-bookings")
      .then((res) => res.json())
      .then((data) => {
        setUnassignedBookings(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setUnassignedBookings([])
      })
  }, [])

  // Memoized providers to prevent unnecessary re-renders
  const activeProviders = useMemo(() => 
    providers.filter((p: any) => p.is_active), 
    [providers]
  )

  // Fetch providers only once
  useEffect(() => {
    const fetchProviders = async () => {
      if (providersLoaded) return
      
      try {
        const providersResponse = await fetch('/api/providers')
        const providersData = await providersResponse.json()
        setProviders(providersData)
        setProvidersLoaded(true)
      } catch (error) {
        console.error('Error fetching providers:', error)
        toast.error('Failed to load providers')
      }
    }

    fetchProviders()
  }, [providersLoaded])

  // Fetch pending bookings when providers are loaded
  useEffect(() => {
    if (!providersLoaded) return

    const fetchPendingBookings = () => {
      try {
        setLoading(true)
        
        // Get pending bookings that need manual assignment
        const allBookings = getAllBookings()
        const pending = allBookings
          .filter((booking) => booking.status === "pending" && !booking.provider_id)
          .map((booking) => ({
            ...booking,
            urgency: determineUrgency(new Date(booking.booking_date)),
            category: getCategoryFromServiceName(booking.service_name),
          }))
          .sort((a, b) => {
            // Sort by urgency first (high > medium > low)
            const urgencyOrder = { high: 0, medium: 1, low: 2 }
            const urgencyDiff =
              urgencyOrder[a.urgency as keyof typeof urgencyOrder] - urgencyOrder[b.urgency as keyof typeof urgencyOrder]
            if (urgencyDiff !== 0) return urgencyDiff

            // Then sort by date
            return new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime()
          })

        setPendingBookings(pending)
      } catch (error) {
        console.error('Error processing bookings:', error)
        toast.error('Failed to load pending bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchPendingBookings()
  }, [providersLoaded]) // Removed getAllBookings dependency

  // Helper function to extract category from service name
  function getCategoryFromServiceName(serviceName: string): string {
    // Map of service names to categories
    const serviceCategories: Record<string, string> = {
      "Electrical Wiring": "Electrical Services",
      "Light Installation": "Electrical Services",
      "Pipe Repair": "Plumbing Services",
      "House Cleaning": "Cleaning Services",
      "Furniture Assembly": "Carpentry",
      "Interior Painting": "Painting",
    }

    return serviceCategories[serviceName] || "Other Services"
  }

  const handleAssignProvider = useCallback(async () => {
    if (selectedBooking && selectedProvider) {
      const provider = activeProviders.find((p) => p.id.toString() === selectedProvider)
      if (provider) {
        try {
          setAssigning(true)
          const response = await fetch(`/api/bookings/${selectedBooking.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'assign_provider',
              provider_id: provider.id,
              status: "confirmed",
            }),
          })

          if (response.ok) {
            toast.success(`Provider Assigned: ${provider.name} has been assigned to booking #${selectedBooking.id}`)

            // Update the local state to remove the assigned booking
            setPendingBookings((prev) => prev.filter((booking) => booking.id !== selectedBooking.id))

            // Close dialog and reset selection
            setIsDialogOpen(false)
            setSelectedBooking(null)
            setSelectedProvider("")
          } else {
            const error = await response.json()
            toast.error(error.error || "Failed to assign provider")
          }
        } catch (error) {
          toast.error("Error assigning provider")
        } finally {
          setAssigning(false)
        }
      }
    }
  }, [selectedBooking, selectedProvider, activeProviders])

  const openAssignDialog = useCallback((booking: any) => {
    setSelectedBooking(booking)
    setSelectedProvider("")

    // Filter providers by service category
    const matchingProviders = getProvidersByCategory(booking.category, activeProviders)
    setFilteredProviders(matchingProviders)

    setIsDialogOpen(true)
  }, [activeProviders])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-96" />
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg bg-white shadow-sm animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-4">
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
      </div>
    )
  }

  if (pendingBookings.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121] flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Task Assignment / Mgao wa Kazi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <UserCheck className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending tasks</h3>
            <p className="text-gray-600">
              {activeProviders.length === 0 
                ? "No providers available. Please add providers first."
                : "All bookings have been automatically assigned to providers."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-[#212121] flex items-center">
          <UserCheck className="h-5 w-5 mr-2" />
          Task Assignment / Mgao wa Kazi ({pendingBookings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingBookings.map((booking) => (
            <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-[#212121] truncate">{booking.customer_name}</h4>
                    <Badge className={`${getUrgencyColor(booking.urgency)} text-xs px-2 py-1`}>
                      {booking.urgency} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {booking.service_name}
                    <span className="text-xs text-gray-500 ml-2">({booking.category})</span>
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                    <div className="flex items-center min-w-0">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{booking.address}</span>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 ml-4">
                  <div className="text-right">
                    <div className="font-medium text-[#2E7D32]">TSh {booking.total_amount.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">ID: {booking.id}</div>
                  </div>
                  
                  <Button 
                    onClick={() => openAssignDialog(booking)} 
                    size="sm"
                    className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-3 py-1 h-8 text-xs"
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Assign
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Service Provider</DialogTitle>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Booking ID: {selectedBooking.id}</Label>
                  <p className="text-sm text-gray-500">Service: {selectedBooking.service_name}</p>
                  <p className="text-sm text-gray-500">Category: {selectedBooking.category}</p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(selectedBooking.booking_date).toLocaleDateString()} at {selectedBooking.booking_time}
                  </p>
                  <p className="text-sm text-gray-500">Customer: {selectedBooking.customer_name}</p>
                  <p className="text-sm text-gray-500">Address: {selectedBooking.address}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provider">Select Provider for {selectedBooking.category}</Label>
                  {filteredProviders.length > 0 ? (
                    <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredProviders.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id.toString()}>
                            {provider.name} - {provider.specialization} ({provider.location}) - Rating: {provider.rating || 'N/A'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="text-sm text-red-500">
                      No providers available for {selectedBooking.category}. Please add providers first.
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleAssignProvider}
                  className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]"
                  disabled={!selectedProvider || filteredProviders.length === 0 || assigning}
                >
                  {assigning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    "Assign Provider"
                  )}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
