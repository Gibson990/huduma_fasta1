import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { LanguageProvider } from "@/lib/language"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Huduma Faster - Local Service Booking Platform",
  description: "Book trusted local service providers instantly. From electricians to cleaners, get quality services at your doorstep in Tanzania.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <LanguageProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <Toaster position="top-right" />
            </LanguageProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 