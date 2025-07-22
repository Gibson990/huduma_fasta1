import { Card, CardContent } from "@/components/ui/card"
import { Search, Calendar, CreditCard, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Choose Service",
    description: "Browse our categories and select the service you need",
  },
  {
    icon: Calendar,
    title: "Book Appointment",
    description: "Pick your preferred date, time, and provide service address",
  },
  {
    icon: CreditCard,
    title: "Payment Options",
    description: "Choose cash on delivery or online payment (coming soon)",
  },
  {
    icon: CheckCircle,
    title: "Service Delivered",
    description: "Our verified provider completes the job to your satisfaction",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#212121] mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Getting quality service has never been easier. Follow these simple steps to book your service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <Card key={index} className="text-center border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-[#C8E6C9] rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="h-8 w-8 text-[#2E7D32]" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#2E7D32] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-[#212121] mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
} 