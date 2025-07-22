"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, User, CreditCard, Settings, Edit, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { NotificationBell } from "@/components/notification-bell"
import { UserBookings } from "@/components/user/user-bookings"
import { DashboardNav } from "@/components/dashboard-nav"
import { ProfileEdit } from "@/components/user/profile-edit"
import { toast } from "sonner"

export default function UserDashboardPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [stats, setStats] = useState<any>({
    totalBookings: 0,
    completed: 0,
    pending: 0
  })
  const [showProfileEdit, setShowProfileEdit] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletePassword, setDeletePassword] = useState("")
  const [deletingAccount, setDeletingAccount] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)
  const [activeTab, setActiveTab] = useState("bookings")
  const [tabLoading, setTabLoading] = useState(false)

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'user' && user.role !== 'customer'))) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user && (user.role === 'user' || user.role === 'customer')) {
      fetchUserData()
    }
  }, [user])

  useEffect(() => {
    setCurrentUser(user)
  }, [user])

  const fetchUserData = async () => {
    try {
      // Fetch user's bookings
      const bookingsResponse = await fetch(`/api/bookings?userId=${user?.id}`)
      const bookingsData = await bookingsResponse.json()
      
      if (bookingsResponse.ok) {
        setBookings(bookingsData)
        
        // Calculate statistics
        const totalBookings = bookingsData.length
        const completed = bookingsData.filter((booking: any) => booking.status === 'completed').length
        const pending = bookingsData.filter((booking: any) => 
          ['pending', 'confirmed', 'in_progress'].includes(booking.status)
        ).length
        
        setStats({
          totalBookings,
          completed,
          pending
        })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleProfileUpdate = (updatedUser: any) => {
    setCurrentUser(updatedUser)
    // Update the auth context with the new user data
    // This will ensure the navigation and other components show updated info
    if (user) {
      // Force a re-render by updating the user object
      window.location.reload()
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      toast.error('Please enter your password')
      return
    }

    try {
      setDeletingAccount(true)
      const response = await fetch('/api/users/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          password: deletePassword
        })
      })

      if (response.ok) {
        toast.success('Account deleted successfully')
        logout()
        router.push('/')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete account')
      }
    } catch (error) {
      toast.error('Failed to delete account')
    } finally {
      setDeletingAccount(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || (user.role !== 'user' && user.role !== 'customer')) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
    <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#212121] mb-2">Welcome, {currentUser?.name}!</h1>
          <p className="text-gray-600 text-sm md:text-base">Track your bookings and manage your profile</p>
        </div>
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            setActiveTab(value)
            setTabLoading(true)
            // Simulate loading for tab switch
            setTimeout(() => setTabLoading(false), 500)
          }}
          className="space-y-6"
        >
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          <TabsTrigger value="bookings" className="flex flex-col gap-1 p-2 md:p-3">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Bookings</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex flex-col gap-1 p-2 md:p-3">
            <User className="h-4 w-4" />
            <span className="text-xs">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex flex-col gap-1 p-2 md:p-3">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col gap-1 p-2 md:p-3">
            <Settings className="h-4 w-4" />
            <span className="text-xs">Settings</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="bookings" className="space-y-6">
            {tabLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
          <UserBookings />
            )}
        </TabsContent>
        <TabsContent value="profile">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#212121] flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <Button 
                  onClick={() => setShowProfileEdit(true)}
                  className="bg-[#2E7D32] hover:bg-[#1B5E20]"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
            </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-lg text-gray-900 mt-1">{currentUser?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <p className="text-lg text-gray-900 mt-1">{currentUser?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="text-lg text-gray-900 mt-1">{currentUser?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <p className="text-lg text-gray-900 mt-1 capitalize">{currentUser?.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="text-lg text-gray-900 mt-1">{currentUser?.address || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Member Since</label>
                    <p className="text-lg text-gray-900 mt-1">
                      Account created
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Account Statistics</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchUserData}
                      className="text-sm"
                    >
                      Refresh
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalBookings}</div>
                      <div className="text-sm text-gray-600">Total Bookings</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                  </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payments">
            <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-[#212121] flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment History
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payment history</h3>
                  <p className="text-gray-600 mb-4">Your payment history will appear here after you make bookings.</p>
                  <Button asChild className="bg-[#2E7D32] hover:bg-[#1B5E20]">
                    <Link href="/services">Book a Service</Link>
                  </Button>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
            <Card className="border-0 shadow-sm">
            <CardHeader>
                <CardTitle className="text-[#212121] flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
            </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-gray-600">Receive booking confirmations and updates</div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">SMS Notifications</div>
                        <div className="text-sm text-gray-600">Receive text messages for urgent updates</div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Profile Visibility</div>
                        <div className="text-sm text-gray-600">Allow service providers to see your profile</div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete Account
                  </Button>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
      {showProfileEdit && (
        <ProfileEdit
          onClose={() => setShowProfileEdit(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action cannot be undone. All your data including bookings, reviews, and profile information will be permanently deleted.
              </p>
            </div>
            <div>
              <Label htmlFor="deletePassword">Enter your password to confirm</Label>
              <Input
                id="deletePassword"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteAccount}
                disabled={deletingAccount || !deletePassword.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                {deletingAccount ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Delete Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 