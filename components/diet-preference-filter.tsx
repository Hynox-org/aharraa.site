"use client"

import { cn } from "@/lib/utils"
import { DietPreference } from "@/lib/types"
import { IoCheckmarkCircle } from "react-icons/io5"

interface DietPreferenceFilterProps {
  selectedDietPreference: DietPreference
  onSelectDietPreference: (preference: DietPreference) => void
}

export function DietPreferenceFilter({ selectedDietPreference, onSelectDietPreference }: DietPreferenceFilterProps) {
  const preferences: DietPreference[] = ['All', 'Veg', 'Non-Veg']

  return (
    <div className="mb-6">
      <div className="flex gap-3 flex-wrap">
        {preferences.map((preference) => {
          const isSelected = selectedDietPreference === preference
          
          return (
            <button
              key={preference}
              onClick={() => onSelectDietPreference(preference)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all",
                isSelected && "scale-105"
              )}
              style={{
                backgroundColor: isSelected ? "#606C38" : "#FEFAE0",
                color: isSelected ? "#FEFAE0" : "#283618",
                border: `2px solid ${isSelected ? "#606C38" : "#DDA15E"}`
              }}
            >
              {isSelected && (
                <IoCheckmarkCircle className="w-4 h-4" />
              )}
              <span>{preference}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
