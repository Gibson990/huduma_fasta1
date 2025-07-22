"use client"

import { useState, useEffect, use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Award, 
  User, 
  ArrowLeft,
  Calendar,
  MessageSquare,
  X
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ContactForm } from "@/components/contact-form"
import { ReportDialog } from "@/components/report-dialog"

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

interface Service {
  id: number
  name_en: string
  base_price: number
  duration_minutes: number
  rating: number
}

interface Review {
  id: number
  user_id: number
  user_name: string
  rating: number
  review_text: string
  created_at: string
}

export default function ProviderDetailsPage({ params }: { params: Promise<{ providerId: string }> }) {
  const { providerId } = use(params)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showContactForm, setShowContactForm] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [reviewCount, setReviewCount] = useState<number>(0)

  useEffect(() => {
    fetchProviderDetails()
    fetchProviderReviews()
  }, [providerId])

  const fetchProviderDetails = async () => {
    try {
      setLoading(true)
      const [providerResponse, servicesResponse] = await Promise.all([
        fetch(`/api/providers/${providerId}`),
        fetch(`/api/providers/${providerId}/services`)
      ])
      
      if (providerResponse.ok) {
        const providerData = await providerResponse.json()
        setProvider(providerData)
      }
      
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json()
        setServices(servicesData)
      }
    } catch (error) {
      console.error('Error fetching provider details:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProviderReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?providerId=${providerId}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
        if (data.length > 0) {
          const avg = data.reduce((sum: number, r: Review) => sum + r.rating, 0) / data.length
          setAverageRating(Number(avg.toFixed(1)))
          setReviewCount(data.length)
        } else {
          setAverageRating(null)
          setReviewCount(0)
        }
      }
    } catch (error) {
      setReviews([])
      setAverageRating(null)
      setReviewCount(0)
    }
  }

  const handleBookService = (service: Service) => {
    if (!user) {
      router.push('/login')
      return
    }
    router.push(`/book/${service.id}?providerId=${provider?.id}`)
  }

  const handleContact = () => {
    setShowContactForm(true)
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading provider details...</p>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Provider not found</h2>
          <p className="text-gray-600 mb-4">The provider you're looking for doesn't exist</p>
          <Button asChild>
            <Link href="/providers">Browse Providers</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contact Form Modal */}
      {showContactForm && provider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative">
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
            <ContactForm
              providerId={provider.id}
              providerName={provider.name}
              providerEmail={provider.email}
              onClose={() => setShowContactForm(false)}
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" asChild>
            <Link href="/providers">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Providers
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Provider Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Provider Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Provider Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{provider.name}</h3>
                  {provider.is_verified && (
                    <Badge className="bg-green-600 text-white mt-2">
                      Verified Professional
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{provider.rating} Rating</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{provider.experience_years} years experience</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    <span>{provider.total_jobs} jobs completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{provider.location}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Specialization</h4>
                  <p className="text-gray-600 text-sm">{provider.specialization_en}</p>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button
                    onClick={handleContact}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Provider
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(`tel:${provider.phone}`, '_blank')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  {user && (
                    <ReportDialog
                      reportType="provider"
                      targetId={provider.id.toString()}
                      targetName={provider.name}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Services Offered */}
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
                <CardDescription>Professional services provided by {provider.name}</CardDescription>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No specific services listed</p>
                    <p className="text-sm text-gray-400 mt-2">Contact the provider for custom services</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <Card key={service.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">{service.name_en}</h4>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{service.rating}</span>
                            </div>
                          </div>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{formatDuration(service.duration_minutes)}</span>
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                              {formatPrice(service.base_price)}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleBookService(service)}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Service
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{provider.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{provider.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{provider.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section (Placeholder) */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews & Ratings</CardTitle>
                <CardDescription>
                  {reviewCount > 0
                    ? `Average rating: ${averageRating} (${reviewCount} review${reviewCount > 1 ? 's' : ''})`
                    : `What clients say about ${provider.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reviewCount === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No reviews yet</p>
                    <p className="text-sm text-gray-400 mt-2">Be the first to leave a review!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          {[1,2,3,4,5].map((star) => (
                            <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                          <span className="text-xs text-gray-500 ml-2">{review.user_name}</span>
                          <span className="text-xs text-gray-400 ml-2">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{review.review_text}</p>
                      </div>
                    ))}
                    {reviewCount > 5 && (
                      <div className="text-center mt-4">
                        <span className="text-xs text-gray-500">Showing 5 of {reviewCount} reviews</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 