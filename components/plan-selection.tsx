"use client"

import { cn } from "@/lib/utils";
import { Meal, Plan } from "@/lib/types";
import { IoCheckmarkCircle } from "react-icons/io5";

interface PlanSelectionProps {
  selectedMeal: Meal;
  selectedPlan: Plan | null;
  plans: Plan[];
  onPlanSelect: (plan: Plan) => void;
}

export function PlanSelection({ selectedMeal, selectedPlan, plans, onPlanSelect }: PlanSelectionProps) {
  return (
    <div className="py-8">
      {/* Simple Header */}
      <h2 className="text-2xl font-bold mb-6" style={{ color: "#283618" }}>
        Choose Your Plan
      </h2>

      {/* Simple Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isSelected = selectedPlan?.id === plan.id;
          const totalPrice = (selectedMeal.price * plan.durationDays).toFixed(0);
          const dailyPrice = selectedMeal.price.toFixed(0);

          return (
            <button
              key={plan.id}
              onClick={() => onPlanSelect(plan)}
              className={cn(
                "relative p-6 rounded-xl text-left transition-all",
                isSelected 
                  ? "shadow-lg scale-105" 
                  : "hover:shadow-md"
              )}
              style={{
                backgroundColor: isSelected ? "#606C38" : "#FEFAE0",
                color: isSelected ? "#FEFAE0" : "#283618",
                border: `2px solid ${isSelected ? "#606C38" : "#DDA15E"}`
              }}
            >
              {/* Check Icon */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <IoCheckmarkCircle className="w-6 h-6" style={{ color: "#FEFAE0" }} />
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-lg font-bold mb-3">{plan.name}</h3>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-black">₹{totalPrice}</span>
                <p className="text-sm mt-1 opacity-80">
                  {plan.durationDays} days • ₹{dailyPrice}/day
                </p>
              </div>

              {/* Simple Divider */}
              <div className="h-px w-full mb-4 opacity-30"
                style={{ backgroundColor: isSelected ? "#FEFAE0" : "#283618" }} />

              {/* Features */}
              <div className="space-y-2">
                <p className="text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: isSelected ? "#DDA15E" : "#606C38" }} />
                  Daily fresh delivery
                </p>
                <p className="text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: isSelected ? "#DDA15E" : "#606C38" }} />
                  Cancel anytime
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
