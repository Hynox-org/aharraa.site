"use client";

import { Plan } from "@/lib/types";
import { Minus, Plus, Users, Calendar, ShoppingCart } from "lucide-react";

interface QuantitySelectionProps {
  quantity: number;
  selectedPlan: Plan;
  onQuantityChange: (quantity: number) => void;
}

export function QuantitySelection({
  quantity,
  selectedPlan,
  onQuantityChange,
}: QuantitySelectionProps) {
  const totalMeals = quantity * selectedPlan.durationDays;
  const isMinQuantity = quantity <= 1;

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-[#283618] mb-1">Select Quantity</h2>
        <p className="text-xs text-gray-600">
          How many meal plans would you like to order?
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={isMinQuantity}
          aria-label="Decrease quantity"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#DDA15E] border border-[#BC6C25] text-white flex items-center justify-center text-2xl font-bold hover:bg-[#BC6C25] disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <Minus className="w-5 h-5 stroke-[3]" />
        </button>

        <div className="flex flex-col items-center gap-1">
          <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-lg bg-[#606C38] border-2 border-[#283618] flex items-center justify-center shadow-lg">
            <span className="text-3xl sm:text-4xl font-black text-[#FEFAE0]">{quantity}</span>
          </div>
          <span className="text-xs font-medium text-[#606C38]">
            meal plan{quantity !== 1 ? "s" : ""}
          </span>
        </div>

        <button
          onClick={() => onQuantityChange(quantity + 1)}
          aria-label="Increase quantity"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#DDA15E] border border-[#BC6C25] text-white flex items-center justify-center text-2xl font-bold hover:bg-[#BC6C25] transition"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
        </button>
      </div>

      {/* Summary Info */}
      <div className="bg-[#FEFAE0] rounded-xl border-2 border-[#DDA15E] p-4 shadow-sm text-center text-[#606C38] text-sm space-y-3">
        <p>
          Ordering{" "}
          <span className="font-bold text-[#283618]">{quantity}</span>{" "}
          meal plan{quantity !== 1 ? "s" : ""} for{" "}
          <span className="font-bold text-[#283618]">{selectedPlan.durationDays} days</span>.
        </p>
        <div className="flex justify-between gap-3">
          {/* Total Meals */}
          <div className="flex-1 bg-white rounded-lg p-2 border border-[#DDA15E]/30 flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-[#606C38] flex items-center justify-center mb-1">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span className="uppercase text-[9px] font-semibold text-[#606C38]">
              Total Meals
            </span>
            <p className="text-lg font-bold text-[#283618]">{totalMeals}</p>
          </div>
          {/* Duration */}
          <div className="flex-1 bg-white rounded-lg p-2 border border-[#DDA15E]/30 flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-[#606C38] flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="uppercase text-[9px] font-semibold text-[#606C38]">
              Duration
            </span>
            <p className="text-lg font-bold text-[#283618]">{selectedPlan.durationDays} days</p>
          </div>
          {/* People */}
          <div className="flex-1 bg-white rounded-lg p-2 border border-[#DDA15E]/30 flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-[#606C38] flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="uppercase text-[9px] font-semibold text-[#606C38]">
              Serving
            </span>
            <p className="text-lg font-bold text-[#283618]">
              {quantity} {quantity === 1 ? "person" : "people"}
            </p>
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <p className="mt-3 text-center text-[10px] text-gray-500 select-none">
        Need to order for more people? Increase the quantity above.
      </p>
    </div>
  );
}
