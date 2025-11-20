"use client"

import { Plan } from "@/lib/types"
import { Minus, Plus, Users, Calendar, ShoppingCart } from "lucide-react"

interface QuantitySelectionProps {
  quantity: number
  selectedPlan: Plan
  onQuantityChange: (quantity: number) => void
}

export function QuantitySelection({ quantity, selectedPlan, onQuantityChange }: QuantitySelectionProps) {
  const totalMeals = quantity * selectedPlan.durationDays;
  const isMinQuantity = quantity <= 1;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#283618] mb-2">
          Select Quantity
        </h2>
        <p className="text-sm text-gray-600">
          How many meal plans would you like to order?
        </p>
      </div>

      {/* Main Quantity Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#FEFAE0] rounded-2xl border-2 border-[#DDA15E] p-6 sm:p-8 shadow-sm">
          {/* Quantity Controls */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6">
            {/* Minus Button */}
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={isMinQuantity}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#DDA15E] border-2 border-[#BC6C25] 
                         text-white font-bold text-2xl transition-all duration-200
                         hover:bg-[#BC6C25] hover:scale-110 active:scale-95
                         disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#DDA15E]
                         flex items-center justify-center shadow-md"
              aria-label="Decrease quantity"
            >
              <Minus className="w-6 h-6" strokeWidth={3} />
            </button>

            {/* Quantity Display */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-20 sm:w-28 sm:h-24 rounded-xl bg-[#606C38] border-2 border-[#283618] 
                             flex items-center justify-center shadow-lg">
                <span className="text-4xl sm:text-5xl font-black text-[#FEFAE0]">
                  {quantity}
                </span>
              </div>
              <span className="text-xs font-medium text-[#606C38]">
                meal plan{quantity !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Plus Button */}
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#DDA15E] border-2 border-[#BC6C25] 
                         text-white font-bold text-2xl transition-all duration-200
                         hover:bg-[#BC6C25] hover:scale-110 active:scale-95
                         flex items-center justify-center shadow-md"
              aria-label="Increase quantity"
            >
              <Plus className="w-6 h-6" strokeWidth={3} />
            </button>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#DDA15E]/30 mb-6" />

          {/* Summary Info */}
          <div className="space-y-3">
            {/* Main Summary Text */}
            <div className="text-center">
              <p className="text-sm text-[#606C38] leading-relaxed">
                You are ordering{" "}
                <span className="font-bold text-[#283618]">{quantity}</span>{" "}
                meal plan{quantity !== 1 ? 's' : ''} for{" "}
                <span className="font-bold text-[#283618]">{selectedPlan.durationDays} days</span>
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              {/* Total Meals */}
              <div className="bg-white/60 rounded-lg p-3 border border-[#DDA15E]/30">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-[#606C38] flex items-center justify-center">
                    <ShoppingCart className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-semibold text-[#606C38] uppercase tracking-wide">
                    Total Meals
                  </span>
                </div>
                <p className="text-xl font-bold text-[#283618] ml-8">
                  {totalMeals}
                </p>
              </div>

              {/* Duration */}
              <div className="bg-white/60 rounded-lg p-3 border border-[#DDA15E]/30">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-[#606C38] flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-semibold text-[#606C38] uppercase tracking-wide">
                    Duration
                  </span>
                </div>
                <p className="text-xl font-bold text-[#283618] ml-8">
                  {selectedPlan.durationDays} days
                </p>
              </div>

              {/* People */}
              <div className="bg-white/60 rounded-lg p-3 border border-[#DDA15E]/30">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-[#606C38] flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-semibold text-[#606C38] uppercase tracking-wide">
                    Serving
                  </span>
                </div>
                <p className="text-xl font-bold text-[#283618] ml-8">
                  {quantity} {quantity === 1 ? 'person' : 'people'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Need to order for more people? Increase the quantity above.
          </p>
        </div>
      </div>
    </div>
  )
}
