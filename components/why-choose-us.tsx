import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, Star, Headphones, DollarSign, Users } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Verified Providers",
    description: "All service providers are background-checked and verified for your safety",
  },
  {
    icon: Clock,
    title: "Quick Response",
    description: "Get matched with available providers within minutes of booking",
  },
  {
    icon: Star,
    title: "Quality Guaranteed",
    description: "We ensure high-quality service delivery with our rating system",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our customer support team is available round the clock to help you",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "No hidden charges. You know exactly what you pay before booking",
  },
  {
    icon: Users,
    title: "Trusted Community",
    description: "Join thousands of satisfied customers who trust Huduma Faster",
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#212121] mb-4">Why Choose Huduma Faster?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing the best service booking experience with trusted providers and excellent
            support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Card key={index} className="border-0 bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#C8E6C9] rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-[#2E7D32]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#212121] mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
} 