"use client"

import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"

const SLOTS = [
  {
    id: "breakfast",
    name: "Breakfast",
    description: "Start your day with a nutritious breakfast",
    icon: "🌅",
    time: "7:00 AM - 10:00 AM",
  },
  {
    id: "lunch",
    name: "Lunch",
    description: "Delicious lunch meals for midday energy",
    icon: "🍽️",
    time: "12:00 PM - 2:00 PM",
  },
  {
    id: "dinner",
    name: "Dinner",
    description: "Satisfying dinner options for the evening",
    icon: "🌙",
    time: "6:00 PM - 8:00 PM",
  },
]

export function SlotSelection() {
  const setSelectedSlot = useStore((state) => state.setSelectedSlot)

  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4 text-balance">Choose Your Meal Slot</h2>
      <p className="text-lg text-neutral-600 mb-12 text-balance">
        Select when you'd like to receive your delicious meal
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SLOTS.map((slot) => (
          <div
            key={slot.id}
            onClick={() => setSelectedSlot(slot.id)}
            className="group relative overflow-hidden rounded-xl border-2 border-neutral-200 bg-white p-8 transition-all hover:border-orange-500 hover:shadow-xl hover:scale-105 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="text-6xl mb-4">{slot.icon}</div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">{slot.name}</h3>
              <p className="text-sm text-neutral-600 mb-3">{slot.description}</p>
              <p className="text-xs font-semibold text-orange-500 mb-6">{slot.time}</p>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                Select {slot.name}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
