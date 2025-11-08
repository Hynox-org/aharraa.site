"use client"

import { Meal, Vendor } from "@/lib/types"
import { MealCard } from "./meal-card"
import { HiSparkles } from "react-icons/hi2"
import { GiHotMeal } from "react-icons/gi"
import { IoRestaurant } from "react-icons/io5"

interface MealGridProps {
  filteredMeals: Meal[]
  selectedMeal: Meal | null
  vendors: Vendor[]
  handleMealClick: (meal: Meal) => void
  handleMealSelect: (meal: Meal) => void
}

export function MealGrid({ 
  filteredMeals, 
  selectedMeal, 
  vendors, 
  handleMealClick, 
  handleMealSelect 
}: MealGridProps) {
  
  // Empty state
  if (filteredMeals.length === 0) {
    return (
      <div className="py-12 sm:py-16 text-center px-4">
        <div className="max-w-md mx-auto">
          {/* Decorative Background */}
          <div className="relative mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full flex items-center justify-center shadow-xl"
              style={{ background: "linear-gradient(135deg, #606C38, #283618)" }}>
              <GiHotMeal className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: "#FEFAE0" }} />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-2xl -z-10"
              style={{ background: "linear-gradient(135deg, rgba(221, 161, 94, 0.2), rgba(188, 108, 37, 0.2))" }}>
            </div>
          </div>

          {/* Message */}
          <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: "#283618" }}>
            No meals found
          </h3>
          <p className="text-sm sm:text-base mb-6" style={{ color: "#606C38", opacity: 0.8 }}>
            We couldn't find any meals matching your preferences. Try adjusting your filters or check back later for new additions.
          </p>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#DDA15E] to-transparent"></div>
            <HiSparkles className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#DDA15E" }} />
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#DDA15E] to-transparent"></div>
          </div>

          {/* Suggestion Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full border"
            style={{ 
              background: "linear-gradient(to right, #FEFAE0, rgba(221, 161, 94, 0.2))",
              borderColor: "rgba(221, 161, 94, 0.3)"
            }}>
            <IoRestaurant className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "#606C38" }} />
            <span className="text-xs sm:text-sm font-medium" style={{ color: "#283618" }}>
              New meals added daily!
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-3xl -z-10 opacity-50"
        style={{ background: "linear-gradient(135deg, rgba(96, 108, 56, 0.05), transparent)" }}>
      </div>
      <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-3xl -z-10 opacity-50"
        style={{ background: "linear-gradient(135deg, rgba(221, 161, 94, 0.05), transparent)" }}>
      </div>

      {/* Results Count & Selected Badge */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Results Count Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full border shadow-sm"
          style={{ 
            background: "linear-gradient(to right, #FEFAE0, rgba(221, 161, 94, 0.2))",
            borderColor: "rgba(221, 161, 94, 0.3)"
          }}>
          <GiHotMeal className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "#606C38" }} />
          <span className="text-xs sm:text-sm font-bold" style={{ color: "#283618" }}>
            {filteredMeals.length} {filteredMeals.length === 1 ? 'Meal' : 'Meals'} Available
          </span>
        </div>

        {/* Selected Meal Indicator */}
        {selectedMeal && (
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-md animate-pulse"
            style={{ background: "linear-gradient(to right, #606C38, #283618)" }}>
            <HiSparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: "#FEFAE0" }} />
            <span className="text-xs sm:text-sm font-bold" style={{ color: "#FEFAE0" }}>
              1 Selected
            </span>
          </div>
        )}
      </div>

      {/* Meal Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {filteredMeals.map((meal, index) => (
          <div
            key={meal._id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <MealCard
              meal={meal}
              selectedMealId={selectedMeal?._id || null}
              vendors={vendors}
              onMealClick={handleMealClick}
              onMealSelect={handleMealSelect}
            />
          </div>
        ))}
      </div>

      {/* Bottom Decorative Wave */}
      <div className="mt-8 sm:mt-12 flex items-center justify-center gap-2">
        <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#DDA15E] to-transparent"></div>
        <GiHotMeal className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#DDA15E" }} />
        <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-[#DDA15E] to-transparent"></div>
      </div>
    </div>
  )
}
