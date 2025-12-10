import { MealCategory } from "@/lib/types"

interface TimeSlot {
  label: string
  value: string
}

interface TimeSlotSelectorProps {
  category: MealCategory
  timeSlots: TimeSlot[]
  selectedSlot?: string
  onSelectSlot: (category: MealCategory, slot: string) => void
  isDisabled?: boolean
}

export function TimeSlotSelector({
  category,
  timeSlots,
  selectedSlot,
  onSelectSlot,
  isDisabled = false,
}: TimeSlotSelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm sm:text-base mb-1.5 font-semibold text-black py-2">
        Select {category} Delivery Time *
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        {timeSlots.map((slot) => (
          <button
            key={slot.value}
            type="button"
            onClick={() => !isDisabled && onSelectSlot(category, slot.value)}
            disabled={isDisabled}
            className={`
              px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 text-xs sm:text-sm font-medium
              transition-all duration-200 ease-in-out
              ${
                selectedSlot === slot.value
                  ? "bg-[#3CB371] border-[#3CB371] text-white shadow-md"
                  : "bg-white border-gray-300 text-gray-700 hover:border-[#3CB371] hover:bg-[#3CB371]/5"
              }
              ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {slot.label}
          </button>
        ))}
      </div>
    </div>
  )
}
