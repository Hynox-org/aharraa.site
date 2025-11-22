"use client"

import { useRouter } from "next/navigation"
import { IoCart, IoArrowForward, IoCheckmarkCircle } from "react-icons/io5"
import Link from "next/link"
import { Spinner } from "./ui/spinner"
import { useState } from "react"

interface CartSummaryCardProps {
  totalItems: number
  totalPrice: number
  isUpdatingCart: boolean
}

export function CartSummaryCard({ totalItems, totalPrice, isUpdatingCart }: CartSummaryCardProps) {
  const router = useRouter()
  const [isBtnLoading, SetIsBtnLoading] = useState(isUpdatingCart);
  const handleCheckoutClick = () => {
    SetIsBtnLoading(true)
    router.push("/checkout")
  }

  return (
    <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-3 md:p-5 lg:p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-5 lg:mb-6 pb-3 md:pb-4 lg:pb-5 border-b border-gray-100">
        <div className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-[#3CB371] flex items-center justify-center shadow-md">
          <IoCart className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-base md:text-lg lg:text-xl font-bold text-black">
            Cart Summary
          </h3>
          <p className="text-[10px] md:text-xs text-gray-500">Review your order</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 md:space-y-4 lg:space-y-5">
        {/* Total Items */}
        <div className="flex justify-between items-center">
          <span className="text-xs md:text-sm lg:text-base text-gray-600">Total Items</span>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 md:px-3 md:py-1 bg-gray-100 rounded-full text-sm md:text-base font-bold text-black">
              {totalItems}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200"></div>

        {/* Order Total */}
        <div className="flex justify-between items-center pt-1 md:pt-2">
          <span className="text-sm md:text-base lg:text-lg font-bold text-black">
            Order Total
          </span>
          <span className="text-2xl md:text-3xl lg:text-4xl font-black text-black">
            ₹{totalPrice.toFixed(0)}
          </span>
        </div>

        {/* Checkout Button */}
        <div className="pt-1 md:pt-2">
          <button 
            onClick={handleCheckoutClick}
            disabled={isBtnLoading}
            className="w-full py-2.5 md:py-3 lg:py-3.5 rounded-lg md:rounded-xl font-bold text-xs md:text-sm lg:text-base
                     bg-[#3CB371] hover:bg-[#2FA05E] text-white
                     shadow-lg hover:shadow-xl
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                     transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isBtnLoading ? (
              <Spinner className="w-4 h-4 md:w-5 md:h-5 text-white" />
            ) : (
              <>
                <span>Proceed to Checkout</span>
                <IoArrowForward className="w-4 h-4 md:w-5 md:h-5" />
              </>
            )}
          </button>
        </div>

        {/* Features */}
        <div className="pt-2 md:pt-3 lg:pt-4 border-t border-gray-100">
          <div className="space-y-1.5 md:space-y-2">
            {[
              "Secure payment",
              "Easy returns"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs lg:text-sm text-gray-600">
                <IoCheckmarkCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#3CB371] flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info Text */}
        <div className="pt-2 md:pt-3 lg:pt-4 border-t border-gray-100">
          <p className="text-[10px] md:text-xs text-center text-gray-400">
            Taxes and delivery charges calculated at checkout
          </p>
        </div>
      </div>
    </div>
  )
}
