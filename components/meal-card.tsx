"use client"

import { cn } from "@/lib/utils"
import { Meal, Vendor } from "@/lib/types"
import { IoCheckmarkCircle, IoInformationCircle } from "react-icons/io5"

interface MealCardProps {
  meal: Meal
  selectedMealId: string | null
  vendors: Vendor[]
  onMealClick: (meal: Meal) => void
  onMealSelect: (meal: Meal) => void
}

export function MealCard({ meal, selectedMealId, vendors, onMealClick, onMealSelect }: MealCardProps) {
  const isSelected = selectedMealId === meal._id
  const vendor = vendors.find((v: Vendor) => v._id === meal.vendorId)

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden transition-all cursor-pointer",
        isSelected 
          ? "ring-2 shadow-lg scale-105" 
          : "hover:shadow-md"
      )}
      style={{
        backgroundColor: "#FEFAE0",
        borderColor: isSelected ? "#606C38" : "transparent"
      }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Diet Badge */}
        <div className="absolute top-3 right-3">
          <span 
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ 
              backgroundColor: "#606C38",
              color: "#FEFAE0"
            }}
          >
            {meal.dietPreference}
          </span>
        </div>

        {/* Selected Check */}
        {isSelected && (
          <div className="absolute top-3 left-3">
            <IoCheckmarkCircle className="w-8 h-8" style={{ color: "#FEFAE0" }} />
          </div>
        )}

        {/* Name & Vendor */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-lg text-white mb-1">{meal.name}</h3>
          {vendor && (
            <p className="text-sm text-white/80">{vendor.name}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Description */}
        <p className="text-sm mb-4 line-clamp-2" style={{ color: "#283618" }}>
          {meal.description}
        </p>

        {/* Price & Buttons */}
        <div className="flex items-center justify-between gap-3">
          {/* Price */}
          <span className="text-2xl font-bold" style={{ color: "#283618" }}>
            ₹{meal.price.toFixed(0)}
            <span className="text-sm font-normal opacity-60">/meal</span>
          </span>

          {/* Buttons */}
          <div className="flex gap-2">
            {/* Info Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMealClick(meal)
              }}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
              style={{
                border: "2px solid #606C38",
                backgroundColor: "#FEFAE0"
              }}
            >
              <IoInformationCircle className="w-5 h-5" style={{ color: "#606C38" }} />
            </button>

            {/* Select Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMealSelect(meal)
              }}
              className="px-5 py-2 rounded-lg font-bold text-sm transition-all"
              style={{
                backgroundColor: isSelected ? "#606C38" : "#DDA15E",
                color: "#FEFAE0"
              }}
            >
              {isSelected ? "Selected" : "Select"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
