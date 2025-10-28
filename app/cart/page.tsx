"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import CartSummary from "@/components/cart-summary"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface OrderSummary {
  plan: {
    name: string
    duration: string
    daysCount: number
    pricePerDay: number
    totalPrice: number
    dates: {
      start: string
      end: string
    }
  }
  vendor: {
    id: string
    name: string
    location: string
    rating: number
    contactInfo: {
      phone: string
      email: string
    }
  }
  dietPreference: "veg" | "non-veg"
  weeklyMenu: {
    [key: string]: {
      date: string
      meals: {
        breakfast: Array<{ id: string; name: string; isVegetarian: boolean }>
        lunch: Array<{ id: string; name: string; isVegetarian: boolean }>
        dinner: Array<{ id: string; name: string; isVegetarian: boolean }>
      }
    }
  }
  accompaniments: Array<{
    id: string
    name: string
    price: number
  }>
  pricing: {
    planTotal: number
    accompanimentsTotal: number
    grandTotal: number
  }
}

export default function CartPage() {
  const router = useRouter()
  const [summary, setSummary] = useState<OrderSummary | null>(null)

  useEffect(() => {
    const savedSummary = localStorage.getItem('orderSummary')
    if (savedSummary) {
      setSummary(JSON.parse(savedSummary))
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Review Your Order</h1>

        {!summary ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-6">No order details found</p>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Return to Home</Button>
            </Link>
          </div>
        ) : (
          <CartSummary summary={summary} />
        )}
      </div>
    </main>
  )
}
