"use client"

import { useCallback, useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { VENDOR_MENUS, WEEKLY_MENU_TEMPLATE } from "@/lib/menu-data"
import { MealType, MenuItem } from "@/lib/types"
import { VENDORS } from "@/lib/vendor-data"
import { VendorInfo } from "@/components/vendor-info"

export function MenuDisplay() {
  const [activeDay, setActiveDay] = useState<string | null>("Sunday") // Default to Monday
  const [selectedMealPreferences, setSelectedMealPreferences] = useState<Map<MealType, "veg" | "non-veg">>(new Map());
  const store = useStore()
  const {
    selectedVendorId,
    selectedPlan,
    selectedDates,
    selectedAccompaniments,
    cart
  } = store

  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"]
  const vendorMenu = VENDOR_MENUS.find(menu => menu.vendorId === selectedVendorId);

  useEffect(() => {
    // Initialize selectedMealPreferences with all meal types selected and a default diet preference
    const initialPreferences = new Map<MealType, "veg" | "non-veg">();
    mealTypes.forEach(mealType => initialPreferences.set(mealType, "veg"));
    setSelectedMealPreferences(initialPreferences);
  }, []);

  // Get menu based on selected vendor and diet preference for a specific meal type
  const getMealItems = (day: string, mealType: MealType, dietPreference: "veg" | "non-veg") => {
    if (!vendorMenu) return [];

    const menu = dietPreference === "veg" ? vendorMenu.veg : vendorMenu.nonVeg;
    const weeklyMenuItems = WEEKLY_MENU_TEMPLATE[day as keyof typeof WEEKLY_MENU_TEMPLATE][mealType];
    return weeklyMenuItems.map((index: number) => menu[mealType][index]);
  };

  const toggleMealTypeSelection = (mealType: MealType) => {
    setSelectedMealPreferences(prev => {
      const newPreferences = new Map(prev);
      if (newPreferences.has(mealType)) {
        if (newPreferences.size > 1) { // Ensure at least one meal type is selected
          newPreferences.delete(mealType);
        }
      } else {
        newPreferences.set(mealType, "veg"); // Default to veg when adding
      }
      return newPreferences;
    });
  };

  const setMealDietPreference = (mealType: MealType, preference: "veg" | "non-veg") => {
    setSelectedMealPreferences(prev => {
      const newPreferences = new Map(prev);
      if (newPreferences.has(mealType)) {
        newPreferences.set(mealType, preference);
      }
      return newPreferences;
    });
  };

  const generateOrderSummary = () => {
    const selectedVendor = VENDORS.find(v => v.id === selectedVendorId);
    const weekDates = new Map();
    
    if (selectedDates) {
      let currentDate = new Date(selectedDates.startDate);
      const endDate = new Date(selectedDates.endDate);
      
      while (currentDate <= endDate) {
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
        weekDates.set(dayName, new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    let mealPlanTotal = 0;
    if (selectedDates && vendorMenu) {
      const numDays = Math.ceil(
        (selectedDates.endDate.getTime() - selectedDates.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1; // +1 to include the end date

      for (let i = 0; i < numDays; i++) {
        Array.from(selectedMealPreferences.entries()).forEach(([mealType, dietPreference]) => {
          const price = vendorMenu.mealTypePricing[mealType][dietPreference === "veg" ? "veg" : "nonVeg"];
          mealPlanTotal += price;
        });
      }
    }

    const accompanimentsTotal = selectedAccompaniments.reduce((total, acc) => total + acc.price, 0);
    const grandTotal = mealPlanTotal + accompanimentsTotal;

    const summary = {
      plan: {
        ...selectedPlan,
        selectedBasePrice: selectedPlan?.selectedBasePrice || 0, // Ensure selectedBasePrice is included
        dates: {
          start: selectedDates?.startDate.toLocaleDateString(),
          end: selectedDates?.endDate.toLocaleDateString()
        }
      },
      vendor: {
        id: selectedVendor?.id,
        name: selectedVendor?.name,
        location: selectedVendor?.location,
        rating: selectedVendor?.rating,
        contactInfo: selectedVendor?.contactInfo
      },
      weeklyMenu: Object.fromEntries(
        [...weekDates].map(([day, date]) => [
          day,
          {
            date: date.toLocaleDateString(),
            meals: Object.fromEntries(
              Array.from(selectedMealPreferences.entries()).map(([mealType, dietPreference]) => [
                mealType,
                {
                  dietPreference: dietPreference,
                  mealPrice: vendorMenu?.mealTypePricing[mealType][dietPreference === "veg" ? "veg" : "nonVeg"] || 0,
                  items: getMealItems(day, mealType, dietPreference).map(item => ({
                    id: item.id,
                    name: item.name,
                    isVegetarian: item.isVegetarian
                  }))
                }
              ])
            )
          }
        ])
      ),
      accompaniments: selectedAccompaniments.map(acc => ({
        id: acc.id,
        name: acc.name,
        price: acc.price
      })),
      pricing: {
        planTotal: mealPlanTotal,
        accompanimentsTotal: accompanimentsTotal,
        grandTotal: grandTotal
      }
    };

    console.log('Complete Order Summary:', JSON.stringify(summary, null, 2));
    return summary;
  };

  return (
    <div className="space-y-6">
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
              {mealTypes.map((mealType) => {
                const currentDietPreference = selectedMealPreferences.get(mealType);
                const isMealTypeSelected = selectedMealPreferences.has(mealType);
                const mealPrice = vendorMenu?.mealTypePricing[mealType][currentDietPreference === "veg" ? "veg" : "nonVeg"] || 0;

                return (
                  <div key={mealType} className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="text-xl font-semibold capitalize text-neutral-800">
                        {mealType}
                      </h4>
                      <div className="flex gap-2">
                        <span className={`px-4 py-0.5 rounded-full text-sm font-medium flex-shrink-0 flex items-center ${
                                  currentDietPreference === "veg"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}>
                                  {currentDietPreference === "veg" ? "Veg" : "Non-Veg"} (₹{mealPrice})
                                </span>
                        <Button
                          onClick={() => toggleMealTypeSelection(mealType)}
                          className={`px-4 py-2 rounded-full font-medium transition ${
                            isMealTypeSelected
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                          }`}
                        >
                          {isMealTypeSelected ? "Selected" : "Add Meal"}
                        </Button>
                        {isMealTypeSelected && (
                          <>
                            <Button
                              onClick={() => setMealDietPreference(mealType, "veg")}
                              className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 ${
                                currentDietPreference === "veg"
                                  ? "bg-green-500 text-white hover:bg-green-600"
                                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                              }`}
                            >
                              <span className="text-lg">🥬</span> Vegetarian
                            </Button>
                            <Button
                              onClick={() => setMealDietPreference(mealType, "non-veg")}
                              className={`px-4 py-2 rounded-full font-medium transition flex items-center gap-2 ${
                                currentDietPreference === "non-veg"
                                  ? "bg-red-500 text-white hover:bg-red-600"
                                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                              }`}
                            >
                              <span className="text-lg">🍗</span> Non-Vegetarian
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {isMealTypeSelected && currentDietPreference && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {getMealItems(activeDay, mealType, currentDietPreference).map((item: MenuItem) => (
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
                              </div>
                              <p className="text-sm text-neutral-600 line-clamp-2">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {!isMealTypeSelected && (
                      <div className="text-neutral-500 text-center py-4">
                        Select this meal type to view menu items.
                      </div>
                    )}
                  </div>
                );
              })}
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
      {selectedVendorId && VENDOR_MENUS.find(menu => menu.vendorId === selectedVendorId) && (
        <div className="mt-8 p-6 bg-orange-50 rounded-lg">
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">Accompaniments</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {VENDOR_MENUS.find(menu => menu.vendorId === selectedVendorId)?.accompaniments.indian.map((item) => {
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

      {/* CTA Section */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 mt-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-neutral-600">Total Amount:</span>
            <span className="text-2xl font-bold text-orange-600">₹{generateOrderSummary().pricing.grandTotal}</span>
          </div>
          <Button
            onClick={() => {
              const summary = generateOrderSummary();
              localStorage.setItem('orderSummary', JSON.stringify(summary));
              window.location.href = '/checkout';
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 text-lg"
          >
            Proceed to Checkout →
          </Button>
        </div>
      </div>
    </div>
  )
}
