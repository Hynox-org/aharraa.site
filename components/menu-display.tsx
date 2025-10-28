"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { VENDOR_MENUS, WEEKLY_MENU_TEMPLATE, type MealType, type MenuItem } from "@/lib/menu-data"
import { VendorInfo } from "@/components/vendor-info"

export function MenuDisplay() {
  const [activeDay, setActiveDay] = useState<string | null>("Monday") // Default to Monday
  const dietFilter = useStore((state) => state.dietFilter)
  const setDietFilter = useStore((state) => state.setDietFilter)
  const selectedVendorId = useStore((state) => state.selectedVendorId)

  // Get menu based on selected vendor and diet preference
  const vendorMenu = VENDOR_MENUS.find(menu => menu.vendorId === selectedVendorId)
  const menu = vendorMenu ? (dietFilter === "veg" ? vendorMenu.veg : vendorMenu.nonVeg) : null
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"]

  const getMealItems = (day: string, mealType: MealType) => {
    if (!menu) return []
    const weeklyMenuItems = WEEKLY_MENU_TEMPLATE[day as keyof typeof WEEKLY_MENU_TEMPLATE][mealType]
    return weeklyMenuItems.map((index: number) => menu[mealType][index])
  }

  return (
    <div className="space-y-6">
      {/* Diet Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        <span className="text-sm font-semibold text-neutral-700 self-center">Diet Preference:</span>
        <button
          onClick={() => setDietFilter("veg")}
          className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 ${
            dietFilter === "veg" ? "bg-green-500 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          <span className="text-lg">🥬</span> Vegetarian
        </button>
        <button
          onClick={() => setDietFilter("non-veg")}
          className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 ${
            dietFilter === "non-veg" ? "bg-red-500 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          <span className="text-lg">🍗</span> Non-Vegetarian
        </button>
      </div>

      {/* Weekly Menu Display */}
      <div className="grid grid-cols-12 gap-6 border rounded-lg bg-white">
        {/* Left Column - Days */}
        <div className="col-span-3 border-r">
          {weekDays.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(activeDay === day ? null : day)}
              className={`w-full px-6 py-4 text-left hover:bg-neutral-50 transition border-b last:border-b-0 ${
                activeDay === day ? "bg-orange-50 border-r-2 border-r-orange-500" : ""
              }`}
            >
              <h3 className="text-lg font-medium text-neutral-900">{day}</h3>
            </button>
          ))}
        </div>

        {/* Right Column - Menu Items */}
        <div className="col-span-9 p-6">
          {activeDay ? (
            <div className="space-y-8">
              {mealTypes.map((mealType) => (
                <div key={mealType} className="space-y-4">
                  <h4 className="text-xl font-semibold capitalize text-neutral-800 border-b pb-2">
                    {mealType}
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {getMealItems(activeDay, mealType).map((item: MenuItem) => (
                      <div key={item.id} className="flex gap-4 p-4 border rounded-lg hover:bg-neutral-50 transition">
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h5 className="font-semibold text-neutral-900 truncate">{item.name}</h5>
                            <span className={`px-2 py-0.5 rounded-full text-sm font-medium flex-shrink-0 ${
                              dietFilter === "veg" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-red-100 text-red-700"
                            }`}>
                              {dietFilter === "veg" ? "Veg" : "Non-Veg"}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600 line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-neutral-500">
              Select a day to view menu
            </div>
          )}
        </div>
      </div>

      {/* Vendor Info */}
      <VendorInfo />

      {/* Accompaniments Section */}
      {vendorMenu && (
        <div className="mt-8 p-6 bg-orange-50 rounded-lg">
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">Accompaniments</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {vendorMenu.accompaniments.indian.map((item) => {
              const isSelected = useStore(
                (state) => state.selectedAccompaniments.some((acc) => acc.id === item.id)
              );
              const toggleAccompaniment = useStore((state) => state.toggleAccompaniment);

              return (
                <button
                  key={item.id}
                  onClick={() => toggleAccompaniment(item)}
                  className={`bg-white p-4 rounded-lg shadow-sm transition border-2 text-left ${
                    isSelected
                      ? "border-orange-500 bg-orange-50"
                      : "border-transparent hover:border-orange-200"
                  }`}
                >
                  <h5 className="font-medium text-neutral-900">{item.name}</h5>
                  <p className="text-orange-600 font-semibold mt-1">₹{item.price}</p>
                  {isSelected && (
                    <span className="text-orange-500 text-sm mt-2 block">
                      ✓ Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}
