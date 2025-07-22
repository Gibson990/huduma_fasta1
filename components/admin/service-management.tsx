"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Package, Plus, Edit, Trash2, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language"
import { toast } from "sonner"

export function ServiceManagement() {
  const { t, language } = useLanguage()
  const [services, setServices] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [formData, setFormData] = useState({
    name_en: "",
    name_sw: "",
    description_en: "",
    description_sw: "",
    price: "",
    duration_minutes: "",
    category_id: "",
    image_url: "",
  })

  // Fetch services and categories on mount
  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch("/api/services").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json())
    ])
    .then(([servicesData, categoriesData]) => {
      setServices(servicesData)
      setCategories(categoriesData)
      setLoading(false)
    })
    .catch(() => {
      setLoading(false)
      setServices([])
      setCategories([])
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
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
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

  const handleAddService = async () => {
    const payload = {
      ...formData,
      base_price: parseFloat(formData.price),
      duration_minutes: parseInt(formData.duration_minutes),
      category_id: parseInt(formData.category_id),
    }
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const newService = await res.json()
    setServices((prev) => [newService, ...prev])
    setFormData({
      name_en: "",
      name_sw: "",
      description_en: "",
      description_sw: "",
      price: "",
      duration_minutes: "",
      category_id: "",
      image_url: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditService = (service: any) => {
    setEditingService(service)
    setFormData({
      name_en: service.name_en,
      name_sw: service.name_sw,
      description_en: service.description_en,
      description_sw: service.description_sw,
      price: service.base_price?.toString() || service.price?.toString() || "",
      duration_minutes: service.duration_minutes?.toString() || "",
      category_id: service.category_id?.toString() || "",
      image_url: service.image_url,
    })
  }

  const handleUpdateService = async () => {
    if (!editingService) return
    const payload = {
      ...formData,
      base_price: parseFloat(formData.price),
      duration_minutes: parseInt(formData.duration_minutes),
      category_id: parseInt(formData.category_id),
    }
    const res = await fetch(`/api/services/${editingService.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const updated = await res.json()
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    setEditingService(null)
    setFormData({
      name_en: "",
      name_sw: "",
      description_en: "",
      description_sw: "",
      price: "",
      duration_minutes: "",
      category_id: "",
      image_url: "",
    })
  }

  const handleDeleteService = async (id: number) => {
    await fetch(`/api/services/${id}`, { method: "DELETE" })
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  const toggleServiceStatus = async (id: number) => {
    try {
      const service = services.find((s) => s.id === id)
      if (!service) return
      
      const res = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !service.is_active }),
      })
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      
      const updated = await res.json()
      setServices((prev) => prev.map((s) => (s.id === id ? updated : s)))
      toast.success(`Service ${updated.is_active ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      console.error('Error toggling service status:', error)
      toast.error('Failed to update service status')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#212121] flex items-center gap-2">
            <Package className="h-5 w-5 md:h-6 md:w-6" />
            Service Management
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Manage all services and their details</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <ServiceForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddService}
              submitLabel="Add Service"
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {services.map((service) => (
          <Card key={service.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                <img
                  src={service.image_url || "/placeholder.svg"}
                  alt={language === "sw" ? service.name_sw : service.name_en}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={service.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {service.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-[#212121] text-sm md:text-base line-clamp-1">
                    {language === "sw" ? service.name_sw : service.name_en}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                    {language === "sw" ? service.description_sw : service.description_en}
                  </p>
                </div>

                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium">{service.category_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-bold text-[#2E7D32]">
                      TSh {typeof service.price === "number"
                        ? service.price.toLocaleString()
                        : typeof service.base_price === "number"
                          ? service.base_price.toLocaleString()
                          : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration:</span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {service.duration_minutes} min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Providers:</span>
                    <span>{service.provider_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bookings:</span>
                    <span>{service.booking_count}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditService(service)} className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleServiceStatus(service.id)}
                    className={service.is_active ? "flex-1 bg-red-100 text-red-700 hover:bg-red-200" : "flex-1 bg-gray-100 text-gray-800 hover:bg-green-100 hover:text-green-800"}
                  >
                    {service.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteService(service.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <ServiceForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateService}
            submitLabel="Update Service"
            categories={categories}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ServiceForm({ formData, setFormData, onSubmit, submitLabel, categories }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name_en">Service Name (English)</Label>
          <Input
            id="name_en"
            value={formData.name_en}
            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
            placeholder="e.g., Electrical Wiring"
          />
        </div>
        <div>
          <Label htmlFor="name_sw">Service Name (Swahili)</Label>
          <Input
            id="name_sw"
            value={formData.name_sw}
            onChange={(e) => setFormData({ ...formData, name_sw: e.target.value })}
            placeholder="e.g., Uwiring wa Umeme"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="description_en">Description (English)</Label>
          <Textarea
            id="description_en"
            value={formData.description_en}
            onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
            placeholder="Detailed service description in English"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="description_sw">Description (Swahili)</Label>
          <Textarea
            id="description_sw"
            value={formData.description_sw}
            onChange={(e) => setFormData({ ...formData, description_sw: e.target.value })}
            placeholder="Detailed service description in Swahili"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Price (TSh)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="150000"
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
            placeholder="120"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category: any) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {category.image_url && (
                      <img src={category.image_url} alt={category.name_en} style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 4 }} />
                    )}
                    {category.name_en}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <Button onClick={onSubmit} className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]">
        {submitLabel}
      </Button>
    </div>
  )
}
