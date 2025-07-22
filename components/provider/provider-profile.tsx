"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Edit, Save, X, Star } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

interface ProviderProfileData {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  services: string[];
  experience_years: number;
  average_rating: number;
  total_reviews: number;
  is_verified: boolean;
  specializations: string[];
  certifications: string[];
  working_hours: string;
  working_days: string;
  image?: string;
  documents?: string[];
}

export function ProviderProfile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<ProviderProfileData>({} as ProviderProfileData)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<ProviderProfileData>({} as ProviderProfileData)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [documents, setDocuments] = useState<File[]>([])
  const [documentPreviews, setDocumentPreviews] = useState<string[]>([])
  const [passwordFields, setPasswordFields] = useState({ current: '', new: '', confirm: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return;
    setLoading(true)
    fetch(`/api/providers/${user.id}`)
      .then(res => res.ok ? res.json() : {})
      .then(data => {
        setProfile(data as ProviderProfileData)
        setEditedProfile(data as ProviderProfileData)
        setImagePreview(typeof (data as ProviderProfileData).image === 'string' ? (data as ProviderProfileData).image : "")
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        // fallback sample data if needed
        const sampleProfile: ProviderProfileData = {
          id: user.id,
          name: "John Electrician",
          email: "john@example.com",
          phone: "+255 123 456 789",
          address: "123 Electrician St, Dar es Salaam",
          bio: "Professional electrician with 10+ years of experience in residential and commercial electrical work. Specialized in circuit repairs, installations, and maintenance.",
          services: ["Electrical Repair", "Electrical Installation", "Circuit Maintenance"],
          experience_years: 10,
          average_rating: 4.8,
          total_reviews: 25,
          is_verified: true,
          specializations: ["Residential", "Commercial", "Industrial"],
          certifications: ["Licensed Electrician", "Safety Certified"],
          working_hours: "8:00 AM - 6:00 PM",
          working_days: "Monday - Saturday",
          image: "",
          documents: []
        }
        setProfile(sampleProfile)
        setEditedProfile(sampleProfile)
        setImagePreview((sampleProfile && 'image' in sampleProfile ? sampleProfile.image : "") || "")
      })
  }, [user])

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg mb-4 bg-white shadow-sm animate-pulse flex flex-col gap-4">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-1" />
            <div className="h-4 bg-gray-100 rounded w-1/4" />
            <div className="h-8 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-24 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
    )
  }

  const handleSave = async () => {
    try {
      const formData = new FormData();
      for (const key in editedProfile) {
        if (key === 'documents' && documents.length > 0) {
          documents.forEach((doc, idx) => {
            formData.append(`documents`, doc)
          })
        } else if (editedProfile[key] !== undefined && editedProfile[key] !== null) {
          formData.append(key, editedProfile[key]);
        }
      }
      if (imagePreview) {
        formData.append("image", imagePreview);
      }
      // Add password fields if filled
      if (passwordFields.current && passwordFields.new && passwordFields.confirm) {
        formData.append('currentPassword', passwordFields.current)
        formData.append('newPassword', passwordFields.new)
        formData.append('confirmPassword', passwordFields.confirm)
      }
      const response = await fetch(`/api/providers/${user?.id}`, {
        method: "PATCH",
        body: formData
      });
      if (response.ok) {
        setProfile(editedProfile)
        setIsEditing(false)
        setPasswordFields({ current: '', new: '', confirm: '' })
        toast({
          title: "Profile Updated!",
          description: "Your profile has been updated successfully.",
          variant: "success",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordFields(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setEditedProfile((prev: any) => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setDocuments(files)
    const previews = files.map(file => URL.createObjectURL(file))
    setDocumentPreviews(previews)
    setEditedProfile((prev: any) => ({ ...prev, documents: files }))
  }

  // Profile completeness calculation
  const completenessFields = [
    profile.name,
    profile.email,
    profile.phone,
    profile.address,
    profile.bio,
    profile.image || imagePreview,
    profile.experience_years,
    profile.working_hours,
    profile.working_days,
    profile.specializations && profile.specializations.length > 0,
    profile.certifications && profile.certifications.length > 0,
    (documents && documents.length > 0) || (profile.documents && profile.documents.length > 0)
  ]
  const completeness = Math.round((completenessFields.filter(Boolean).length / completenessFields.length) * 100)

  return (
    <div className="space-y-6">
      {/* Profile Completeness Progress Bar */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121] flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Completeness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Progress value={completeness} className="h-3" />
            <span className="text-sm text-gray-700">{completeness}% complete</span>
          </div>
        </CardContent>
      </Card>
      {/* Profile Image Upload */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#212121] flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border bg-gray-100 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Image
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Basic Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#212121] flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="bg-[#2E7D32] hover:bg-[#1B5E20]">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={editedProfile.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">{profile.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={editedProfile.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">{profile.email}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={editedProfile.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">{profile.phone}</p>
              )}
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={editedProfile.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">{profile.address}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={editedProfile.bio || ""}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={3}
                className="mt-1"
              />
            ) : (
              <p className="text-sm text-gray-900 mt-1">{profile.bio}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#212121] flex items-center gap-2">
            <User className="h-5 w-5" />
            Verification Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4">
              {documentPreviews.map((src, idx) => (
                <div key={idx} className="w-24 h-24 border rounded flex items-center justify-center bg-gray-50 overflow-hidden">
                  <a href={src} target="_blank" rel="noopener noreferrer">
                    <img src={src} alt={`Document ${idx + 1}`} className="object-cover w-full h-full" />
                  </a>
                </div>
              ))}
            </div>
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={handleDocumentChange}
                  className="block"
                />
                <p className="text-xs text-gray-500 mt-1">Upload certifications, ID, or other verification documents (images or PDFs).</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121] flex items-center gap-2">
            <User className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordFields.current}
                  onChange={e => handlePasswordChange('current', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordFields.new}
                  onChange={e => handlePasswordChange('new', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordFields.confirm}
                  onChange={e => handlePasswordChange('confirm', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">To change your password, click Edit and fill in the fields.</p>
          )}
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#212121]">Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Experience</Label>
              {isEditing ? (
                <Input
                  type="number"
                  min="0"
                  value={editedProfile.experience_years || ""}
                  onChange={e => handleInputChange("experience_years", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">{profile.experience_years} years</p>
              )}
            </div>
            <div>
              <Label>Rating</Label>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-900">{profile.average_rating}/5</span>
                <span className="text-sm text-gray-600">({profile.total_reviews} reviews)</span>
              </div>
            </div>
            <div>
              <Label>Working Hours</Label>
              {isEditing ? (
                <Input
                  value={editedProfile.working_hours || ""}
                  onChange={e => handleInputChange("working_hours", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">{profile.working_hours}</p>
              )}
            </div>
            <div>
              <Label>Working Days</Label>
              {isEditing ? (
                <Input
                  value={editedProfile.working_days || ""}
                  onChange={e => handleInputChange("working_days", e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-sm text-gray-900 mt-1">{profile.working_days}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Specializations</Label>
            {isEditing ? (
              <Input
                value={Array.isArray(editedProfile.specializations) ? editedProfile.specializations.join(", ") : editedProfile.specializations || ""}
                onChange={e => handleInputChange("specializations", e.target.value)}
                className="mt-1"
                placeholder="e.g. Residential, Commercial, Industrial"
              />
            ) : (
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.specializations?.map((spec: string, index: number) => (
                  <Badge key={index} variant="secondary">{spec}</Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>Certifications</Label>
            {isEditing ? (
              <Input
                value={Array.isArray(editedProfile.certifications) ? editedProfile.certifications.join(", ") : editedProfile.certifications || ""}
                onChange={e => handleInputChange("certifications", e.target.value)}
                className="mt-1"
                placeholder="e.g. Licensed Electrician, Safety Certified"
              />
            ) : (
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.certifications?.map((cert: string, index: number) => (
                  <Badge key={index} variant="outline">{cert}</Badge>
                ))}
              </div>
            )}
          </div>

          {profile.is_verified && (
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">Verified Provider</Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 