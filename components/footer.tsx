import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#2E7D32] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <h3 className="text-xl font-bold">Huduma Faster</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Connecting you with trusted service providers for all your home and business needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/providers" className="text-gray-300 hover:text-white transition-colors">
                  Providers
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/electrical" className="text-gray-300 hover:text-white transition-colors">
                  Electrical
                </Link>
              </li>
              <li>
                <Link href="/services/plumbing" className="text-gray-300 hover:text-white transition-colors">
                  Plumbing
                </Link>
              </li>
              <li>
                <Link href="/services/cleaning" className="text-gray-300 hover:text-white transition-colors">
                  Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services/painting" className="text-gray-300 hover:text-white transition-colors">
                  Painting
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#2E7D32]" />
                <span className="text-gray-300">+255 700 000 000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#2E7D32]" />
                <span className="text-gray-300">info@hudumafaster.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-[#2E7D32]" />
                <span className="text-gray-300">Dodoma, Tanzania</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Huduma Faster. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 