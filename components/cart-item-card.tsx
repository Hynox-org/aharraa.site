"use client"

import Image from "next/image"
import { format } from "date-fns"
import { IoRemoveCircle, IoAddCircle, IoTrash, IoPencil } from "react-icons/io5"
import { CartItem, PersonDetails } from "@/lib/types"

interface CartItemCardProps {
  item: CartItem
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onEditPersonDetails: (itemId: string, details: PersonDetails[] | undefined) => void
}

export function CartItemCard({ item, onUpdateQuantity, onRemoveItem, onEditPersonDetails }: CartItemCardProps) {
  return (
    <div className="rounded-xl p-4 sm:p-6 shadow-md" style={{ backgroundColor: "#ffffff" }}>
      {/* Main Content - Responsive Layout */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <div className="flex-shrink-0">
          <Image
            src={item.meal.image}
            alt={item.meal.name}
            width={120}
            height={120}
            className="rounded-lg object-cover w-full sm:w-24 sm:h-24 lg:w-28 lg:h-28"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold mb-1 truncate" style={{ color: "#283618" }}>
            {item.meal.name}
          </h2>
          <p className="text-sm mb-1" style={{ color: "#606C38" }}>
            {item.plan.name} ({item.plan.durationDays} days)
          </p>
          <p className="text-sm mb-2" style={{ color: "#606C38" }}>
            {format(new Date(item.startDate), "MMM d")} - {format(new Date(item.endDate), "MMM d, yyyy")}
          </p>
          <p className="text-xl font-bold" style={{ color: "#606C38" }}>
            ₹{item.itemTotalPrice.toFixed(0)}
          </p>
        </div>

        {/* Quantity Controls - Desktop */}
        <div className="hidden sm:flex items-start gap-2">
          <button
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
            style={{ 
              backgroundColor: "#DDA15E",
              color: "#FEFAE0"
            }}
          >
            <IoRemoveCircle className="w-5 h-5" />
          </button>
          
          <span className="font-bold text-lg min-w-[2rem] text-center" style={{ color: "#283618" }}>
            {item.quantity}
          </span>
          
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ 
              backgroundColor: "#DDA15E",
              color: "#FEFAE0"
            }}
          >
            <IoAddCircle className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onRemoveItem(item.id)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all ml-2"
            style={{ 
              backgroundColor: "#BC6C25",
              color: "#FEFAE0"
            }}
          >
            <IoTrash className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quantity Controls - Mobile */}
      <div className="flex sm:hidden items-center justify-between mt-4 pt-4 border-t"
        style={{ borderColor: "rgba(221, 161, 94, 0.3)" }}>
        <span className="text-sm font-bold" style={{ color: "#283618" }}>Quantity</span>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
            style={{ 
              backgroundColor: "#DDA15E",
              color: "#FEFAE0"
            }}
          >
            <IoRemoveCircle className="w-5 h-5" />
          </button>
          
          <span className="font-bold text-lg min-w-[2rem] text-center" style={{ color: "#283618" }}>
            {item.quantity}
          </span>
          
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
            style={{ 
              backgroundColor: "#DDA15E",
              color: "#FEFAE0"
            }}
          >
            <IoAddCircle className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onRemoveItem(item.id)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all ml-2"
            style={{ 
              backgroundColor: "#BC6C25",
              color: "#FEFAE0"
            }}
          >
            <IoTrash className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Person Details */}
      {item.personDetails && item.personDetails.length > 0 && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(221, 161, 94, 0.3)" }}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm sm:text-base font-bold" style={{ color: "#283618" }}>
              Person Details
            </h3>
            {item.quantity > 1 && (
              <button
                onClick={() => onEditPersonDetails(item.id, item.personDetails)}
                className="h-8 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
                style={{ 
                  backgroundColor: "#606C38",
                  color: "#FEFAE0"
                }}
              >
                <IoPencil className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
          </div>
          <div className="space-y-2">
            {item.personDetails.map((person: PersonDetails, idx: number) => (
              <div 
                key={idx} 
                className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm p-2 rounded-lg"
                style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}
              >
                <span className="font-medium" style={{ color: "#283618" }}>
                  {person.name || `Person ${idx + 1}`}
                </span>
                <span style={{ color: "#606C38" }}>
                  {person.phoneNumber}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
