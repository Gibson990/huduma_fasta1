import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Mail, Phone, MoreHorizontal, UserCheck, UserX, Trash, Plus, Shield } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import bcrypt from "bcryptjs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const testImage = "https://randomuser.me/api/portraits/men/3.jpg"

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
    is_active: true,
  })

  // Fetch users on mount
  useEffect(() => {
    setLoading(true)
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setUsers([])
      })
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <div className="h-6 bg-gray-200 rounded w-64 mb-2" />
            <div className="flex gap-2 mt-2">
              <div className="h-10 w-48 bg-gray-200 rounded" />
              <div className="h-10 w-32 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full" />
                <div>
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
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

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleAddUser = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) return
    const password_hash = await bcrypt.hash(formData.password, 10)
    const payload = { ...formData, password_hash }
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setIsAddDialogOpen(false)
      setFormData({ name: "", email: "", phone: "", password: "", role: "customer", is_active: true })
      // Refresh users list
      const usersRes = await fetch("/api/users")
      const usersData = await usersRes.json()
      setUsers(usersData)
    }
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "",
      role: user.role,
      is_active: user.is_active,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return
    const payload: any = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      is_active: formData.is_active,
    }
    if (formData.password) {
      payload.password_hash = await bcrypt.hash(formData.password, 10)
    }
    const res = await fetch(`/api/users/${selectedUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      setFormData({ name: "", email: "", phone: "", password: "", role: "customer", is_active: true })
      // Refresh users list
      const usersRes = await fetch("/api/users")
      const usersData = await usersRes.json()
      setUsers(usersData)
    }
  }

  const handleDeleteUser = async (user: any) => {
    if (!window.confirm(`Delete user ${user.name}?`)) return
    await fetch(`/api/users/${user.id}`, { method: "DELETE" })
    // Refresh users list
    const usersRes = await fetch("/api/users")
    const usersData = await usersRes.json()
    setUsers(usersData)
  }

  const handleToggleActive = async (user: any) => {
    await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !user.is_active }),
    })
    // Refresh users list
    const usersRes = await fetch("/api/users")
    const usersData = await usersRes.json()
    setUsers(usersData)
  }

  const handleMakeAdmin = async (user: any) => {
    await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "admin" }),
    })
    // Refresh users list
    const usersRes = await fetch("/api/users")
    const usersData = await usersRes.json()
    setUsers(usersData)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <CardTitle className="text-[#212121] flex items-center">
            <Users className="h-5 w-5 mr-2" />
            User Management / Usimamizi wa Watumiaji
          </CardTitle>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="provider">Provider</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img src={user.image && user.image.trim() !== "" ? user.image : testImage} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-medium text-[#212121]">{user.name}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-4">
                      <span className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {user.phone}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Role: <span className="font-semibold">{user.role}</span> • Joined {user.created_at?.slice(0, 10)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={user.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {user.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEditUser(user)}>
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleActive(user)}>
                        {user.is_active ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleMakeAdmin(user)} disabled={user.role === "admin"}>
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-600">
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter full name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter email" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter phone number" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Enter password" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select id="role" name="role" value={formData.role} onChange={handleInputChange} className="w-full border rounded px-2 py-1">
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input id="is_active" name="is_active" type="checkbox" checked={formData.is_active} onChange={handleInputChange} />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser} className="bg-[#2E7D32] hover:bg-[#1B5E20]">Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter full name" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter email" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter phone number" />
            </div>
            <div>
              <Label htmlFor="password">Password (leave blank to keep current)</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Enter new password" />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select id="role" name="role" value={formData.role} onChange={handleInputChange} className="w-full border rounded px-2 py-1">
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input id="is_active" name="is_active" type="checkbox" checked={formData.is_active} onChange={handleInputChange} />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateUser} className="bg-[#2E7D32] hover:bg-[#1B5E20]">Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
