"use client"

import { useStore } from "@/lib/store"
import { MapPin } from "lucide-react"

const locations = [
  { id: "downtown", name: "Downtown", area: "Central Business District" },
  { id: "uptown", name: "Uptown", area: "North District" },
  { id: "midtown", name: "Midtown", area: "Central Area" },
  { id: "westside", name: "Westside", area: "West District" },
  { id: "eastside", name: "Eastside", area: "East District" },
  { id: "suburbs", name: "Suburbs", area: "Suburban Area" },
]

export function LocationSelection() {
  const selectedLocation = useStore((state) => state.selectedLocation)
  const setSelectedLocation = useStore((state) => state.setSelectedLocation)

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-neutral-900 mb-2">Select Delivery Location</h2>
      <p className="text-neutral-600 mb-8">Choose where you'd like your meals delivered</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <button
            key={location.id}
            onClick={() => setSelectedLocation(location.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left flex items-start gap-3 ${
              selectedLocation === location.id
                ? "border-orange-500 bg-orange-50"
                : "border-neutral-200 bg-white hover:border-orange-300"
            }`}
          >
            <MapPin className="text-orange-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold text-neutral-900">{location.name}</p>
              <p className="text-sm text-neutral-600">{location.area}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
