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
  onDirectCheckout: () => void
  isDirectCheckingOut: boolean
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
  onDirectCheckout,
  isDirectCheckingOut,
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
    <div className="sticky top-24">
      <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-lg border border-gray-100">
        {/* Header */}
        <div className="flex items-center gap-2 md:gap-3 mb-5 md:mb-6 pb-4 md:pb-5 border-b border-gray-100">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#3CB371] flex items-center justify-center shadow-md">
            <IoCart className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-black">
              Your Order
            </h3>
            <p className="text-xs text-gray-500">Review your selection</p>
          </div>
        </div>

        {/* Content */}
        {!selectedMenu ? (
          <div className="text-center py-12 md:py-16">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <GiMeal className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
            </div>
            <p className="text-sm text-gray-400">
              Select a menu to begin
            </p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-5">
            {/* Menu */}
            <div>
              <p className="text-[10px] md:text-xs font-bold mb-2 uppercase tracking-wide text-gray-500">
                Menu
              </p>
              <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-gray-50 border border-gray-100">
                {selectedMenu.coverImage && (
                  <img
                    src={selectedMenu.coverImage}
                    alt={selectedMenu.name}
                    className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-lg shadow-sm"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm md:text-base text-black truncate">
                    {selectedMenu.name}
                  </p>
                  <p className="text-xs md:text-sm font-semibold text-[#3CB371]">
                    ₹{selectedMenu.perDayPrice}/day
                  </p>
                </div>
              </div>
            </div>

            {/* Plan */}
            {selectedPlan && (
              <div>
                <p className="text-[10px] md:text-xs font-bold mb-2 uppercase tracking-wide text-gray-500">
                  Plan
                </p>
                <div className="p-3 md:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="font-bold text-sm md:text-base text-black">
                    {selectedPlan.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 font-semibold">
                    {selectedPlan.durationDays} days
                  </p>
                </div>
              </div>
            )}

            {/* Meal Times */}
            {selectedMealTimes.length > 0 && (
              <div>
                <p className="text-[10px] md:text-xs font-bold mb-2 uppercase tracking-wide text-gray-500">
                  Meal Times
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedMealTimes.map((mealTime) => (
                    <span 
                      key={mealTime}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-xs md:text-sm font-semibold text-gray-700"
                    >
                      {mealTime}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            {selectedPlan && quantity > 0 && (
              <div>
                <p className="text-[10px] md:text-xs font-bold mb-2 uppercase tracking-wide text-gray-500">
                  Quantity
                </p>
                <div className="p-3 md:p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="font-bold text-sm md:text-base text-black">
                    {quantity} meal plan{quantity !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 font-semibold">
                    Total meals: {quantity * selectedPlan.durationDays}
                  </p>
                </div>
              </div>
            )}

            {/* Dates */}
            {startDate && endDate && (
              <div>
                <p className="text-[10px] md:text-xs font-bold mb-2 uppercase tracking-wide text-gray-500">
                  Delivery Period
                </p>
                <div className="p-3 md:p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-gray-600 font-medium">Start</span>
                    <span className="font-bold text-black">
                      {format(startDate, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs md:text-sm">
                    <span className="text-gray-600 font-medium">End</span>
                    <span className="font-bold text-black">
                      {format(endDate, "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Total */}
            {selectedPlan && (
              <>
                <div className="pt-4 md:pt-5 mt-4 md:mt-5 border-t-2 border-gray-100">
                  <div className="flex justify-between items-baseline mb-5 md:mb-6">
                    <span className="text-sm md:text-base font-bold text-gray-600">
                      Total Amount
                    </span>
                    <span className="text-3xl md:text-4xl font-black text-black">
                      ₹{totalAmount.toFixed(0)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* Direct Checkout Button */}
                    <button
                      onClick={onDirectCheckout}
                      disabled={!isComplete || isDirectCheckingOut || isAddingToCart}
                      className="w-full py-3 md:py-3.5 rounded-xl font-bold text-sm md:text-base
                               bg-[#3CB371] hover:bg-[#2FA05E] text-white
                               shadow-lg hover:shadow-xl
                               disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                               transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isDirectCheckingOut ? (
                        <Spinner className="w-5 h-5 text-white" />
                      ) : (
                        <>
                          <IoCheckmarkCircle className="w-5 h-5" />
                          <span>Checkout Now</span>
                        </>
                      )}
                    </button>

                    {/* Add to Cart Button */}
                    <button
                      onClick={onAddToCart}
                      disabled={!isComplete || isAddingToCart || isDirectCheckingOut}
                      className="w-full py-3 md:py-3.5 rounded-xl font-semibold text-sm md:text-base
                               bg-white text-gray-700 border-2 border-gray-200
                               hover:bg-gray-50 hover:border-gray-300
                               disabled:opacity-40 disabled:cursor-not-allowed
                               transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {isAddingToCart ? (
                        <Spinner className="w-5 h-5 text-gray-600" />
                      ) : (
                        <>
                          <IoCart className="w-5 h-5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Features - Minimal Pills */}
                <div className="flex flex-wrap gap-2 pt-4 md:pt-5">
                  {["Fresh daily", "Cancel anytime", "Money-back"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                      <IoCheckmarkCircle className="w-3.5 h-3.5 text-[#3CB371] flex-shrink-0" />
                      <span className="text-[10px] md:text-xs text-gray-600 font-medium">{feature}</span>
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
