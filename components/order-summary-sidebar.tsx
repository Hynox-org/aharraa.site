"use client"

import { IoCart, IoCheckmarkCircle } from "react-icons/io5"
import { GiMeal } from "react-icons/gi"
import { Meal, Plan } from "@/lib/types"
import { format } from "date-fns"

interface OrderSummarySidebarProps {
  selectedMeal: Meal | null
  selectedPlan: Plan | null
  quantity: number
  startDate: Date | undefined
  endDate: Date | undefined
  onAddToCart: () => void
  onCheckout: () => void
}

export function OrderSummarySidebar({
  selectedMeal,
  selectedPlan,
  quantity,
  startDate,
  endDate,
  onAddToCart,
  onCheckout,
}: OrderSummarySidebarProps) {
  const totalAmount = selectedMeal && selectedPlan ? selectedMeal.price * selectedPlan.durationDays * quantity : 0
  const isComplete = selectedMeal && selectedPlan && startDate && endDate && quantity >= 1

  return (
    <div className="sticky top-6">
      <div className="rounded-xl p-6 shadow-lg" style={{ backgroundColor: "#283618" }}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <IoCart className="w-6 h-6" style={{ color: "#FEFAE0" }} />
          <h3 className="text-xl font-bold" style={{ color: "#FEFAE0" }}>
            Your Order
          </h3>
        </div>

        {/* Content */}
        {!selectedMeal ? (
          <div className="text-center py-12">
            <GiMeal className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: "#FEFAE0" }} />
            <p className="text-sm" style={{ color: "rgba(254, 250, 224, 0.6)" }}>
              Select a meal to begin
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Meal */}
            <div>
              <p className="text-xs font-bold mb-2 uppercase" style={{ color: "#DDA15E" }}>
                Meal
              </p>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "rgba(254, 250, 224, 0.1)" }}>
                <img
                  src={selectedMeal.image}
                  alt={selectedMeal.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: "#FEFAE0" }}>
                    {selectedMeal.name}
                  </p>
                  <p className="text-xs" style={{ color: "#DDA15E" }}>
                    ₹{selectedMeal.price}/meal
                  </p>
                </div>
              </div>
            </div>

            {/* Plan */}
            {selectedPlan && (
              <div>
                <p className="text-xs font-bold mb-2 uppercase" style={{ color: "#DDA15E" }}>
                  Plan
                </p>
                <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(254, 250, 224, 0.1)" }}>
                  <p className="font-bold" style={{ color: "#FEFAE0" }}>
                    {selectedPlan.name}
                  </p>
                  <p className="text-xs" style={{ color: "#DDA15E" }}>
                    {selectedPlan.durationDays} days • ₹{selectedMeal.price.toFixed(0)}/day
                  </p>
                </div>
              </div>
            )}

            {/* Quantity */}
            {selectedPlan && quantity > 0 && (
              <div>
                <p className="text-xs font-bold mb-2 uppercase" style={{ color: "#DDA15E" }}>
                  Quantity
                </p>
                <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(254, 250, 224, 0.1)" }}>
                  <p className="font-bold" style={{ color: "#FEFAE0" }}>
                    {quantity} meal plan(s)
                  </p>
                  <p className="text-xs" style={{ color: "#DDA15E" }}>
                    Total meals: {quantity * selectedPlan.durationDays}
                  </p>
                </div>
              </div>
            )}

            {/* Dates */}
            {startDate && endDate && (
              <div>
                <p className="text-xs font-bold mb-2 uppercase" style={{ color: "#DDA15E" }}>
                  Dates
                </p>
                <div className="p-3 rounded-lg space-y-1" style={{ backgroundColor: "rgba(254, 250, 224, 0.1)" }}>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "#DDA15E" }}>Start</span>
                    <span className="font-bold" style={{ color: "#FEFAE0" }}>
                      {format(startDate, "MMM d")}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "#DDA15E" }}>End</span>
                    <span className="font-bold" style={{ color: "#FEFAE0" }}>
                      {format(endDate, "MMM d")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Total */}
            {selectedPlan && (
              <>
                <div className="pt-4 mt-4" style={{ borderTop: "1px solid rgba(221, 161, 94, 0.3)" }}>
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-sm font-bold" style={{ color: "#DDA15E" }}>
                      Total Amount
                    </span>
                    <span className="text-3xl font-bold" style={{ color: "#FEFAE0" }}>
                      ₹{totalAmount.toFixed(0)}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={onAddToCart}
                      disabled={!isComplete}
                      className="w-full py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: "#606C38",
                        color: "#FEFAE0"
                      }}
                    >
                      <IoCart className="w-4 h-4" />
                      Add to Cart
                    </button>

                    <button
                      onClick={onCheckout}
                      disabled={!isComplete}
                      className="w-full py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: "#DDA15E",
                        color: "#283618"
                      }}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 pt-4">
                  {["Freshly prepared daily", "Cancel anytime", "Money-back guarantee"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "#DDA15E" }}>
                      <IoCheckmarkCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
