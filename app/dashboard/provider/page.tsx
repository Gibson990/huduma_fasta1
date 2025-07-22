"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Calendar, Clock, DollarSign, User, TrendingUp, Star, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { NotificationBell } from "@/components/notification-bell"
import { ProviderStats } from "@/components/provider/provider-stats"
import { ProviderBookings } from "@/components/provider/provider-bookings"
import { ProviderSchedule } from "@/components/provider/provider-schedule"
import { ProviderEarnings } from "@/components/provider/provider-earnings"
import { ProviderProfile } from "@/components/provider/provider-profile"
import { DashboardNav } from "@/components/dashboard-nav"
import { ChatSupport } from "@/components/chat-support"
import { ProviderServiceManagement } from "@/components/provider/provider-management"
import { ProviderReviews } from "@/components/provider/provider-reviews"
import { ProviderMessages } from "@/components/provider/provider-messages"

export default function ProviderDashboardPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [providerStatus, setProviderStatus] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'provider')) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && user.role === 'provider') {
      fetchProviderStatus()
    }
  }, [user])

  const fetchProviderStatus = async () => {
    // Fetch provider status from API
    const res = await fetch(`/api/users/${user.id}`)
    if (res.ok) {
      setProviderStatus(await res.json())
    }
  }

  const handleContractUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    setUploadError("")
    const file = fileInputRef.current?.files?.[0]
    if (!file) {
      setUploadError("Please select a PDF file.")
      setUploading(false)
      return
    }
    const formData = new FormData()
    formData.append("signedContract", file)
    const res = await fetch(`/api/users/${user.id}/upload-contract`, {
      method: "POST",
      body: formData,
    })
    if (res.ok) {
      await fetchProviderStatus()
    } else {
      setUploadError("Failed to upload contract. Please try again.")
    }
    setUploading(false)
  }

  if (isLoading || !providerStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Access control logic
  const isVerified = providerStatus.kyc_status === 'verified' && providerStatus.contract_status === 'verified' && providerStatus.is_active
  const contractNeedsUpload = providerStatus.contract_status === 'pending' || providerStatus.contract_status === 'rejected'
  const underReview = providerStatus.contract_status === 'uploaded' || providerStatus.kyc_status === 'pending'
  const rejected = providerStatus.contract_status === 'rejected' || providerStatus.kyc_status === 'rejected'

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#212121] mb-2">Provider Dashboard</h1>
            <p className="text-gray-600 text-sm md:text-base">Manage your bookings and profile</p>
        </div>
        {/* Verification Banner */}
        {!isVerified && (
          <div className="mb-6 p-4 rounded bg-yellow-50 border border-yellow-200 text-yellow-800">
            {contractNeedsUpload && (
              <>
                <b>Action Required:</b> Please upload your signed contract to complete verification.
                <form onSubmit={handleContractUpload} className="mt-4 flex flex-col md:flex-row gap-2 items-start md:items-center">
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    className="border rounded px-2 py-1"
                    required
                  />
                  <Button type="submit" disabled={uploading} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
                    {uploading ? "Uploading..." : "Upload Signed Contract"}
                  </Button>
                  {uploadError && <span className="text-red-600 text-sm ml-2">{uploadError}</span>}
                </form>
              </>
            )}
            {underReview && !contractNeedsUpload && (
              <span>Your contract is under review. You will be notified once approved.</span>
            )}
            {rejected && (
              <span>Your contract or KYC was rejected. Please contact support or re-upload your documents.</span>
            )}
          </div>
        )}
        {isVerified && (
          <div className="mb-6 flex items-center gap-2">
            <Badge className="bg-[#2E7D32] text-white">Verified Provider</Badge>
          </div>
        )}
        {/* Block dashboard features if not verified */}
        {isVerified ? (
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8 h-auto p-1">
          <TabsTrigger value="overview" className="flex flex-col gap-1 p-2 md:p-3">
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-xs">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex flex-col gap-1 p-2 md:p-3">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Bookings</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex flex-col gap-1 p-2 md:p-3">
            <Clock className="h-4 w-4" />
            <span className="text-xs">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="earnings" className="flex flex-col gap-1 p-2 md:p-3">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs">Earnings</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex flex-col gap-1 p-2 md:p-3">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">Services</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex flex-col gap-1 p-2 md:p-3">
            <Star className="h-4 w-4" />
            <span className="text-xs">Reviews</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex flex-col gap-1 p-2 md:p-3">
            <Mail className="h-4 w-4" />
            <span className="text-xs">Messages</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex flex-col gap-1 p-2 md:p-3">
            <User className="h-4 w-4" />
            <span className="text-xs">Profile</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <ProviderStats />
          <div className="grid lg:grid-cols-2 gap-6">
            <ProviderSchedule />
            <ProviderBookings />
          </div>
        </TabsContent>
        <TabsContent value="bookings">
          <ProviderBookings />
        </TabsContent>
        <TabsContent value="schedule">
          <ProviderSchedule />
        </TabsContent>
        <TabsContent value="earnings">
          <ProviderEarnings />
        </TabsContent>
        <TabsContent value="services">
          <ProviderServiceManagement />
        </TabsContent>
        <TabsContent value="reviews">
          <ProviderReviews />
        </TabsContent>
        <TabsContent value="messages">
          <ProviderMessages />
        </TabsContent>
        <TabsContent value="profile">
          <ProviderProfile />
        </TabsContent>
      </Tabs>
        ) : null}
      </div>
      <ChatSupport />
    </div>
  )
} 