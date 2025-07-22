"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Phone,
  Mail,
  Clock,
  User,
  Eye,
  Award
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface Provider {
  id: number
  name: string
  email: string
  phone: string
  specialization_en: string
  specialization_sw: string
  experience_years: number
  rating: number
  total_jobs: number
  is_verified: boolean
  location: string
  created_at: string
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [sortBy, setSortBy] = useState<"name" | "rating" | "experience">("rating")
  const [userLocation, setUserLocation] = useState<string>("")
  
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchProviders()
    // Get user's location if available
    if (user?.address) {
      setUserLocation(user.address)
    }
  }, [])

  useEffect(() => {
    filterProviders()
  }, [providers, searchTerm, selectedLocation, sortBy])

  const fetchProviders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/providers')
      const data = await response.json()
      setProviders(data)
    } catch (error) {
      console.error('Error fetching providers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProviders = () => {
    let filtered = [...providers]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specialization_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(provider => 
        provider.location.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "experience":
          return b.experience_years - a.experience_years
        default:
          return b.rating - a.rating
      }
    })

    setFilteredProviders(filtered)
  }

  const handleViewProvider = (provider: Provider) => {
    router.push(`/providers/${provider.id}`)
  }

  const handleContactProvider = (provider: Provider) => {
    // In a real app, this would open a contact form or messaging system
    window.open(`mailto:${provider.email}?subject=Service Inquiry`, '_blank')
  }

  const getLocations = () => {
    const locations = [...new Set(providers.map(p => p.location))]
    return locations.sort()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading providers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Top Service Providers</h1>
            <p className="text-xl mb-8">Find trusted professionals in your area</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for providers or services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg border-0 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location Filter */}
                <div>
                  <h3 className="font-semibold mb-3">Location</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedLocation("")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedLocation === ""
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      All Locations
                    </button>
                    {getLocations().map((location) => (
                      <button
                        key={location}
                        onClick={() => setSelectedLocation(location)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedLocation === location
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="font-semibold mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "name" | "rating" | "experience")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="rating">Highest Rating</option>
                    <option value="experience">Most Experience</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>

                {/* User Location */}
                {userLocation && (
                  <div>
                    <h3 className="font-semibold mb-3">Your Location</h3>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-800">{userLocation}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Providers Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredProviders.length} Providers Found
              </h2>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">Verified Professionals</span>
              </div>
            </div>

            {filteredProviders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No providers found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search or location filters</p>
                  <Button onClick={() => {
                    setSearchTerm("")
                    setSelectedLocation("")
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => (
                  <Card key={provider.id} className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center space-x-3">
                        <User className="w-10 h-10 text-blue-600 bg-blue-100 rounded-full p-2" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{provider.location}</span>
                          </div>
                          {provider.is_verified && (
                            <Badge className="bg-green-600 text-white mt-2">Verified Professional</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{provider.rating}</span>
                        </div>
                        <span className="text-xs text-gray-400">{provider.total_jobs} jobs</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-4">
                      <div className="mb-2">
                        <span className="font-semibold">Specialization: </span>
                        <span className="text-gray-700">{provider.specialization_en}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{provider.experience_years} years experience</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{provider.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{provider.email}</span>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" onClick={() => handleViewProvider(provider)}>
                          <Eye className="w-4 h-4 mr-1" /> View Profile
                        </Button>
                        <Button size="sm" onClick={() => handleContactProvider(provider)}>
                          <Mail className="w-4 h-4 mr-1" /> Contact
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 