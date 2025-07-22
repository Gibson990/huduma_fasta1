import { HeroSection } from "@/components/hero-section"
import { ServiceCategories } from "@/components/service-categories"
import { HowItWorks } from "@/components/how-it-works"
import { WhyChooseUs } from "@/components/why-choose-us"
import { Testimonials } from "@/components/testimonials"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServiceCategories />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
    </div>
  )
} 