"use client"

import { Header } from "@/components/header"
import { CartSummary } from "@/components/cart-summary"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CartPage() {
  const cart = useStore((state) => state.cart)

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-6">Your cart is empty</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary-dark text-white">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CartSummary />
          </div>
        )}
      </div>
    </main>
  )
}
