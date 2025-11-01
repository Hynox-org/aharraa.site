"use client"

import { Plan } from "@/lib/types"

interface QuantitySelectionProps {
  quantity: number
  selectedPlan: Plan
  onQuantityChange: (quantity: number) => void
}

export function QuantitySelection({ quantity, selectedPlan, onQuantityChange }: QuantitySelectionProps) {
  return (
    <div className="py-8">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6" style={{ color: "#283618" }}>
        Select Quantity
      </h2>

      {/* Quantity Card */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: "#FEFAE0" }}>
        {/* Quantity Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          {/* Minus Button */}
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-12 h-12 rounded-full font-bold text-xl transition-all disabled:opacity-30"
            style={{
              backgroundColor: "#DDA15E",
              color: "#FEFAE0",
              border: "2px solid #BC6C25"
            }}
          >
            -
          </button>

          {/* Quantity Display */}
          <div className="w-20 h-14 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: "#606C38",
              border: "2px solid #283618"
            }}>
            <span className="text-2xl font-bold" style={{ color: "#FEFAE0" }}>
              {quantity}
            </span>
          </div>

          {/* Plus Button */}
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="w-12 h-12 rounded-full font-bold text-xl transition-all"
            style={{
              backgroundColor: "#DDA15E",
              color: "#FEFAE0",
              border: "2px solid #BC6C25"
            }}
          >
            +
          </button>
        </div>

        {/* Info Text */}
        <p className="text-center text-sm" style={{ color: "#606C38" }}>
          You are ordering <span className="font-bold">{quantity}</span> meal plan(s) for{" "}
          <span className="font-bold">{selectedPlan.durationDays} days</span>.
        </p>
      </div>
    </div>
  )
}
