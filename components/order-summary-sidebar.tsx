"use client"

import { IoCart, IoCheckmarkCircle } from "react-icons/io5"
import { GiMeal } from "react-icons/gi"
import { Menu, Plan, MenuWithPopulatedMeals } from "@/lib/types"
import { format } from "date-fns"
import { Spinner } from "./ui/spinner"

interface OrderSummarySidebarProps {
  selectedMenu: MenuWithPopulatedMeals | null
  selectedPlan: Plan | null
  quantity: number
  startDate: Date | undefined
  endDate: Date | undefined
  onAddToCart: () => void
  isAddingToCart: boolean
  onDirectCheckout: () => void; // New prop for direct checkout
  isDirectCheckingOut: boolean; // New prop for direct checkout loading state
  selectedMealTimes: string[]
}

export function OrderSummarySidebar({
  selectedMenu,
  selectedPlan,
  quantity,
  startDate,
  endDate,
  onAddToCart,
  isAddingToCart,
  onDirectCheckout, // Destructure new prop
  isDirectCheckingOut, // Destructure new prop
  selectedMealTimes,
}: OrderSummarySidebarProps) {
  let mealTimePricesSum = 0;
  if (selectedMenu && selectedMealTimes && selectedMealTimes.length > 0 && selectedMenu.price) {
    selectedMealTimes.forEach(mealTime => {
      if (selectedMenu.price[mealTime.toLowerCase()]) {
        mealTimePricesSum += selectedMenu.price[mealTime.toLowerCase()]!;
      }
    });
  } else if (selectedMenu) {
    mealTimePricesSum = selectedMenu.perDayPrice;
  }

  const totalAmount = selectedMenu && selectedPlan ? mealTimePricesSum * selectedPlan.durationDays * quantity : 0
  const isComplete = selectedMenu && selectedPlan && startDate && endDate && quantity >= 1 && selectedMealTimes.length > 0

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
        {!selectedMenu ? (
          <div className="text-center py-12">
            <GiMeal className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: "#FEFAE0" }} />
            <p className="text-sm" style={{ color: "rgba(254, 250, 224, 0.6)" }}>
              Select a menu to begin
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Menu */}
            <div>
              <p className="text-xs font-bold mb-2 uppercase" style={{ color: "#DDA15E" }}>
                Menu
              </p>
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "rgba(254, 250, 224, 0.1)" }}>
                {selectedMenu.coverImage && (
                  <img
                    src={selectedMenu.coverImage}
                    alt={selectedMenu.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{ color: "#FEFAE0" }}>
                    {selectedMenu.name}
                  </p>
                  <p className="text-xs" style={{ color: "#DDA15E" }}>
                    ₹{selectedMenu.perDayPrice}/day
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
                    {selectedPlan.durationDays} days • ₹{selectedMenu.perDayPrice.toFixed(0)}/day
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
                    {/* Direct Checkout Button */}
                    <button
                      onClick={onDirectCheckout}
                      disabled={!isComplete || isDirectCheckingOut || isAddingToCart}
                      className="w-full py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: "#DDA15E", // Different color for direct checkout
                        color: "#283618"
                      }}
                    >
                      {isDirectCheckingOut ? (
                        <Spinner className="w-4 h-4 text-white" />
                      ) : (
                        <>
                          <IoCheckmarkCircle className="w-4 h-4" />
                          Direct Checkout
                        </>
                      )}
                    </button>

                    {/* Add to Cart Button */}
                    <button
                      onClick={onAddToCart}
                      disabled={!isComplete || isAddingToCart || isDirectCheckingOut}
                      className="w-full py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: "#606C38",
                        color: "#FEFAE0"
                      }}
                    >
                      {isAddingToCart ? (
                        <Spinner className="w-4 h-4 text-white" />
                      ) : (
                        <>
                          <IoCart className="w-4 h-4" />
                          Add to Cart
                        </>
                      )}
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
