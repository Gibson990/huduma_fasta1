"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Calendar, Clock, DollarSign, User, TrendingUp } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { DashboardNav } from "@/components/dashboard-nav"

export default function ProviderDashboardSimplePage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'provider' && user.role !== 'service_provider'))) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || (user.role !== 'provider' && user.role !== 'service_provider')) {
    return null
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#212121]">24</div>
                  <p className="text-xs text-gray-600 mt-1">All time bookings</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
                  <Clock className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#212121]">18</div>
                  <p className="text-xs text-gray-600 mt-1">75% completion rate</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#212121]">TSh 1,250,000</div>
                  <p className="text-xs text-gray-600 mt-1">TSh 350,000 this month</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Rating</CardTitle>
                  <User className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#212121]">4.8/5</div>
                  <p className="text-xs text-gray-600 mt-1">15 reviews</p>
                </CardContent>
              </Card>
            </div>
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Electrical Repair</h4>
                      <p className="text-sm text-gray-600">John Doe • 10:00 AM</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Today</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "bookings":
        return (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Electrical Repair</h4>
                    <p className="text-sm text-gray-600">John Doe • Jan 20, 10:00 AM</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">House Cleaning</h4>
                    <p className="text-sm text-gray-600">Jane Smith • Jan 22, 2:00 PM</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case "earnings":
        return (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#2E7D32]">TSh 1,250,000</div>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#2E7D32]">TSh 350,000</div>
                    <p className="text-sm text-gray-600">This Month</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case "profile":
        return (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <p className="text-sm text-gray-900 capitalize">{user.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#212121] mb-2">Provider Dashboard</h1>
          <p className="text-gray-600 text-sm md:text-base">Welcome back, {user.name}!</p>
        </div>

        {/* Simple Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow-sm">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("overview")}
            className="flex items-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </Button>
          <Button
            variant={activeTab === "bookings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("bookings")}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Bookings
          </Button>
          <Button
            variant={activeTab === "earnings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("earnings")}
            className="flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4" />
            Earnings
          </Button>
          <Button
            variant={activeTab === "profile" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("profile")}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Profile
          </Button>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  )
} 