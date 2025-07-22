"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Wrench, 
  Clock, 
  Shield, 
  Star, 
  MapPin, 
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  Heart
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const features = [
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: "Fast Service",
      description: "Get connected to qualified service providers within minutes, not hours."
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Verified Providers",
      description: "All our service providers are thoroughly vetted and background-checked."
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      title: "Quality Guaranteed",
      description: "Rate and review services to ensure quality standards are maintained."
    },
    {
      icon: <MapPin className="w-6 h-6 text-red-600" />,
      title: "Local Services",
      description: "Find trusted service providers in your neighborhood and surrounding areas."
    }
  ]

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "500+", label: "Verified Providers" },
    { number: "50+", label: "Service Categories" },
    { number: "4.8", label: "Average Rating" }
  ]

  const team = [
    {
      name: "John Smith",
      role: "CEO & Founder",
      description: "Passionate about connecting people with quality services."
    },
    {
      name: "Sarah Johnson",
      role: "Head of Operations",
      description: "Ensuring smooth operations and customer satisfaction."
    },
    {
      name: "Mike Chen",
      role: "Head of Technology",
      description: "Building innovative solutions for better service delivery."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2E7D32] to-[#1B5E20] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Huduma Faster
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Connecting you with trusted service providers for all your needs
            </p>
            <p className="text-lg text-green-200 mb-8">
              Huduma Faster is Tanzania's premier platform for connecting customers with verified, 
              professional service providers. We make it easy to find, book, and pay for services 
              with just a few clicks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button size="lg" className="bg-white text-[#2E7D32] hover:bg-gray-100">
                  Explore Services
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#2E7D32]">
                  Join as Provider
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              To revolutionize service delivery in Tanzania by creating a trusted, efficient, 
              and transparent platform that connects customers with qualified service providers, 
              making quality services accessible to everyone.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">For Customers</h3>
                <p className="text-gray-600">
                  Find reliable, verified service providers quickly and easily. 
                  Book services, track progress, and pay securely through our platform.
                </p>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">For Providers</h3>
                <p className="text-gray-600">
                  Grow your business by reaching more customers. Manage bookings, 
                  receive payments, and build your reputation through our platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Huduma Faster?
            </h2>
            <p className="text-xl text-gray-600">
              We're committed to providing the best service experience for both customers and providers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-[#2E7D32] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-green-100">
              Trusted by thousands of customers and providers across Tanzania
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind Huduma Faster
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-[#2E7D32] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-[#2E7D32] font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of satisfied customers and providers on Huduma Faster
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-[#2E7D32] hover:bg-[#1B5E20]">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-[#2E7D32] text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="py-8 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Phone className="w-6 h-6 text-[#2E7D32] mb-2" />
              <p className="font-semibold text-gray-900">Call Us</p>
              <p className="text-gray-600">+255 123 456 789</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="w-6 h-6 text-[#2E7D32] mb-2" />
              <p className="font-semibold text-gray-900">Email Us</p>
              <p className="text-gray-600">info@hudumafaster.com</p>
            </div>
            <div className="flex flex-col items-center">
              <MessageSquare className="w-6 h-6 text-[#2E7D32] mb-2" />
              <p className="font-semibold text-gray-900">Live Chat</p>
              <p className="text-gray-600">Available 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 