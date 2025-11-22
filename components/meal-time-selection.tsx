"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import FoodDisplayCard from "./food-display-card"
import { MenuWithPopulatedMeals } from "@/lib/types"
import { IoHandLeftOutline } from "react-icons/io5"

interface MealTimeSelectionProps {
  selectedMenu: MenuWithPopulatedMeals | null
  selectedMealTimes: string[]
  onMealTimeSelect: (mealTime: string, isSelected: boolean) => void
}

export function MealTimeSelection({
  selectedMenu,
  selectedMealTimes,
  onMealTimeSelect,
}: MealTimeSelectionProps) {
  if (!selectedMenu) {
    return null
  }

  const mealTimeImages: { [key: string]: string } = {
    breakfast: "/breakfast-cover.png",
    lunch: "/lunch-cover.png",
    dinner: "/dinner-cover.png",
  }

  const mealTimeDescriptions: { [key: string]: string } = {
    breakfast: "Start your day right",
    lunch: "Midday energy boost",
    dinner: "End your day deliciously",
  }

  return (
    <div className="w-full">
      {/* Header Section - More Compact */}
      <div className="text-center mb-3 md:mb-8 px-2 md:px-4">
        {/* Selection Counter - Smaller */}
        {selectedMealTimes.length > 0 && (
          <div className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1 md:py-2 bg-white rounded-full shadow-sm md:shadow-md mb-2 md:mb-4 border border-gray-100">
            <div className="w-1 h-1 md:w-2 md:h-2 bg-[#3CB371] rounded-full animate-pulse" />
            <span className="text-[9px] sm:text-[10px] md:text-sm font-semibold text-black">
              {selectedMealTimes.length} selected
            </span>
          </div>
        )}
        
        {/* Main Title - Smaller */}
        <h2 className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold text-black mb-0.5 md:mb-2">
          Select Your Meal Times
        </h2>
        
        {/* Subtitle - Smaller */}
        <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 max-w-2xl mx-auto">
          Choose when you'd like to enjoy your meals
        </p>
      </div>

      {/* Cards Grid - Tighter Gap */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 lg:gap-8 px-1 md:px-2">
        {selectedMenu.availableMealTimes.map((mealTime) => (
          <FoodDisplayCard
            key={mealTime}
            image={mealTimeImages[mealTime.toLowerCase()] || "/placeholder.jpg"}
            title={mealTime}
            description={mealTimeDescriptions[mealTime.toLowerCase()]}
            onClick={() =>
              onMealTimeSelect(mealTime, !selectedMealTimes.includes(mealTime))
            }
            isSelected={selectedMealTimes.includes(mealTime)}
          />
        ))}
      </div>

      {/* Helper Text - Smaller */}
      {selectedMealTimes.length === 0 && (
        <div className="mt-3 md:mt-8 text-center px-2">
          <p className="text-gray-400 text-[10px] md:text-sm flex items-center justify-center gap-1 md:gap-2">
            <IoHandLeftOutline className="w-3 h-3 md:w-5 md:h-5" />
            Tap on any meal card to get started
          </p>
        </div>
      )}
    </div>
  )
}
