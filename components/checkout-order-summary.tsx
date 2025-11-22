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
    <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 md:mb-6 pb-4 md:pb-5 border-b border-gray-100">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#3CB371] flex items-center justify-center shadow-md">
          <IoCart className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-black">
            Order Summary
          </h3>
          <p className="text-xs text-gray-500">Review your total</p>
        </div>
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm md:text-base text-gray-600">
          Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
        <span className="font-bold text-base md:text-lg text-black">
          ₹{totalPrice.toFixed(0)}
        </span>
      </div>

      {/* Accordion Trigger */}
      <button
        className={`w-full text-left font-semibold text-sm md:text-base py-3 px-4 rounded-xl mb-4 flex justify-between items-center transition-all duration-300 ${
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
          <IoChevronUp className="w-5 h-5" />
        ) : (
          <IoChevronDown className="w-5 h-5" />
        )}
      </button>

      {/* Accordion Details */}
      {open && (
        <div 
          id="order-breakdown" 
          className="space-y-3 md:space-y-4 mb-4 p-4 rounded-xl bg-gray-50 border border-gray-100 animate-fade-in"
        >
          <div className="flex justify-between items-start text-sm md:text-base">
            <span className="flex-1 pr-2 text-gray-600">
              Delivery Fee
            </span>
            <span className="font-semibold flex-shrink-0 text-black">
              ₹{deliveryCost.toFixed(0)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm md:text-base">
            <span className="text-gray-600">Platform Cost (10%)</span>
            <span className="font-semibold text-black">
              ₹{platformCost.toFixed(0)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm md:text-base">
            <span className="text-gray-600">GST (5%)</span>
            <span className="font-semibold text-black">
              ₹{gstCost.toFixed(0)}
            </span>
          </div>

          <div className="h-px bg-gray-200"></div>
        </div>
      )}

      {/* Grand Total */}
      <div className="flex justify-between items-center pt-4 md:pt-5 mb-5 md:mb-6 border-t-2 border-gray-100">
        <span className="text-base md:text-lg font-bold text-black">
          Total Amount
        </span>
        <span className="text-3xl md:text-4xl font-black text-black">
          ₹{grandTotal.toFixed(0)}
        </span>
      </div>

      {/* Proceed Button */}
      <button
        onClick={onProceedToPayment}
        disabled={isProcessingPayment}
        className="w-full py-3 md:py-3.5 rounded-xl font-bold text-sm md:text-base bg-[#3CB371] hover:bg-[#2FA05E] text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isProcessingPayment ? (
          <>
            <Spinner className="w-5 h-5 text-white" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>Proceed to Payment</span>
            <IoArrowForward className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Trust Indicators */}
      <div className="pt-5 md:pt-6 border-t border-gray-100 mt-5 md:mt-6">
        <div className="space-y-2 md:space-y-2.5">
          {[
            "Secure payment gateway",
            "100% money-back guarantee",
            "Cancel anytime"
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <IoCheckmarkCircle className="w-4 h-4 md:w-4.5 md:h-4.5 text-[#3CB371] flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-4 md:mt-5 p-3 md:p-4 rounded-xl bg-gray-50 border border-gray-200">
        <p className="text-xs md:text-sm text-center text-gray-700">
          All prices are in INR and include applicable taxes
        </p>
      </div>
    </div>
  )
}
