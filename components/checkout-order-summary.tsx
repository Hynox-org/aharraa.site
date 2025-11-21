"use client"

import { useState } from "react"
import { IoCart, IoArrowForward, IoCheckmarkCircle } from "react-icons/io5"
import { Spinner } from "./ui/spinner" // Import Spinner

interface CheckoutOrderSummaryProps {
  totalPrice: number
  deliveryCost: number
  platformCost: number
  gstCost: number
  grandTotal: number
  itemCount: number
  onProceedToPayment: () => void
  isProcessingPayment: boolean // New prop for loading state
}


export function CheckoutOrderSummary({
  totalPrice,
  deliveryCost,
  platformCost,
  gstCost,
  grandTotal,
  itemCount,
  onProceedToPayment,
  isProcessingPayment, // Destructure new prop
}: CheckoutOrderSummaryProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl p-4 sm:p-6 shadow-xl" style={{ backgroundColor: "#283618" }}>
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <IoCart className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#FEFAE0" }} />
        <h3 className="text-lg sm:text-xl font-bold" style={{ color: "#FEFAE0" }}>Order Summary</h3>
      </div>

      {/* Subtotal only */}
      <div className="flex justify-between items-center text-sm sm:text-base mb-2">
        <span style={{ color: "rgba(254, 250, 224, 0.8)" }}>
          Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
        <span className="font-bold" style={{ color: "#FEFAE0" }}>
          ₹{totalPrice.toFixed(0)}
        </span>
      </div>

      {/* Accordion trigger */}
      <button
        className="w-full text-left font-bold text-sm py-3 px-4 rounded-lg mb-2 flex justify-between items-center"
        style={{ background: open ? '#DDA15E' : '#606C38', color: '#FEFAE0' }}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls="order-breakdown"
      >
        {open ? 'Hide Details' : 'View Breakdown'}
        <span style={{ fontSize: 18 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Accordion Details */}
      {open && (
        <div id="order-breakdown" className="space-y-3 sm:space-y-4 mb-2 animate-fade-in">
          <div className="flex justify-between items-start text-sm sm:text-base">
            <span className="flex-1 pr-2" style={{ color: "rgba(254, 250, 224, 0.8)" }}>
              Delivery Fee
            </span>
            <span className="font-bold flex-shrink-0" style={{ color: "#FEFAE0" }}>
              ₹{deliveryCost.toFixed(0)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm sm:text-base">
            <span style={{ color: "rgba(254, 250, 224, 0.8)" }}>Platform Cost (10%)</span>
            <span className="font-bold" style={{ color: "#FEFAE0" }}>
              ₹{platformCost.toFixed(0)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm sm:text-base">
            <span style={{ color: "rgba(254, 250, 224, 0.8)" }}>GST (5%)</span>
            <span className="font-bold" style={{ color: "#FEFAE0" }}>
              ₹{gstCost.toFixed(0)}
            </span>
          </div>

          <div className="h-px" style={{ backgroundColor: "rgba(221, 161, 94, 0.3)" }}></div>
        </div>
      )}

      {/* Grand Total (outside or inside accordion, your choice) */}
      <div className="flex justify-between items-center pt-2">
        <span className="text-lg sm:text-xl font-bold" style={{ color: "#FEFAE0" }}>Total</span>
        <span className="text-2xl sm:text-3xl font-bold" style={{ color: "#DDA15E" }}>
          ₹{grandTotal.toFixed(0)}
        </span>
      </div>

      {/* Proceed Button */}
      <button
        onClick={onProceedToPayment}
        className="w-full py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mt-4 sm:mt-6"
        style={{ backgroundColor: "#DDA15E", color: "#283618" }}
        disabled={isProcessingPayment} // Disable button when processing payment
      >
        {isProcessingPayment ? (
          <>
            <Spinner className="w-5 h-5 text-[#283618]" />
            Processing...
          </>
        ) : (
          <>
            Proceed to Payment
            <IoArrowForward className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Trust indicators & info */}
      <div className="space-y-2 pt-4 sm:pt-6" style={{ borderTop: "1px solid rgba(221, 161, 94, 0.3)" }}>
        {["Secure payment gateway", "100% money-back guarantee", "Cancel anytime"].map((feature, i) => (
          <div key={i} className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: "#DDA15E" }}>
            <IoCheckmarkCircle className="w-4 h-4 flex-shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}>
        <p className="text-xs sm:text-sm text-center" style={{ color: "rgba(254, 250, 224, 0.9)" }}>
          All prices are in INR and include applicable taxes
        </p>
      </div>
    </div>
  )
}
