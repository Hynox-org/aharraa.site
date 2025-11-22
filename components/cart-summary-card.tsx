"use client"

import { useRouter } from "next/navigation"
import { IoCart, IoArrowForward, IoCheckmarkCircle } from "react-icons/io5"
import Link from "next/link"
import { Spinner } from "./ui/spinner"

interface CartSummaryCardProps {
  totalItems: number
  totalPrice: number
  isUpdatingCart: boolean
}

export function CartSummaryCard({ totalItems, totalPrice, isUpdatingCart }: CartSummaryCardProps) {
  const router = useRouter()

  const handleCheckoutClick = () => {
    router.push("/checkout")
  }

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 md:mb-6 pb-4 md:pb-5 border-b border-gray-100">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#3CB371] flex items-center justify-center shadow-md">
          <IoCart className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-black">
            Cart Summary
          </h3>
          <p className="text-xs text-gray-500">Review your order</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 md:space-y-5">
        {/* Total Items */}
        <div className="flex justify-between items-center">
          <span className="text-sm md:text-base text-gray-600">Total Items</span>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm md:text-base font-bold text-black">
              {totalItems}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200"></div>

        {/* Order Total */}
        <div className="flex justify-between items-center pt-2">
          <span className="text-base md:text-lg font-bold text-black">
            Order Total
          </span>
          <span className="text-3xl md:text-4xl font-black text-black">
            ₹{totalPrice.toFixed(0)}
          </span>
        </div>

        {/* Checkout Button */}
        <div className="pt-2">
          <button 
            onClick={handleCheckoutClick}
            disabled={isUpdatingCart}
            className="w-full py-3 md:py-3.5 rounded-xl font-bold text-sm md:text-base
                     bg-[#3CB371] hover:bg-[#2FA05E] text-white
                     shadow-lg hover:shadow-xl
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                     transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isUpdatingCart ? (
              <Spinner className="w-5 h-5 text-white" />
            ) : (
              <>
                <span>Proceed to Checkout</span>
                <IoArrowForward className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Features */}
        <div className="pt-3 md:pt-4 border-t border-gray-100">
          <div className="space-y-2">
            {[
              "Free delivery on orders above ₹500",
              "Secure payment",
              "Easy returns"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <IoCheckmarkCircle className="w-4 h-4 text-[#3CB371] flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Text */}
        <div className="pt-3 md:pt-4 border-t border-gray-100">
          <p className="text-xs text-center text-gray-400">
            Taxes and delivery charges calculated at checkout
          </p>
        </div>
      </div>
    </div>
  )
}
