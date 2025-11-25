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
    <div className="lg:sticky lg:top-24">
      <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-3 md:p-5 lg:p-6 shadow-lg border border-gray-100">
        {/* Header */}
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-5 lg:mb-6 pb-3 md:pb-4 lg:pb-5 border-b border-gray-100">
          <div className="w-9 h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-[#3CB371] flex items-center justify-center shadow-md">
            <IoCart className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-black">
              Your Order
            </h3>
            <p className="text-[10px] md:text-xs text-gray-500">Review your selection</p>
          </div>
        </div>

        {/* Content */}
        {!selectedMenu ? (
          <div className="text-center py-8 md:py-12 lg:py-16">
            <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto mb-3 md:mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <GiMeal className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-gray-400" />
            </div>
            <p className="text-xs md:text-sm text-gray-400">
              Select a menu to begin
            </p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4 lg:space-y-5">
            {/* Menu */}
            <div>
              <p className="text-[9px] md:text-[10px] lg:text-xs font-bold mb-1.5 md:mb-2 uppercase tracking-wide text-gray-500">
                Menu
              </p>
              <div className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 lg:p-4 rounded-lg md:rounded-xl bg-gray-50 border border-gray-100">
                {selectedMenu.coverImage && (
                  <img
                    src={selectedMenu.coverImage}
                    alt={selectedMenu.name}
                    className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-cover rounded-md md:rounded-lg shadow-sm"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs md:text-sm lg:text-base text-black truncate">
                    {selectedMenu.name}
                  </p>
                  <p className="text-[10px] md:text-xs lg:text-sm font-semibold text-[#3CB371]">
                    ₹{selectedMenu.perDayPrice}/day
                  </p>
                </div>
              </div>
            </div>

            {/* Plan */}
            {selectedPlan && (
              <div>
                <p className="text-[9px] md:text-[10px] lg:text-xs font-bold mb-1.5 md:mb-2 uppercase tracking-wide text-gray-500">
                  Plan
                </p>
                <div className="p-2.5 md:p-3 lg:p-4 rounded-lg md:rounded-xl bg-gray-50 border border-gray-100">
                  <p className="font-bold text-xs md:text-sm lg:text-base text-black">
                    {selectedPlan.name}
                  </p>
                  <p className="text-[10px] md:text-xs lg:text-sm text-gray-600 font-semibold">
                    {selectedPlan.durationDays} days
                  </p>
                </div>
              </div>
            )}

            {/* Meal Times */}
            {selectedMealTimes.length > 0 && (
              <div>
                <p className="text-[9px] md:text-[10px] lg:text-xs font-bold mb-1.5 md:mb-2 uppercase tracking-wide text-gray-500">
                  Meal Times
                </p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {selectedMealTimes.map((mealTime) => (
                    <span 
                      key={mealTime}
                      className="px-2 py-1 md:px-3 md:py-1.5 bg-gray-50 border border-gray-100 rounded-full text-[10px] md:text-xs lg:text-sm font-semibold text-gray-700"
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
                <p className="text-[9px] md:text-[10px] lg:text-xs font-bold mb-1.5 md:mb-2 uppercase tracking-wide text-gray-500">
                  Quantity
                </p>
                <div className="p-2.5 md:p-3 lg:p-4 rounded-lg md:rounded-xl bg-gray-50 border border-gray-100">
                  <p className="font-bold text-xs md:text-sm lg:text-base text-black">
                    {quantity} meal plan{quantity !== 1 ? 's' : ''}
                  </p>
                  <p className="text-[10px] md:text-xs lg:text-sm text-gray-600 font-semibold">
                    Total meals: {quantity * selectedPlan.durationDays}
                  </p>
                </div>
              </div>
            )}

            {/* Dates */}
            {startDate && endDate && (
              <div>
                <p className="text-[9px] md:text-[10px] lg:text-xs font-bold mb-1.5 md:mb-2 uppercase tracking-wide text-gray-500">
                  Delivery Period
                </p>
                <div className="p-2.5 md:p-3 lg:p-4 rounded-lg md:rounded-xl bg-gray-50 border border-gray-100 space-y-1.5 md:space-y-2">
                  <div className="flex justify-between items-center text-[10px] md:text-xs lg:text-sm">
                    <span className="text-gray-600 font-medium">Start</span>
                    <span className="font-bold text-black">
                      {format(startDate, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] md:text-xs lg:text-sm">
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
                <div className="pt-3 md:pt-4 lg:pt-5 mt-3 md:mt-4 lg:mt-5 border-t-2 border-gray-100">
                  <div className="flex justify-between items-baseline mb-3 md:mb-5 lg:mb-6">
                    <span className="text-xs md:text-sm lg:text-base font-bold text-gray-600">
                      Total Amount
                    </span>
                    <span className="text-2xl md:text-3xl lg:text-4xl font-black text-black">
                      ₹{totalAmount.toFixed(0)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 md:space-y-3">
                    {/* Direct Checkout Button */}
                    {/* <button
                      onClick={onDirectCheckout}
                      disabled={!isComplete || isDirectCheckingOut || isAddingToCart}
                      className="w-full py-2.5 md:py-3 lg:py-3.5 rounded-lg md:rounded-xl font-bold text-xs md:text-sm lg:text-base
                               bg-[#3CB371] hover:bg-[#2FA05E] text-white
                               shadow-lg hover:shadow-xl
                               disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                               transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2"
                    >
                      {isDirectCheckingOut ? (
                        <Spinner className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      ) : (
                        <>
                          <IoCheckmarkCircle className="w-4 h-4 md:w-5 md:h-5" />
                          <span>Checkout Now</span>
                        </>
                      )}
                    </button> */}

                    {/* Add to Cart Button */}
                    <button
                      onClick={onAddToCart}
                      disabled={!isComplete || isAddingToCart || isDirectCheckingOut}
                      className="w-full py-2.5 md:py-3 lg:py-3.5 rounded-lg md:rounded-xl font-bold text-xs md:text-sm lg:text-base
                               bg-[#3CB371] hover:bg-[#2FA05E] text-white
                               shadow-lg hover:shadow-xl
                               disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                               transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2"
                    >
                      {isAddingToCart ? (
                        <Spinner className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                      ) : (
                        <>
                          <IoCart className="w-4 h-4 md:w-5 md:h-5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Features - Minimal Pills */}
                <div className="flex flex-wrap gap-1.5 md:gap-2 pt-3 md:pt-4 lg:pt-5">
                  {["Fresh daily", "Cancel anytime", "Money-back"].map((feature, i) => (
                    <div key={i} className="flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-gray-50 rounded-full border border-gray-100">
                      <IoCheckmarkCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#3CB371] flex-shrink-0" />
                      <span className="text-[9px] md:text-[10px] lg:text-xs text-gray-600 font-medium">{feature}</span>
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
