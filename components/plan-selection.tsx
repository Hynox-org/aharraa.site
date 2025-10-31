"use client"

import { useStore } from "@/lib/store"
import { SubscriptionPlan, MealType } from "@/lib/types"
import { VENDOR_MENUS } from "@/lib/menu-data" // Import VENDOR_MENUS
import { Check } from "lucide-react"

const plans: Omit<SubscriptionPlan, 'selectedBasePrice'>[] = [
  {
    id: "daily",
    name: "Daily Plan",
    duration: "daily",
    daysCount: 1,
    pricePerDay: 299, // This might become less relevant if prices are dynamic
    vegTotalPrice: 255, // 3 meals * avg 85 per veg meal
    nonVegTotalPrice: 275, // 3 meals * avg 91.67 per non-veg meal
    planType: "veg", // Defaulting to veg for plan type
  },
  {
    id: "weekly",
    name: "Weekly Plan",
    duration: "weekly",
    daysCount: 7,
    pricePerDay: 249, // This might become less relevant if prices are dynamic
    vegTotalPrice: 1785, // 7 days * 255 daily veg
    nonVegTotalPrice: 1925, // 7 days * 275 daily non-veg
    planType: "veg", // Defaulting to veg for plan type
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    duration: "monthly",
    daysCount: 30,
    pricePerDay: 199, // This might become less relevant if prices are dynamic
    vegTotalPrice: 7650, // 30 days * 255 daily veg
    nonVegTotalPrice: 8250, // 30 days * 275 daily non-veg
    planType: "veg", // Defaulting to veg for plan type
  },
]

export function PlanSelection() {
  const selectedPlan = useStore((state) => state.selectedPlan)
  const setSelectedPlan = useStore((state) => state.setSelectedPlan)

  // Assuming a default vendor for displaying meal type pricing in plan selection
  const defaultVendorMenu = VENDOR_MENUS.find(menu => menu.vendorId === "v1");
  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

  const handleSelectPlan = (plan: Omit<SubscriptionPlan, 'selectedBasePrice'>) => {
    // When a plan is selected, set its selectedBasePrice to vegTotalPrice by default
    const planWithBasePrice: SubscriptionPlan = {
      ...plan,
      selectedBasePrice: plan.vegTotalPrice, // Default to veg price
    };
    setSelectedPlan(planWithBasePrice);
  };

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-neutral-900 mb-2">Choose Your Plan</h2>
      <p className="text-neutral-600 mb-8">Select a subscription plan that works best for you</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => handleSelectPlan(plan)}
            className={`relative p-6 rounded-xl border-2 transition-all text-left ${
              selectedPlan?.id === plan.id
                ? "border-orange-500 bg-orange-50"
                : "border-neutral-200 bg-white hover:border-orange-300"
            }`}
          >
            {selectedPlan?.id === plan.id && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white rounded-full p-1">
                <Check size={20} />
              </div>
            )}

            <h3 className="text-xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
            <p className="text-sm text-neutral-600 mb-4">{plan.daysCount} days of meals</p>

            <div className="mb-4">
              <p className="text-3xl font-bold text-orange-500">₹{plan.vegTotalPrice}</p>
              <p className="text-sm text-neutral-600">
                Starting from ₹{plan.pricePerDay}/day (Veg)
              </p>
              <p className="text-sm text-neutral-600">
                Non-Veg from ₹{plan.nonVegTotalPrice}
              </p>
            </div>

            {defaultVendorMenu && (
              <div className="mt-6 pt-4 border-t border-neutral-200">
                <h4 className="font-semibold text-neutral-800 mb-2">Meal Type Breakdown (per day):</h4>
                <ul className="space-y-1 text-sm text-neutral-700">
                  {mealTypes.map((mealType) => (
                    <li key={mealType} className="flex justify-between">
                      <span className="capitalize">{mealType}:</span>
                      <span>
                        Veg: ₹{defaultVendorMenu.mealTypePricing[mealType].veg} / Non-Veg: ₹{defaultVendorMenu.mealTypePricing[mealType].nonVeg}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <ul className="space-y-2 text-sm text-neutral-700 mt-6">
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Fresh meals daily
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Free delivery
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Flexible menu
              </li>
            </ul>
          </button>
        ))}
      </div>
    </div>
  )
}
