"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Phone, Mail, MoreHorizontal, Plus, Trash, UserCheck, UserX, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import bcrypt from "bcryptjs"

// Available specializations
const specializations = [
  "Electrical Services",
  "Plumbing Services",
  "Cleaning Services",
  "Carpentry",
  "Painting",
  "Furniture",
  "Other Services",
]

// Available locations
const locations = ["Dar es Salaam", "Arusha", "Mwanza", "Dodoma", "Mbeya", "Moshi", "Tanga", "Zanzibar"]

// Add Tanzanian sample names for new providers
const sampleNames = [
  "Juma Mwalimu", "Amina Salehe", "Hassan Mwangi", "Grace Kimani", "Mohamed Ali", "Fatma Hassan", "John Mwita", "Neema Mushi", "Peter Mwakalebela", "Zainabu Omari"
];

const testImage = "https://randomuser.me/api/portraits/men/3.jpg"

export function ProviderManagement() {
  const [providers, setProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<any>(null)


  // New provider form state
  const [newProvider, setNewProvider] = useState({
    name: sampleNames[Math.floor(Math.random() * sampleNames.length)],
    email: "",
    phone: "",
    specialization: "",
    location: locations[Math.floor(Math.random() * locations.length)],
    password: "",
    image: "",
    rating: 4.5,
    totalJobs: 0,
    verified: false,
  })

  // Fetch providers on mount
  useEffect(() => {
    setLoading(true)
    fetch("/api/providers")
      .then((res) => res.json())
      .then((data) => {
        setProviders(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setProviders([])
      })
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-96" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6 bg-white shadow-sm animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProvider((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewProvider((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddProvider = async () => {
    if (!newProvider.name || !newProvider.email || !newProvider.phone || !newProvider.specialization || !newProvider.location || !newProvider.password || !newProvider.image) {
      toast.error("Please fill in all required fields")
      return
    }
    const password_hash = await bcrypt.hash(newProvider.password, 10)
    const payload = {
      name: newProvider.name,
      email: newProvider.email,
      phone: newProvider.phone,
      password_hash,
      is_active: true,
      image: newProvider.image,
      specialization: newProvider.specialization,
      location: newProvider.location,
      rating: newProvider.rating,
      totalJobs: newProvider.totalJobs,
      verified: newProvider.verified,
    }
    const res = await fetch("/api/providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const created = await res.json()
    setProviders((prev) => [created, ...prev])
    setIsAddDialogOpen(false)
    setNewProvider({ name: sampleNames[Math.floor(Math.random() * sampleNames.length)], email: "", phone: "", specialization: "", location: locations[Math.floor(Math.random() * locations.length)], password: "", image: "", rating: 4.5, totalJobs: 0, verified: false })
    toast.success(`${created.name} has been added as a service provider`)
  }

  const handleDeleteProvider = async () => {
    if (selectedProvider) {
      await fetch(`/api/providers/${selectedProvider.id}`, { method: "DELETE" })
      setProviders((prev) => prev.filter((p) => p.id !== selectedProvider.id))
      setIsDeleteDialogOpen(false)
      setSelectedProvider(null)
      toast.success(`${selectedProvider.name} has been removed from service providers`)
    }
  }

  const toggleProviderStatus = async (provider: any) => {
    const res = await fetch(`/api/providers/${provider.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !provider.is_active }),
    })
    const updated = await res.json()
    setProviders((prev) => prev.map((p) => (p.id === provider.id ? updated : p)))
    toast.success(`${provider.name} has been ${updated.is_active ? "activated" : "deactivated"}`)
  }

  const openDetailsDialog = (provider: any) => {
    setSelectedProvider(provider)
    setIsDetailsDialogOpen(true)
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#212121]">Service Providers</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
          <Plus className="mr-2 h-4 w-4" /> Add Provider
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Provider</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Specialization</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Jobs</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">KYC Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Contract Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">KYC Doc</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Contract</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((provider) => (
                <tr key={provider.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={provider.image && provider.image.trim() !== "" ? provider.image : testImage}
                        alt={provider.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-[#212121]">{provider.name}</div>
                        {provider.verified && <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {provider.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {provider.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{provider.specialization || "N/A"}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{typeof provider.totalJobs === "number" ? provider.totalJobs : 0}</td>
                  <td className="py-3 px-4">
                    <Badge className={provider.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {provider.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{provider.kyc_status || "-"}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{provider.contract_status || "-"}</td>
                  <td className="py-3 px-4 text-sm text-blue-600 underline">
                    {provider.kyc_document_url ? <a href={provider.kyc_document_url} target="_blank" rel="noopener noreferrer">View</a> : "-"}
                  </td>
                  <td className="py-3 px-4 text-sm text-blue-600 underline">
                    {provider.contract_url ? <a href={provider.contract_url} target="_blank" rel="noopener noreferrer">View</a> : "-"}
                  </td>
                  <td className="py-3 px-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openDetailsDialog(provider)}>
                          <Info className="mr-2 h-4 w-4" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleProviderStatus(provider)}>
                          {provider.is_active ? (
                            <>
                              <UserX className="mr-2 h-4 w-4 text-red-600" />
                              <span>Deactivate</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                              <span>Activate</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedProvider(provider); setIsDeleteDialogOpen(true); }} className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Provider Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service Provider</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={newProvider.name}
                  onChange={handleInputChange}
                  placeholder="Enter provider's full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newProvider.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newProvider.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +255700000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select
                  value={newProvider.specialization}
                  onValueChange={(value) => handleSelectChange("specialization", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={newProvider.location} onValueChange={(value) => handleSelectChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={newProvider.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Profile Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={newProvider.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/profile.jpg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProvider} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
                Add Provider
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Provider Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Service Provider</DialogTitle>
            </DialogHeader>
            {selectedProvider && (
              <div className="py-4">
                <p className="mb-4">
                  Are you sure you want to delete <strong>{selectedProvider.name}</strong>? This action cannot be
                  undone.
                </p>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteProvider}>
                    Delete Provider
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Provider Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Provider Details</DialogTitle>
            </DialogHeader>
            {selectedProvider && (
              <div className="py-4">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={selectedProvider.image || "/placeholder.svg?height=80&width=80"}
                    alt={selectedProvider.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-medium">{selectedProvider.name}</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{selectedProvider.rating} rating</span>
                    </div>
                    <Badge
                      className={
                        selectedProvider.status === "active"
                          ? "bg-green-100 text-green-800 mt-1"
                          : "bg-gray-100 text-gray-800 mt-1"
                      }
                    >
                      {selectedProvider.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-500">Specialization</Label>
                    <p className="text-sm font-medium">{selectedProvider.specialization}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Location</Label>
                    <p className="text-sm font-medium">{selectedProvider.location}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Email</Label>
                    <p className="text-sm font-medium">{selectedProvider.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Phone</Label>
                    <p className="text-sm font-medium">{selectedProvider.phone}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Total Jobs</Label>
                    <p className="text-sm font-medium">{selectedProvider.totalJobs} completed</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Verification</Label>
                    <p className="text-sm font-medium">{selectedProvider.verified ? "Verified" : "Not verified"}</p>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div>
                    <Label className="text-xs text-gray-500">KYC Status</Label>
                    <p className="text-sm font-medium">{selectedProvider.kyc_status || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Contract Status</Label>
                    <p className="text-sm font-medium">{selectedProvider.contract_status || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">KYC Document</Label>
                    {selectedProvider.kyc_document_url ? (
                      <a href={selectedProvider.kyc_document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View KYC PDF</a>
                    ) : <span>-</span>}
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Contract</Label>
                    {selectedProvider.contract_url ? (
                      <a href={selectedProvider.contract_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Contract PDF</a>
                    ) : <span>-</span>}
                  </div>
                </div>
                {/* Approve/Reject Actions */}
                <div className="mt-6 flex flex-col gap-2">
                  <Button onClick={async () => {
                    await fetch(`/api/providers/${selectedProvider.id}/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kyc_status: 'verified', contract_status: 'verified', is_active: true }) })
                    toast.success('Provider verified')
                    setIsDetailsDialogOpen(false)
                    // Optionally refresh providers list
                  }} className="bg-[#2E7D32] hover:bg-[#1B5E20]">Approve Provider</Button>
                  <Button onClick={async () => {
                    const note = prompt('Enter rejection note (optional):')
                    await fetch(`/api/providers/${selectedProvider.id}/verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kyc_status: 'rejected', contract_status: 'rejected', is_active: false, admin_note: note }) })
                    toast.success('Provider rejected')
                    setIsDetailsDialogOpen(false)
                    // Optionally refresh providers list
                  }} className="bg-red-600 hover:bg-red-700">Reject Provider</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
