"use client"

import { useState } from "react"
import { IoCart, IoArrowForward, IoCheckmarkCircle, IoChevronDown, IoChevronUp } from "react-icons/io5"
import { Spinner } from "./ui/spinner"

interface CheckoutOrderSummaryProps {
  totalPrice: number
  deliveryCost: number
  platformCost: number
  gstCost: number
  grandTotal: number
  itemCount: number
  onProceedToPayment: () => void
  isProcessingPayment: boolean
}

export function CheckoutOrderSummary({
  totalPrice,
  deliveryCost,
  platformCost,
  gstCost,
  grandTotal,
  itemCount,
  onProceedToPayment,
  isProcessingPayment,
}: CheckoutOrderSummaryProps) {
  const [open, setOpen] = useState(false)
  
  return (
    <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-3 md:p-5 lg:p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-5 lg:mb-6 pb-3 md:pb-4 lg:pb-5 border-b border-gray-100">
        <div className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-[#3CB371] flex items-center justify-center shadow-md">
          <IoCart className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-base md:text-lg lg:text-xl font-bold text-black">
            Order Summary
          </h3>
          <p className="text-[10px] md:text-xs text-gray-500">Review your total</p>
        </div>
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <span className="text-xs md:text-sm lg:text-base text-gray-600">
          Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
        <span className="font-bold text-sm md:text-base lg:text-lg text-black">
          ₹{totalPrice.toFixed(0)}
        </span>
      </div>

      {/* Accordion Trigger */}
      <button
        className={`w-full text-left font-semibold text-xs md:text-sm lg:text-base py-2 md:py-2.5 lg:py-3 px-3 md:px-4 rounded-lg md:rounded-xl mb-3 md:mb-4 flex justify-between items-center transition-all duration-300 ${
          open 
            ? 'bg-gray-100 text-black border-2 border-gray-300' 
            : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100'
        }`}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls="order-breakdown"
      >
        <span>{open ? 'Hide Details' : 'View Breakdown'}</span>
        {open ? (
          <IoChevronUp className="w-4 h-4 md:w-5 md:h-5" />
        ) : (
          <IoChevronDown className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </button>

      {/* Accordion Details */}
      {open && (
        <div 
          id="order-breakdown" 
          className="space-y-2 md:space-y-3 lg:space-y-4 mb-3 md:mb-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-gray-50 border border-gray-100 animate-fade-in"
        >
          <div className="flex justify-between items-start text-xs md:text-sm lg:text-base">
            <span className="flex-1 pr-2 text-gray-600">
              Delivery Fee
            </span>
            <span className="font-semibold flex-shrink-0 text-black">
              ₹{deliveryCost.toFixed(0)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs md:text-sm lg:text-base">
            <span className="text-gray-600">Platform Cost (10%)</span>
            <span className="font-semibold text-black">
              ₹{platformCost.toFixed(0)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs md:text-sm lg:text-base">
            <span className="text-gray-600">GST (5%)</span>
            <span className="font-semibold text-black">
              ₹{gstCost.toFixed(0)}
            </span>
          </div>

          <div className="h-px bg-gray-200"></div>
        </div>
      )}

      {/* Grand Total */}
      <div className="flex justify-between items-center pt-3 md:pt-4 lg:pt-5 mb-3 md:mb-5 lg:mb-6 border-t-2 border-gray-100">
        <span className="text-sm md:text-base lg:text-lg font-bold text-black">
          Total Amount
        </span>
        <span className="text-2xl md:text-3xl lg:text-4xl font-black text-black">
          ₹{grandTotal.toFixed(0)}
        </span>
      </div>

      {/* Proceed Button */}
      <button
        onClick={onProceedToPayment}
        disabled={isProcessingPayment}
        className="w-full py-2.5 md:py-3 lg:py-3.5 rounded-lg md:rounded-xl font-bold text-xs md:text-sm lg:text-base bg-[#3CB371] hover:bg-[#2FA05E] text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isProcessingPayment ? (
          <>
            <Spinner className="w-4 h-4 md:w-5 md:h-5 text-white" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Proceed to Payment</span>
            <IoArrowForward className="w-4 h-4 md:w-5 md:h-5" />
          </>
        )}
      </button>

      {/* Trust Indicators */}
      <div className="pt-3 md:pt-5 lg:pt-6 border-t border-gray-100 mt-3 md:mt-5 lg:mt-6">
        <div className="space-y-1.5 md:space-y-2 lg:space-y-2.5">
          {[
            "Secure payment gateway",
            "100% money-back guarantee",
            "Cancel anytime"
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs lg:text-sm text-gray-600">
              <IoCheckmarkCircle className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 text-[#3CB371] flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-3 md:mt-4 lg:mt-5 p-2.5 md:p-3 lg:p-4 rounded-lg md:rounded-xl bg-gray-50 border border-gray-200">
        <p className="text-[10px] md:text-xs lg:text-sm text-center text-gray-700">
          All prices are in INR and include applicable taxes
        </p>
      </div>
    </div>
  )
}
