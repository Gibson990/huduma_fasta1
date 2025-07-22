"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "sw"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.how_it_works": "How It Works",
    "nav.about": "About",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.logout": "Logout",
    "nav.dashboard": "Dashboard",
    "nav.cart": "Cart",

    // Hero Section
    "hero.title": "Huduma Faster",
    "hero.subtitle":
      "Book trusted local service providers instantly. From electricians to cleaners, get quality services at your doorstep.",
    "hero.book_now": "Book Service Now",
    "hero.learn_more": "Learn More",
    "hero.support_24_7": "24/7 Support",
    "hero.quick_response": "Quick Response",
    "hero.verified_providers": "Verified Providers",

    // Services
    "services.title": "Our Services",
    "services.subtitle":
      "Choose from our wide range of professional services. All our providers are verified and experienced.",
    "services.view_services": "View Services",
    "services.book_now": "Book Now",
    "services.add_to_cart": "Add to Cart",
    "services.duration": "Duration",
    "services.price": "Price",

    // Cart
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.total": "Total",
    "cart.checkout": "Proceed to Checkout",
    "cart.remove": "Remove",
    "cart.quantity": "Quantity",

    // Auth
    "auth.login": "Login",
    "auth.signup": "Sign Up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Full Name",
    "auth.phone": "Phone Number",
    "auth.login_success": "Login successful",
    "auth.signup_success": "Account created successfully",
    "auth.invalid_credentials": "Invalid credentials",

    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.currency": "TSh",
  },
  sw: {
    // Navigation
    "nav.home": "Nyumbani",
    "nav.services": "Huduma",
    "nav.how_it_works": "Jinsi Inavyofanya Kazi",
    "nav.about": "Kuhusu",
    "nav.login": "Ingia",
    "nav.signup": "Jisajili",
    "nav.logout": "Toka",
    "nav.dashboard": "Dashibodi",
    "nav.cart": "Kikapu",

    // Hero Section
    "hero.title": "Huduma Haraka",
    "hero.subtitle":
      "Weka oda ya watoa huduma wa eneo lako haraka. Kutoka umeme hadi usafi, pata huduma bora mlangoni mwako.",
    "hero.book_now": "Weka Oda Sasa",
    "hero.learn_more": "Jifunze Zaidi",
    "hero.support_24_7": "Msaada 24/7",
    "hero.quick_response": "Mwitiko wa Haraka",
    "hero.verified_providers": "Watoa Huduma Walioidhinishwa",

    // Services
    "services.title": "Huduma Zetu",
    "services.subtitle":
      "Chagua kutoka kwa huduma zetu mbalimbali za kitaalamu. Watoa huduma wetu wote wameidhinishwa na wana uzoefu.",
    "services.view_services": "Ona Huduma",
    "services.book_now": "Weka Oda",
    "services.add_to_cart": "Ongeza Kikupuni",
    "services.duration": "Muda",
    "services.price": "Bei",

    // Cart
    "cart.title": "Kikapu cha Ununuzi",
    "cart.empty": "Kikapu chako ni tupu",
    "cart.total": "Jumla",
    "cart.checkout": "Endelea na Malipo",
    "cart.remove": "Ondoa",
    "cart.quantity": "Idadi",

    // Auth
    "auth.login": "Ingia",
    "auth.signup": "Jisajili",
    "auth.email": "Barua Pepe",
    "auth.password": "Nywila",
    "auth.name": "Jina Kamili",
    "auth.phone": "Nambari ya Simu",
    "auth.login_success": "Umeingia kikamilifu",
    "auth.signup_success": "Akaunti imeundwa kikamilifu",
    "auth.invalid_credentials": "Taarifa za kuingia si sahihi",

    // Common
    "common.loading": "Inapakia...",
    "common.save": "Hifadhi",
    "common.cancel": "Ghairi",
    "common.edit": "Hariri",
    "common.delete": "Futa",
    "common.search": "Tafuta",
    "common.filter": "Chuja",
    "common.currency": "TSh",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("huduma-language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "sw")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // Update HTML lang attribute when language changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language
    }
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("huduma-language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
