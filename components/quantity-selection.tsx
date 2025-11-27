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
  const isMaxQuantity = quantity >= 4;

  return (
    <div className="px-4 py-4 md:py-6 max-w-md mx-auto">
      {/* Minimal Header */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Select Quantity</h2>
        <p className="text-xs md:text-sm text-gray-500">
          How many meal plans?
        </p>
      </div>

      {/* Floating Quantity Controls */}
      <div className="flex items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Decrease Button */}
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          disabled={isMinQuantity}
          aria-label="Decrease quantity"
          className={`
            w-12 h-12 md:w-14 md:h-14 rounded-full
            flex items-center justify-center
            transition-all duration-300 filter
            ${
              isMinQuantity
                ? "bg-gray-200 text-gray-400 cursor-not-allowed drop-shadow-md"
                : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white drop-shadow-xl hover:drop-shadow-2xl hover:scale-105"
            }
          `}
        >
          <Minus className="w-5 h-5 md:w-6 md:h-6 stroke-[3]" />
        </button>

        {/* Quantity Display - Floating Circle */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full blur-xl opacity-60" />
          
          <div className="relative flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl">
              <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                {quantity}
              </span>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
              <span className="text-[10px] md:text-xs font-bold text-gray-700 whitespace-nowrap">
                PLAN{quantity !== 1 ? "S" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Increase Button */}
        <button
          onClick={() => onQuantityChange(quantity + 1)}
          disabled={isMaxQuantity}
          aria-label="Increase quantity"
          className={`
            w-12 h-12 md:w-14 md:h-14 rounded-full
            flex items-center justify-center
            transition-all duration-300 filter
            ${
              isMaxQuantity
                ? "bg-gray-200 text-gray-400 cursor-not-allowed drop-shadow-md"
                : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white drop-shadow-xl hover:drop-shadow-2xl hover:scale-105"
            }
          `}
        >
          <Plus className="w-5 h-5 md:w-6 md:h-6 stroke-[3]" />
        </button>
      </div>

      {/* Summary Cards - Minimal Floating */}
      <div className="flex gap-3 md:gap-4 mb-4 md:mb-6">
        {/* Total Meals */}
        <div className="flex-1 text-center">
          <div className="relative group">
            <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center transition-all duration-300 filter drop-shadow-md group-hover:drop-shadow-lg">
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </div>
            <p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-500 mb-1 tracking-wide">
              Total Meals
            </p>
            <p className="text-lg md:text-xl font-black text-gray-900">{totalMeals}</p>
          </div>
        </div>

        {/* Duration */}
        <div className="flex-1 text-center">
          <div className="relative group">
            <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center transition-all duration-300 filter drop-shadow-md group-hover:drop-shadow-lg">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </div>
            <p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-500 mb-1 tracking-wide">
              Duration
            </p>
            <p className="text-lg md:text-xl font-black text-gray-900">{selectedPlan.durationDays}</p>
            <p className="text-[10px] md:text-xs text-gray-500">days</p>
          </div>
        </div>

        {/* People */}
        <div className="flex-1 text-center">
          <div className="relative group">
            <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-2 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center transition-all duration-300 filter drop-shadow-md group-hover:drop-shadow-lg">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
            </div>
            <p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-500 mb-1 tracking-wide">
              Serving
            </p>
            <p className="text-lg md:text-xl font-black text-gray-900">{quantity}</p>
            <p className="text-[10px] md:text-xs text-gray-500">
              {quantity === 1 ? "person" : "people"}
            </p>
          </div>
        </div>
      </div>

      {/* Minimal Helper Text */}
      <p className="text-center text-[10px] md:text-xs text-gray-400">
        Need more? Just increase the quantity. If you need to add more than 4 members, please add another cart item.
      </p>
    </div>
  );
}
