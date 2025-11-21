"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox" // Using checkbox for multiple selections
import { Label } from "@/components/ui/label" // Using label for checkbox text
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-bold">
          Select Meal Times
        </CardTitle>
        <CardDescription>
          Choose the meal times you want for this menu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {selectedMenu.availableMealTimes.map((mealTime) => (
            <div key={mealTime} className="flex items-center space-x-2">
              <Checkbox
                id={mealTime}
                checked={selectedMealTimes.includes(mealTime)}
                onCheckedChange={(checked) =>
                  onMealTimeSelect(mealTime, checked as boolean)
                }
              />
              <Label htmlFor={mealTime} className="capitalize text-base">
                {mealTime}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
