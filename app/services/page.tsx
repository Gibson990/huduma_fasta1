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
  Clock, 
  MapPin, 
  ShoppingCart,
  Heart,
  Eye
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface Service {
  id: number
  name_en: string
  name_sw: string
  description_en: string
  description_sw: string
  base_price: number
  duration_minutes: number
  rating: number
  image_url: string
  category_id: number
  category_name: string
}

interface Category {
  id: number
  name_en: string
  name_sw: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterServices()
  }, [services, searchTerm, selectedCategory, sortBy, priceRange])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [servicesResponse, categoriesResponse] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/categories')
      ])
      
      const servicesData = await servicesResponse.json()
      const categoriesData = await categoriesResponse.json()
      
      setServices(servicesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterServices = () => {
    let filtered = [...services]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description_en.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(service => service.category_id === selectedCategory)
    }

    // Price range filter
    filtered = filtered.filter(service => 
      service.base_price >= priceRange[0] && service.base_price <= priceRange[1]
    )

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.base_price - b.base_price
        case "rating":
          return b.rating - a.rating
        default:
          return a.name_en.localeCompare(b.name_en)
      }
    })

    setFilteredServices(filtered)
  }

  const handleAddToCart = (service: Service) => {
    if (!user) {
      router.push('/login')
      return
    }

    addToCart({
      id: Date.now(),
      serviceId: service.id,
      name: service.name_en,
      price: service.base_price,
      duration: service.duration_minutes,
      image: service.image_url
    })
  }

  const handleBookNow = (service: Service) => {
    if (!user) {
      router.push('/login')
      return
    }
    router.push(`/book/${service.id}`)
  }

  const formatPrice = (price: number) => {
    return `TZS ${price.toLocaleString()}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2E7D32] to-[#388E3C] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Find the Perfect Service</h1>
            <p className="text-xl mb-8">Professional services at your doorstep</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for services..."
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
                {/* Categories */}
                <div>
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === null
                          ? 'bg-[#2E7D32] text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-[#2E7D32] text-white'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {category.name_en}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="font-semibold mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "name" | "price" | "rating")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                  >
                    <option value="name">Name</option>
                    <option value="price">Price (Low to High)</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>TZS 0</span>
                      <span>TZS {priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Services Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredServices.length} Services Found
              </h2>
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Cart</span>
              </div>
            </div>
            
            {filteredServices.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No services found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                  <Button onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory(null)
                    setPriceRange([0, 1000000])
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="group hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={service.image_url}
                        alt={service.name_en}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-3 right-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="bg-white/80 hover:bg-white"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      <Badge className="absolute top-3 left-3 bg-[#2E7D32] text-white">
                        {service.category_name}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-[#2E7D32] transition-colors">
                          {service.name_en}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{service.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {service.description_en}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDuration(service.duration_minutes)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>Available</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#2E7D32]">
                            {formatPrice(service.base_price)}
                          </p>
              </div>
            </div>
            
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(service)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-[#2E7D32] hover:bg-[#1B5E20]"
                          onClick={() => handleBookNow(service)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Book Now
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