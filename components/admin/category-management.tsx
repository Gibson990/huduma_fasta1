"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FolderOpen, Plus, Edit, Trash2, Zap, Wrench, Sparkles, Hammer, Paintbrush, Settings } from "lucide-react"
import { useLanguage } from "@/lib/language"

const iconOptions = [
  { value: "Zap", label: "Zap (Electric)", icon: Zap },
  { value: "Wrench", label: "Wrench (Tools)", icon: Wrench },
  { value: "Sparkles", label: "Sparkles (Cleaning)", icon: Sparkles },
  { value: "Hammer", label: "Hammer (Construction)", icon: Hammer },
  { value: "Paintbrush", label: "Paintbrush (Painting)", icon: Paintbrush },
  { value: "Settings", label: "Settings (Repair)", icon: Settings },
]

export function CategoryManagement() {
  const { t, language } = useLanguage()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    name_en: "",
    name_sw: "",
    description_en: "",
    description_sw: "",
    icon: "Zap",
    image_url: "",
    is_active: true,
  })

  // Fetch categories on mount
  useEffect(() => {
    setLoading(true)
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow animate-pulse">
              <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative bg-gray-200">
                <div className="absolute bottom-4 left-4">
                  <div className="h-8 w-8 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded w-20" />
                </div>
                <div className="absolute top-2 right-2">
                  <div className="h-6 w-16 bg-gray-300 rounded" />
                </div>
              </div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="flex gap-2">
                  <div className="h-8 w-16 bg-gray-200 rounded" />
                  <div className="h-8 w-16 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find((opt) => opt.value === iconName)
    return iconOption ? iconOption.icon : FolderOpen
  }

  const handleAddCategory = async () => {
    const payload = {
      ...formData,
      is_active: true,
    }
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const newCategory = await res.json()
    setCategories((prev) => [newCategory, ...prev])
    setFormData({
      name_en: "",
      name_sw: "",
      description_en: "",
      description_sw: "",
      icon: "Zap",
      image_url: "",
      is_active: true,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name_en: category.name_en,
      name_sw: category.name_sw,
      description_en: category.description_en,
      description_sw: category.description_sw,
      icon: category.icon,
      image_url: category.image_url,
      is_active: category.is_active,
    })
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return
    const payload = {
      ...formData,
    }
    const res = await fetch(`/api/categories/${editingCategory.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const updated = await res.json()
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    setEditingCategory(null)
    setFormData({
      name_en: "",
      name_sw: "",
      description_en: "",
      description_sw: "",
      icon: "Zap",
      image_url: "",
      is_active: true,
    })
  }

  const handleDeleteCategory = async (id: number) => {
    await fetch(`/api/categories/${id}`, { method: "DELETE" })
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const toggleCategoryStatus = async (id: number) => {
    const category = categories.find((c) => c.id === id)
    if (!category) return
    const res = await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !category.is_active }),
    })
    const updated = await res.json()
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#212121] flex items-center gap-2">
            <FolderOpen className="h-5 w-5 md:h-6 md:w-6" />
            Category Management
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Manage service categories and their details</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleAddCategory}
              submitLabel="Add Category"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {categories.map((category) => {
          const IconComponent = getIconComponent(category.icon)
          return (
            <Card key={category.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                  <img
                    src={category.image_url || "/placeholder.svg"}
                    alt={language === "sw" ? category.name_sw : category.name_en}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <IconComponent className="h-6 w-6 md:h-8 md:w-8 mb-2" />
                    <div className="text-xs md:text-sm font-medium">{category.service_count} Services</div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className={category.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {category.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-[#212121] text-sm md:text-base line-clamp-1">
                      {language === "sw" ? category.name_sw : category.name_en}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
                      {language === "sw" ? category.description_sw : category.description_en}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)} className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCategoryStatus(category.id)}
                      className="flex-1"
                    >
                      {category.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateCategory}
            submitLabel="Update Category"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CategoryForm({ formData, setFormData, onSubmit, submitLabel }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name_en">Category Name (English)</Label>
          <Input
            id="name_en"
            value={formData.name_en}
            onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
            placeholder="e.g., Electrical Services"
          />
        </div>
        <div>
          <Label htmlFor="name_sw">Category Name (Swahili)</Label>
          <Input
            id="name_sw"
            value={formData.name_sw}
            onChange={(e) => setFormData({ ...formData, name_sw: e.target.value })}
            placeholder="e.g., Huduma za Umeme"
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
            placeholder="Category description in English"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="description_sw">Description (Swahili)</Label>
          <Textarea
            id="description_sw"
            value={formData.description_sw}
            onChange={(e) => setFormData({ ...formData, description_sw: e.target.value })}
            placeholder="Category description in Swahili"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="icon">Icon</Label>
          <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
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
      </div>

      <Button onClick={onSubmit} className="w-full bg-[#2E7D32] hover:bg-[#1B5E20]">
        {submitLabel}
      </Button>
    </div>
  )
}
