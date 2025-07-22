"use client"

import { Button } from "@/components/ui/button"
import { Menu, X, User, LogIn, LogOut, Bell, MessageSquare, ShoppingCart, Globe } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { usePathname } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState('en')
  const { user, logout } = useAuth()
  const { items } = useCart()
  const pathname = usePathname()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  // Don't show header on dashboard pages to avoid double navigation
  if (pathname.startsWith('/dashboard')) {
    return null
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#2E7D32] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Huduma Faster</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-[#2E7D32] transition-colors font-medium">
              Home
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-[#2E7D32] transition-colors font-medium">
              Services
            </Link>
            <Link href="/providers" className="text-gray-600 hover:text-[#2E7D32] transition-colors font-medium">
              Providers
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-[#2E7D32] transition-colors font-medium">
              About
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'EN' : 'SW'}</span>
            </Button>

            {/* Cart with count */}
            <Button variant="outline" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            </Button>

            {user ? (
              <>
                <Button variant="outline" asChild>
                  <Link href="/dashboard">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">
                    <User className="w-4 h-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-[#2E7D32] transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/services"
                className="text-gray-600 hover:text-[#2E7D32] transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="/providers"
                className="text-gray-600 hover:text-[#2E7D32] transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Providers
              </Link>
              <Link
                href="/about"
                className="text-gray-600 hover:text-[#2E7D32] transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {/* Language Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLanguage(language === 'en' ? 'sw' : 'en')
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === 'en' ? 'English' : 'Kiswahili'}</span>
                </Button>

                {/* Cart with count */}
                <Button variant="outline" asChild className="relative" onClick={() => setIsMenuOpen(false)}>
                  <Link href="/cart">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                    {items.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {items.length}
                      </span>
                    )}
                  </Link>
                </Button>

                {user ? (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                        <User className="w-4 h-4 mr-2" />
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 