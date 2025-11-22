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
      {/* Header Section with Gradient Background */}
      <div className="text-center mb-6 md:mb-8 px-4">
        {/* Selection Counter - Floating Badge */}
        {selectedMealTimes.length > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-4 border border-gray-100">
            <div className="w-2 h-2 bg-[#3CB371] rounded-full animate-pulse" />
            <span className="text-xs md:text-sm font-semibold text-black">
              {selectedMealTimes.length} selected
            </span>
          </div>
        )}
        
        {/* Main Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
          Select Your Meal Times
        </h2>
        
        {/* Subtitle */}
        <p className="text-xs md:text-sm text-gray-500 max-w-2xl mx-auto">
          Choose when you'd like to enjoy your meals
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
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

      {/* Helper Text */}
      {selectedMealTimes.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
            <IoHandLeftOutline className="w-5 h-5" />
            Tap on any meal card to get started
          </p>
        </div>
      )}
    </div>
  )
}
