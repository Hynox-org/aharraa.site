"use client"

import { useStore, type SubscriptionPlan } from "@/lib/store"
import { Check } from "lucide-react"

const plans: SubscriptionPlan[] = [
  {
    id: "daily",
    name: "Daily Plan",
    duration: "daily",
    daysCount: 1,
    pricePerDay: 299,
    totalPrice: 299,
  },
  {
    id: "weekly",
    name: "Weekly Plan",
    duration: "weekly",
    daysCount: 7,
    pricePerDay: 249,
    totalPrice: 1743,
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    duration: "monthly",
    daysCount: 30,
    pricePerDay: 199,
    totalPrice: 5970,
  },
]

export function PlanSelection() {
  const selectedPlan = useStore((state) => state.selectedPlan)
  const setSelectedPlan = useStore((state) => state.setSelectedPlan)

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-neutral-900 mb-2">Choose Your Plan</h2>
      <p className="text-neutral-600 mb-8">Select a subscription plan that works best for you</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelectedPlan(plan)}
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
              <p className="text-3xl font-bold text-orange-500">₹{plan.totalPrice}</p>
              <p className="text-sm text-neutral-600">₹{plan.pricePerDay}/day</p>
            </div>

            <ul className="space-y-2 text-sm text-neutral-700">
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
