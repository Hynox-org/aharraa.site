"use client"

import { X } from "lucide-react"
import { Meal, Vendor } from "@/lib/types"
import { VENDORS } from "@/lib/vendor-data"
import { IoCheckmarkCircle } from "react-icons/io5"

interface MealDetailsModalProps {
  mealDetailsOpen: boolean
  detailMeal: Meal | null
  selectedMealId: string | null
  onClose: () => void
  onMealSelect: (meal: Meal) => void
}

export function MealDetailsModal({
  mealDetailsOpen,
  detailMeal,
  selectedMealId,
  onClose,
  onMealSelect,
}: MealDetailsModalProps) {
  if (!mealDetailsOpen || !detailMeal) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(40, 54, 24, 0.8)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ backgroundColor: "#FEFAE0" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Header */}
        <div className="relative h-64">
          <img
            src={detailMeal.image}
            alt={detailMeal.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            style={{ backgroundColor: "#FEFAE0" }}
          >
            <X className="w-5 h-5" style={{ color: "#283618" }} />
          </button>

          {/* Title & Price */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold text-2xl text-white mb-1">{detailMeal.name}</h3>
                <p className="text-white/80 text-sm">
                  by {VENDORS.find((v: Vendor) => v._id === detailMeal.vendorId)?.name}
                </p>
              </div>
              <span className="text-xl font-bold px-4 py-2 rounded-lg" 
                style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}>
                ₹{detailMeal.price}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="font-bold text-lg mb-2" style={{ color: "#283618" }}>
              Description
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: "#606C38" }}>
              {detailMeal.description}
            </p>
          </div>

          {/* Category & Diet */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg" style={{ backgroundColor: "#DDA15E20" }}>
              <p className="text-xs font-bold uppercase mb-1" style={{ color: "#606C38" }}>
                Category
              </p>
              <p className="font-bold" style={{ color: "#283618" }}>
                {detailMeal.category}
              </p>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: "#DDA15E20" }}>
              <p className="text-xs font-bold uppercase mb-1" style={{ color: "#606C38" }}>
                Diet
              </p>
              <p className="font-bold" style={{ color: "#283618" }}>
                {detailMeal.dietPreference}
              </p>
            </div>
          </div>

          {/* Nutrition */}
          <div>
            <h4 className="font-bold text-lg mb-3" style={{ color: "#283618" }}>
              Nutritional Information
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Calories", value: "420" },
                { label: "Protein", value: "25g" },
                { label: "Carbs", value: "45g" },
                { label: "Fat", value: "15g" }
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-lg text-center" 
                  style={{ backgroundColor: "#DDA15E20" }}>
                  <p className="text-2xl font-bold mb-1" style={{ color: "#283618" }}>
                    {item.value}
                  </p>
                  <p className="text-xs font-medium" style={{ color: "#606C38" }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Serving Size */}
          <div>
            <h4 className="font-bold text-lg mb-3" style={{ color: "#283618" }}>
              Serving Size
            </h4>
            <div className="p-4 rounded-lg" style={{ backgroundColor: "#DDA15E20" }}>
              <p className="text-sm font-bold mb-1" style={{ color: "#283618" }}>
                1 serving (350-400g)
              </p>
              <p className="text-xs" style={{ color: "#606C38" }}>
                Perfectly portioned for one person
              </p>
            </div>
          </div>

          {/* Select Button */}
          <button
            onClick={() => {
              onMealSelect(detailMeal)
              onClose()
            }}
            className="w-full py-4 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-2"
            style={{
              backgroundColor: selectedMealId === detailMeal._id ? "#606C38" : "#DDA15E",
              color: "#FEFAE0"
            }}
          >
            {selectedMealId === detailMeal._id ? (
              <>
                <IoCheckmarkCircle className="w-5 h-5" />
                Selected
              </>
            ) : (
              "Select This Meal"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
