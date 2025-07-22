"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Wrench, Sparkles, Hammer, Paintbrush, Settings, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Icon mapping for categories
const iconMap: { [key: string]: any } = {
  "Electrical Services": Zap,
  "Plumbing Services": Wrench,
  "Cleaning Services": Sparkles,
  "Carpentry": Hammer,
  "Painting": Paintbrush,
  "Appliance Repair": Settings,
  "default": Settings
}

export function ServiceCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        // Fetch service counts for each category
        const categoriesWithCounts = await Promise.all(data.map(async (cat: any) => {
          const res = await fetch(`/api/services?category=${cat.id}`)
          let count = 0
          if (res.ok) {
            const services = await res.json()
            count = Array.isArray(services) ? services.length : 0
          }
          return { ...cat, serviceCount: count }
        }))
        setCategories(categoriesWithCounts)
      } catch (err) {
        setError('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Slide controls
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" })
    }
  }
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" })
    }
  }

  // Book Now handler for direct booking
  const handleBookNow = async (categoryId: number) => {
    // Fetch the first service in this category
    const res = await fetch(`/api/services?category=${categoryId}`)
    if (res.ok) {
      const services = await res.json()
      if (Array.isArray(services) && services.length > 0) {
        router.push(`/book/${services[0].id}`)
        return
      }
    }
    // Fallback: go to services page filtered by category
    router.push(`/services?category=${categoryId}`)
  }

  // Featured services data
  const featuredServices = [
    {
      name: "Electrical",
      tagline: "Need help now? We’ll be there in 30mins",
      price: "From TSh 20,000/service",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000",
      link: "/services?category=electrical",
    },
    {
      name: "Home Cleaning",
      tagline: "Professional cleaning at your doorstep",
      price: "From TSh 15,000/service",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000",
      link: "/services?category=home-cleaning",
    },
  ]

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading services...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 md:py-16 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Service Categories</h2>
        <div className="relative w-full">
          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hidden md:block"
            onClick={scrollLeft}
            aria-label="Scroll left"
            style={{ left: -24 }}
          >
            <ChevronLeft className="h-6 w-6 text-[#2E7D32]" />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-6 min-w-full overflow-x-hidden scroll-smooth no-scrollbar"
            tabIndex={0}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="min-w-[300px] max-w-xs bg-white rounded-xl shadow-md flex-shrink-0 flex flex-col hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={category.image_url}
                  alt={category.name_en}
                  className="h-48 w-full object-cover rounded-t-xl"
                />
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-1 text-[#212121]">{category.name_en}</h3>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">{category.description_en}</p>
                  <span className="text-sm text-blue-600 font-medium mb-4">{category.serviceCount} Services</span>
                  <Button
                    className="mt-auto bg-[#2E7D32] text-white rounded-lg px-4 py-2 font-semibold hover:bg-[#1B5E20] transition"
                    onClick={() => handleBookNow(category.id)}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hidden md:block"
            onClick={scrollRight}
            aria-label="Scroll right"
            style={{ right: -24 }}
          >
            <ChevronRight className="h-6 w-6 text-[#2E7D32]" />
          </button>
        </div>
        <div className="flex justify-center mt-8">
          <Button asChild size="lg" className="px-8 py-3 text-lg font-semibold">
            <a href="/services">View All</a>
          </Button>
        </div>
        {/* Featured Services */}
        <div className="mt-10 flex flex-col gap-8">
          {featuredServices.map((service, idx) => (
            <div
              key={service.name}
              className={`flex flex-col md:flex-row items-center rounded-2xl shadow-lg overflow-hidden bg-gradient-to-r ${idx % 2 === 0 ? "from-[#e0f7fa] to-[#fff]" : "from-[#f3e5f5] to-[#fff]"}`}
              style={{ minHeight: 220 }}
            >
              <div className="flex-1 p-8 flex flex-col justify-center">
                <span className="text-sm font-semibold text-gray-700 mb-2">Instant Helpers</span>
                <h3 className="text-2xl md:text-3xl font-bold text-[#212121] mb-2">{service.tagline}</h3>
                <p className="text-gray-600 mb-4">{service.price}</p>
                <Button
                  className="bg-[#2E7D32] text-white rounded-lg px-6 py-3 font-semibold text-lg w-fit hover:bg-[#1B5E20]"
                  onClick={() => router.push(service.link)}
                >
                  Book now
                </Button>
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full max-w-xs h-48 object-cover rounded-xl shadow-md"
                  style={{ background: "#f5f5f5" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 