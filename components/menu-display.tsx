"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { MenuItem as MenuItemComponent } from "@/components/menu-item"

const MENU_DATA: Record<string, any[]> = {
  breakfast: [
    {
      id: "b1",
      name: "Protein Pancakes",
      description: "Fluffy pancakes with berries and Greek yogurt",
      price: 299,
      image: "/protein-pancakes-breakfast.png",
      category: "breakfast",
      isVegetarian: true,
    },
    {
      id: "b2",
      name: "Avocado Toast",
      description: "Whole grain toast with fresh avocado and egg",
      price: 349,
      image: "/avocado-toast.png",
      category: "breakfast",
      isVegetarian: true,
    },
    {
      id: "b3",
      name: "Smoothie Bowl",
      description: "Acai bowl with granola, coconut, and fresh fruit",
      price: 399,
      image: "/smoothie-bowl-acai.jpg",
      category: "breakfast",
      isVegetarian: true,
    },
    {
      id: "b4",
      name: "Oatmeal Delight",
      description: "Steel-cut oats with almonds, honey, and banana",
      price: 279,
      image: "/oatmeal-breakfast-bowl.jpg",
      category: "breakfast",
      isVegetarian: true,
    },
  ],
  lunch: [
    {
      id: "l1",
      name: "Grilled Chicken Bowl",
      description: "Tender chicken with quinoa, vegetables, and tahini sauce",
      price: 449,
      image: "/grilled-chicken-bowl-lunch.jpg",
      category: "lunch",
      isVegetarian: false,
    },
    {
      id: "l2",
      name: "Mediterranean Wrap",
      description: "Hummus, feta, cucumber, tomato in whole wheat wrap",
      price: 399,
      image: "/mediterranean-wrap.png",
      category: "lunch",
      isVegetarian: true,
    },
    {
      id: "l3",
      name: "Salmon Salad",
      description: "Fresh salmon with mixed greens and lemon dressing",
      price: 499,
      image: "/salmon-salad-lunch.jpg",
      category: "lunch",
      isVegetarian: false,
    },
    {
      id: "l4",
      name: "Veggie Stir Fry",
      description: "Seasonal vegetables with brown rice and ginger sauce",
      price: 379,
      image: "/vegetable-stir-fry.png",
      category: "lunch",
      isVegetarian: true,
    },
  ],
  dinner: [
    {
      id: "d1",
      name: "Herb Roasted Salmon",
      description: "Wild salmon with roasted vegetables and lemon butter",
      price: 599,
      image: "/herb-roasted-salmon-dinner.jpg",
      category: "dinner",
      isVegetarian: false,
    },
    {
      id: "d2",
      name: "Grass-Fed Steak",
      description: "Premium steak with sweet potato and green beans",
      price: 699,
      image: "/grass-fed-steak-dinner.jpg",
      category: "dinner",
      isVegetarian: false,
    },
    {
      id: "d3",
      name: "Pasta Primavera",
      description: "Whole wheat pasta with seasonal vegetables and pesto",
      price: 449,
      image: "/pasta-primavera-dinner.jpg",
      category: "dinner",
      isVegetarian: true,
    },
    {
      id: "d4",
      name: "Chicken Teriyaki",
      description: "Glazed chicken with jasmine rice and broccoli",
      price: 499,
      image: "/chicken-teriyaki-dinner.jpg",
      category: "dinner",
      isVegetarian: false,
    },
  ],
}

export function MenuDisplay() {
  const selectedSlot = useStore((state) => state.selectedSlot)
  const selectedPlan = useStore((state) => state.selectedPlan)
  const dietFilter = useStore((state) => state.dietFilter)
  const setDietFilter = useStore((state) => state.setDietFilter)
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const [showDaySelector, setShowDaySelector] = useState(false)

  const days = Array.from({ length: selectedPlan?.daysCount || 1 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  })

  const menu = MENU_DATA[selectedSlot || "breakfast"] || []

  const filteredMenu = menu.filter((item) => {
    if (dietFilter === "all") return true
    if (dietFilter === "veg") return item.isVegetarian
    if (dietFilter === "non-veg") return !item.isVegetarian
    return true
  })

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2 text-balance">
            {selectedSlot?.charAt(0).toUpperCase()}
            {selectedSlot?.slice(1)} Menu
          </h1>
          <p className="text-neutral-600">Select meals for {days[selectedDay]}</p>
        </div>
        <div className="relative">
          <Button
            onClick={() => setShowDaySelector(!showDaySelector)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {days[selectedDay]}
          </Button>
          {showDaySelector && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg z-10 min-w-40 max-h-64 overflow-y-auto">
              {days.map((day, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedDay(index)
                    setShowDaySelector(false)
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-orange-50 transition ${
                    selectedDay === index ? "bg-orange-100 text-orange-600 font-semibold" : ""
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <span className="text-sm font-semibold text-neutral-700 self-center">Filter by:</span>
        <button
          onClick={() => setDietFilter("all")}
          className={`px-4 py-2 rounded-full font-medium transition ${
            dietFilter === "all" ? "bg-orange-500 text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          All
        </button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {filteredMenu.map((item) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            selectedDay={days[selectedDay]}
            selectedSlot={selectedSlot || "breakfast"}
          />
        ))}
      </div>

      {filteredMenu.length === 0 && (
        <div className="text-center py-12">
          <p className="text-neutral-600 text-lg">No items available for the selected filter</p>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <Button
          onClick={() => useStore.setState({ selectedSlot: null })}
          variant="outline"
          className="border-neutral-200"
        >
          Back to Slots
        </Button>
        <Button
          onClick={() => (window.location.href = "/cart")}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Go to Cart
        </Button>
      </div>
    </div>
  )
}
