"use client"

import { cn } from "@/lib/utils";
import { Menu, Plan, MenuWithPopulatedMeals } from "@/lib/types";
import { Check, Sparkles } from "lucide-react";

interface PlanSelectionProps {
  selectedMenu: MenuWithPopulatedMeals;
  selectedPlan: Plan | null;
  plans: Plan[];
  onPlanSelect: (plan: Plan) => void;
  selectedMealTimes: string[]; // New prop
  quantity: number; // New prop
}

export function PlanSelection({ selectedMenu, selectedPlan, plans, onPlanSelect, selectedMealTimes, quantity }: PlanSelectionProps) {
  const popularPlanIndex = Math.floor(plans.length / 2);

  return (
    <div className="py-3 md:py-6 px-2 md:px-4">
      {/* Minimal Header */}
      <div className="text-center mb-4 md:mb-8">
        <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-black mb-0.5 md:mb-2">
          Choose Your Plan
        </h2>
        <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 max-w-2xl mx-auto">
          Select a subscription that works best for you
        </p>
      </div>

      {/* Floating Plans Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 lg:gap-10 max-w-6xl mx-auto">
        {plans.map((plan, index) => {
          const isSelected = selectedPlan?._id === plan._id;
          const isPopular = index === popularPlanIndex;

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

          const totalPrice = selectedMenu && plan ? (mealTimePricesSum * plan.durationDays * quantity).toFixed(0) : "0";
          const dailyPrice = selectedMenu ? (parseFloat(totalPrice) / (plan.durationDays * quantity)).toFixed(0) : "0"; // Recalculate daily price based on new total
          const savingsPercent = plan.durationDays >= 30 ? Math.round((plan.durationDays / 30) * 5) : 0;

          return (
            <button
              key={plan._id}
              onClick={() => onPlanSelect(plan)}
              className={cn(
                "relative group transition-all duration-500 ease-out py-5",
                isSelected ? "scale-[1.01] md:scale-[1.03]" : "hover:scale-[1.005] md:hover:scale-[1.01]"
              )}
            >
              {/* Glow Effect Background */}
              {isSelected && (
                <div className="absolute inset-0 bg-[#3CB371] opacity-15 md:opacity-20 rounded-full blur-lg md:blur-2xl animate-pulse" />
              )}

              {/* Floating Content */}
              <div className="relative flex flex-col items-center text-center">
                
                {/* Popular Badge */}
                {isPopular && !isSelected && (
                  <div className="absolute -top-1.5 md:-top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-0.5 md:gap-1 px-1.5 md:px-3 py-0.5 md:py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[8px] md:text-xs font-bold rounded-full shadow-md md:shadow-lg">
                      <Sparkles className="w-2 h-2 md:w-3 md:h-3" />
                      POPULAR
                    </span>
                  </div>
                )}

                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[#3CB371] rounded-full blur-sm md:blur-md opacity-60 animate-pulse" />
                      <div className="relative bg-[#3CB371] text-white rounded-full p-1 md:p-2 shadow-lg md:shadow-xl">
                        <Check className="w-2.5 h-2.5 md:w-5 md:h-5" strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Plan Icon/Visual */}
                <div className="relative mb-2 md:mb-4">
                  <div 
                    className={cn(
                      "w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center",
                      "transition-all duration-700 ease-out filter",
                      isSelected 
                        ? "bg-[#3CB371] drop-shadow-lg md:drop-shadow-2xl scale-105 md:scale-110" 
                        : "bg-gradient-to-br from-gray-100 to-gray-200 drop-shadow-md md:drop-shadow-xl group-hover:drop-shadow-lg md:group-hover:drop-shadow-2xl group-hover:scale-105"
                    )}
                  >
                    <span className={cn(
                      "text-lg sm:text-2xl md:text-4xl font-black",
                      isSelected ? "text-white" : "text-gray-700"
                    )}>
                      {plan.durationDays}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 md:-bottom-1 left-1/2 transform -translate-x-1/2 px-1.5 md:px-3 py-0.5 md:py-1 bg-white/95 backdrop-blur-sm rounded-full shadow-md md:shadow-lg">
                    <span className="text-[8px] md:text-xs font-bold text-gray-700">DAYS</span>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="space-y-0.5 md:space-y-2 px-1 md:px-4 w-full">
                  {/* Plan Name */}
                  <h3
                    className={cn(
                      "font-bold text-xs sm:text-sm md:text-xl transition-all duration-300 line-clamp-1",
                      isSelected
                        ? "text-[#3CB371]"
                        : "text-gray-800 group-hover:text-black"
                    )}
                  >
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="py-1 md:py-2">
                    <div className="flex items-baseline justify-center gap-0.5 md:gap-1">
                      <span className={cn(
                        "text-lg sm:text-xl md:text-4xl font-black",
                        isSelected ? "text-[#3CB371]" : "text-black"
                      )}>
                        ₹{totalPrice}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-1 md:gap-2 mt-0.5 md:mt-1 flex-wrap">
                      <span className={cn(
                        "text-[8px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 rounded-full",
                        isSelected 
                          ? "bg-green-100 text-green-700" 
                          : "bg-gray-100 text-gray-600"
                      )}>
                        ₹{dailyPrice}/day
                      </span>
                      {savingsPercent > 0 && (
                        <span className="text-[8px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 rounded-full bg-amber-500 text-white">
                          Save {savingsPercent}%
                        </span>
                      )}
                    </div>
                  </div>
{/* Selection Button */}
                  <div className="pt-3 md:pt-4">
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold",
                        "transition-all duration-300",
                        isSelected
                          ? "bg-[#3CB371] text-white shadow-md md:shadow-lg"
                          : "bg-transparent border-2 border-gray-200 text-gray-600 group-hover:border-gray-300 group-hover:bg-gray-50"
                      )}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={3} />
                          <span>Selected</span>
                        </>
                      ) : (
                        <span>Select</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Note - Minimal */}
      <div className="mt-4 md:mt-8 text-center px-2">
        <p className="text-[9px] md:text-xs text-gray-400 max-w-xl mx-auto">
          Auto-renews • Cancel anytime from settings
        </p>
      </div>
    </div>
  );
}
