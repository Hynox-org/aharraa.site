"use client"

import { cn } from "@/lib/utils";
import { Menu, Plan, MenuWithPopulatedMeals } from "@/lib/types";
import { Check, Sparkles } from "lucide-react";

interface PlanSelectionProps {
  selectedMenu: MenuWithPopulatedMeals;
  selectedPlan: Plan | null;
  plans: Plan[];
  onPlanSelect: (plan: Plan) => void;
}

export function PlanSelection({ selectedMenu, selectedPlan, plans, onPlanSelect }: PlanSelectionProps) {
  const popularPlanIndex = Math.floor(plans.length / 2);

  return (
    <div className="py-4 md:py-6 px-4">
      {/* Minimal Header */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
          Choose Your Plan
        </h2>
        <p className="text-xs md:text-sm text-gray-500 max-w-2xl mx-auto">
          Select a subscription that works best for you
        </p>
      </div>

      {/* Floating Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 max-w-6xl mx-auto">
        {plans.map((plan, index) => {
          const isSelected = selectedPlan?._id === plan._id;
          const isPopular = index === popularPlanIndex;
          const totalPrice = (selectedMenu.perDayPrice * plan.durationDays).toFixed(0);
          const dailyPrice = selectedMenu.perDayPrice.toFixed(0);
          const savingsPercent = plan.durationDays >= 30 ? Math.round((plan.durationDays / 30) * 5) : 0;

          return (
            <button
              key={plan._id}
              onClick={() => onPlanSelect(plan)}
              className={cn(
                "relative group transition-all duration-500 ease-out",
                isSelected ? "scale-[1.03]" : "hover:scale-[1.01]"
              )}
            >
              {/* Glow Effect Background */}
              {isSelected && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full blur-2xl opacity-60 animate-pulse" />
              )}

              {/* Floating Content */}
              <div className="relative flex flex-col items-center text-center">
                
                {/* Popular Badge */}
                {isPopular && !isSelected && (
                  <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 md:px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] md:text-xs font-bold rounded-full shadow-lg">
                      <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3" />
                      POPULAR
                    </span>
                  </div>
                )}

                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 z-20">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-60 animate-pulse" />
                      <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full p-1.5 md:p-2 shadow-xl">
                        <Check className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Plan Icon/Visual */}
                <div className="relative mb-3 md:mb-4">
                  <div 
                    className={cn(
                      "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center",
                      "transition-all duration-700 ease-out filter",
                      isSelected 
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 drop-shadow-2xl scale-110" 
                        : "bg-gradient-to-br from-gray-100 to-gray-200 drop-shadow-xl group-hover:drop-shadow-2xl group-hover:scale-105"
                    )}
                  >
                    <span className={cn(
                      "text-2xl sm:text-3xl md:text-4xl font-black",
                      isSelected ? "text-white" : "text-gray-700"
                    )}>
                      {plan.durationDays}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-2.5 md:px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                    <span className="text-[10px] md:text-xs font-bold text-gray-700">DAYS</span>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="space-y-1 md:space-y-2 px-2 md:px-4 w-full">
                  {/* Plan Name */}
                  <h3
                    className={cn(
                      "font-bold text-base sm:text-lg md:text-xl transition-all duration-300",
                      isSelected
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700"
                        : "text-gray-800 group-hover:text-gray-900"
                    )}
                  >
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="py-2">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className={cn(
                        "text-2xl sm:text-3xl md:text-4xl font-black",
                        isSelected ? "text-emerald-600" : "text-gray-900"
                      )}>
                        ₹{totalPrice}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
                      <span className={cn(
                        "text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full",
                        isSelected 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-gray-100 text-gray-600"
                      )}>
                        ₹{dailyPrice}/day
                      </span>
                      {savingsPercent > 0 && (
                        <span className="text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                          Save {savingsPercent}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features - Simplified */}
                  <div className="space-y-1.5 md:space-y-2 pt-2 md:pt-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className={cn(
                        "w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center",
                        isSelected ? "bg-emerald-500" : "bg-gray-400"
                      )}>
                        <Check className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" strokeWidth={3} />
                      </div>
                      <p className={cn(
                        "text-[10px] md:text-xs font-medium",
                        isSelected ? "text-teal-600" : "text-gray-600"
                      )}>
                        Daily fresh delivery
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-1.5">
                      <div className={cn(
                        "w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center",
                        isSelected ? "bg-emerald-500" : "bg-gray-400"
                      )}>
                        <Check className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" strokeWidth={3} />
                      </div>
                      <p className={cn(
                        "text-[10px] md:text-xs font-medium",
                        isSelected ? "text-teal-600" : "text-gray-600"
                      )}>
                        Cancel anytime
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-1.5">
                      <div className={cn(
                        "w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center",
                        isSelected ? "bg-emerald-500" : "bg-gray-400"
                      )}>
                        <Check className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" strokeWidth={3} />
                      </div>
                      <p className={cn(
                        "text-[10px] md:text-xs font-medium",
                        isSelected ? "text-teal-600" : "text-gray-600"
                      )}>
                        Full menu included
                      </p>
                    </div>
                  </div>

                  {/* Selection Button */}
                  <div className="pt-3 md:pt-4">
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold",
                        "transition-all duration-300",
                        isSelected
                          ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white shadow-md md:shadow-lg shadow-emerald-200"
                          : "bg-transparent border-2 border-gray-200 text-gray-600 group-hover:border-gray-300 group-hover:bg-gray-50"
                      )}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={3} />
                          <span>Selected</span>
                        </>
                      ) : (
                        <span>Select Plan</span>
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
      <div className="mt-6 md:mt-8 text-center">
        <p className="text-[10px] md:text-xs text-gray-400 max-w-xl mx-auto">
          Auto-renews • Cancel anytime from settings
        </p>
      </div>
    </div>
  );
}
