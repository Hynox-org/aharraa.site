"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function CartSummary() {
  const cart = useStore((state) => state.cart)
  const selectedPlan = useStore((state) => state.selectedPlan)
  const selectedLocation = useStore((state) => state.selectedLocation)
  const removeFromCart = useStore((state) => state.removeFromCart)
  const updateQuantity = useStore((state) => state.updateQuantity)
  const getTotalPrice = useStore((state) => state.getTotalPrice)

  return (
    <div className="lg:col-span-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.menuItem.id}-${item.day}-${item.slot}`}
              className="flex gap-4 p-4 border border-neutral-200 rounded-lg bg-white"
            >
              <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-neutral-100">
                <Image
                  src={item.menuItem.image || "/placeholder.svg"}
                  alt={item.menuItem.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900">{item.menuItem.name}</h3>
                <p className="text-sm text-neutral-600 mb-1">{item.day}</p>
                <p className="text-sm text-neutral-600 mb-2 capitalize">{item.slot}</p>
                <p className="text-lg font-bold text-orange-500 mb-3">
                  ₹{(item.menuItem.price * item.quantity).toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.menuItem.id, item.day, item.slot, Math.max(1, item.quantity - 1))
                    }
                    className="px-2 py-1 border border-neutral-200 rounded hover:bg-neutral-100 transition"
                  >
                    −
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItem.id, item.day, item.slot, item.quantity + 1)}
                    className="px-2 py-1 border border-neutral-200 rounded hover:bg-neutral-100 transition"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.menuItem.id, item.day, item.slot)}
                    className="ml-auto text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">Order Summary</h2>

            <div className="bg-orange-50 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Plan:</span>
                <span className="font-semibold text-neutral-900">{selectedPlan?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Location:</span>
                <span className="font-semibold text-neutral-900 capitalize">{selectedLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Duration:</span>
                <span className="font-semibold text-neutral-900">{selectedPlan?.daysCount} days</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-b border-neutral-200 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Meal Items</span>
                <span className="font-medium">₹{getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Delivery</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Tax (5%)</span>
                <span className="font-medium">₹{Math.round(getTotalPrice() * 0.05).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-orange-500">
                ₹{Math.round(getTotalPrice() + getTotalPrice() * 0.05).toLocaleString()}
              </span>
            </div>

            <Link href="/checkout" className="block">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Proceed to Checkout</Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="w-full border-neutral-200 hover:bg-neutral-50 bg-transparent">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
