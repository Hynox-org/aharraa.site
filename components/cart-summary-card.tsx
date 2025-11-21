"use client"

import { useState } from "react" // Added useState
import { useRouter } from "next/navigation" // Added useRouter
import { IoCart, IoArrowForward } from "react-icons/io5"
import Link from "next/link"
import { Spinner } from "./ui/spinner" // Added Spinner import

interface CartSummaryCardProps {
  totalItems: number
  totalPrice: number
}

export function CartSummaryCard({ totalItems, totalPrice }: CartSummaryCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleCheckoutClick = () => {
    setIsLoading(true)
    router.push("/checkout")
    // setIsLoading(false) // This might not be reached if the page navigates immediately
  }

  return (
    <div className="rounded-xl p-6 shadow-xl" style={{ backgroundColor: "#283618" }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <IoCart className="w-6 h-6" style={{ color: "#FEFAE0" }} />
        <h3 className="text-xl sm:text-2xl font-bold" style={{ color: "#FEFAE0" }}>
          Cart Summary
        </h3>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Total Items */}
        <div className="flex justify-between items-center text-sm sm:text-base">
          <span style={{ color: "rgba(254, 250, 224, 0.8)" }}>Total Items</span>
          <span className="font-bold" style={{ color: "#FEFAE0" }}>
            {totalItems}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ backgroundColor: "rgba(221, 161, 94, 0.3)" }}></div>

        {/* Order Total */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg sm:text-xl font-bold" style={{ color: "#FEFAE0" }}>
            Order Total
          </span>
          <span className="text-2xl sm:text-3xl font-bold" style={{ color: "#DDA15E" }}>
            ₹{totalPrice.toFixed(0)}
          </span>
        </div>

        {/* Checkout Button */}
        <div className="block mt-6">
          <button 
            onClick={handleCheckoutClick} // Added onClick handler
            disabled={isLoading} // Disable when loading
            className="w-full py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed" // Added disabled styles
            style={{ 
              backgroundColor: "#DDA15E",
              color: "#283618"
            }}
          >
            {isLoading ? (
              <Spinner className="w-5 h-5 text-[#283618]" /> // Show spinner when loading
            ) : (
              <>
                Proceed to Checkout
                <IoArrowForward className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Info Text */}
        <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(221, 161, 94, 0.3)" }}>
          <p className="text-xs sm:text-sm text-center" style={{ color: "rgba(254, 250, 224, 0.7)" }}>
            Taxes and delivery charges calculated at checkout
          </p>
        </div>
      </div>
    </div>
  )
}
