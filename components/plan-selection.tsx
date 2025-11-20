"use client"

import { cn } from "@/lib/utils";
import { Menu, Plan } from "@/lib/types";
import { Check, Calendar, Sparkles, RotateCcw } from "lucide-react";

interface PlanSelectionProps {
  selectedMenu: Menu;
  selectedPlan: Plan | null;
  plans: Plan[];
  onPlanSelect: (plan: Plan) => void;
}

export function PlanSelection({ selectedMenu, selectedPlan, plans, onPlanSelect }: PlanSelectionProps) {
  // Find the most popular plan (you can customize this logic)
  const popularPlanIndex = Math.floor(plans.length / 2);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#283618] mb-2">
          Choose Your Perfect Plan
        </h2>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">
          Select a subscription plan that works best for you. All plans include daily fresh delivery and flexible cancellation.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
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
                "relative p-6 rounded-2xl text-left transition-all duration-200",
                "border-2 hover:shadow-lg hover:-translate-y-1",
                isSelected
                  ? "bg-[#606C38] border-[#606C38] text-white shadow-xl scale-[1.02]"
                  : "bg-[#FEFAE0] border-[#DDA15E] text-[#283618] hover:border-[#BC6C25]",
                isPopular && !isSelected && "ring-2 ring-[#DDA15E] ring-offset-2"
              )}
            >
              {/* Popular Badge */}
              {isPopular && !isSelected && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#DDA15E] text-white text-xs font-bold rounded-full shadow-md">
                    <Sparkles className="w-3 h-3" />
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-7 h-7 bg-[#DDA15E] rounded-full flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
              )}

              {/* Plan Name */}
              <div className="mb-4">
                <h3 className={cn(
                  "text-xl font-bold mb-1",
                  isSelected ? "text-white" : "text-[#283618]"
                )}>
                  {plan.name}
                </h3>
                <p className={cn(
                  "text-xs",
                  isSelected ? "text-white/80" : "text-gray-600"
                )}>
                  {plan.durationDays} days subscription
                </p>
              </div>

              {/* Price Section */}
              <div className="mb-5">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={cn(
                    "text-4xl font-black",
                    isSelected ? "text-white" : "text-[#283618]"
                  )}>
                    ₹{totalPrice}
                  </span>
                  <span className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-white/70" : "text-gray-500"
                  )}>
                    total
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "text-sm font-medium px-2 py-0.5 rounded-full",
                    isSelected 
                      ? "bg-white/20 text-white" 
                      : "bg-[#DDA15E]/20 text-[#BC6C25]"
                  )}>
                    ₹{dailyPrice}/day
                  </span>
                  {savingsPercent > 0 && (
                    <span className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-full",
                      isSelected 
                        ? "bg-[#DDA15E] text-white" 
                        : "bg-[#606C38] text-white"
                    )}>
                      Save {savingsPercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className={cn(
                "h-px w-full mb-5",
                isSelected ? "bg-white/30" : "bg-[#DDA15E]/30"
              )} />

              {/* Features List */}
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    isSelected ? "bg-[#DDA15E]" : "bg-[#606C38]"
                  )}>
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-white" : "text-[#283618]"
                    )}>
                      Daily fresh delivery
                    </p>
                    <p className={cn(
                      "text-xs",
                      isSelected ? "text-white/70" : "text-gray-600"
                    )}>
                      Delivered at your preferred time
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    isSelected ? "bg-[#DDA15E]" : "bg-[#606C38]"
                  )}>
                    <RotateCcw className="w-3 h-3 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-white" : "text-[#283618]"
                    )}>
                      Cancel anytime
                    </p>
                    <p className={cn(
                      "text-xs",
                      isSelected ? "text-white/70" : "text-gray-600"
                    )}>
                      No long-term commitment
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    isSelected ? "bg-[#DDA15E]" : "bg-[#606C38]"
                  )}>
                    <Calendar className="w-3 h-3 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-white" : "text-[#283618]"
                    )}>
                      {plan.durationDays} days meal plan
                    </p>
                    <p className={cn(
                      "text-xs",
                      isSelected ? "text-white/70" : "text-gray-600"
                    )}>
                      Full weekly menu included
                    </p>
                  </div>
                </div>
              </div>

              {/* Selection Prompt */}
              {isSelected ? (
                <div className="mt-5 pt-4 border-t border-white/20">
                  <p className="text-xs text-white/90 text-center font-medium">
                    ✓ Currently selected
                  </p>
                </div>
              ) : (
                <div className="mt-5 pt-4 border-t border-[#DDA15E]/30">
                  <p className="text-xs text-gray-600 text-center font-medium">
                    Click to select this plan
                  </p>
                </div>
              )}

              {/* Hover Gradient Overlay */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br from-transparent to-black/5 rounded-2xl opacity-0 transition-opacity duration-200 pointer-events-none",
                "group-hover:opacity-100"
              )} />
            </button>
          );
        })}
      </div>

      {/* Bottom Note */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 max-w-xl mx-auto">
          All plans automatically renew. You can change or cancel your subscription at any time from your account settings.
        </p>
      </div>
    </div>
  );
}
