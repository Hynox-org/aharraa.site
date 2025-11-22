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
      <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 rounded-3xl p-8 mb-8 shadow-sm">
        <div className="max-w-3xl">
          {/* Updated counter badge to green/sandalwood theme */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-4 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700">
              {selectedMealTimes.length} meal{selectedMealTimes.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
            Select Your Meal Times
          </h2>
          
          <p className="text-lg text-gray-600">
            Choose when you'd like to enjoy delicious meals from this menu. You can select multiple meal times.
          </p>
        </div>
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
          <p className="text-gray-400 text-sm">
            👆 Tap on any meal card to get started
          </p>
        </div>
      )}
    </div>
  )
}
