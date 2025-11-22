"use client"

import Image from "next/image"
import { format } from "date-fns"
import { IoRemoveCircle, IoAddCircle, IoTrash, IoPencil, IoCalendar, IoCall } from "react-icons/io5"
import { CartItem, PopulatedCartItem, PersonDetails } from "@/lib/types"

interface CartItemCardProps {
  item: PopulatedCartItem
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onEditPersonDetails: (itemId: string, details: PersonDetails[] | undefined, quantityToEdit: number) => void
  isUpdatingQuantity: boolean
  isRemovingItem: boolean
}

export function CartItemCard({ 
  item, 
  onUpdateQuantity, 
  onRemoveItem, 
  onEditPersonDetails, 
  isUpdatingQuantity, 
  isRemovingItem 
}: CartItemCardProps) {
  console.log("CartItemCard rendering for item:", item);
  
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      {/* Main Content */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image with Gradient Border */}
        <div className="flex-shrink-0">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#3CB371] opacity-0 group-hover:opacity-20 rounded-xl blur transition-opacity duration-300" />
            <Image
              src={item.menu.coverImage || "/public/defaults/default-meal.jpg"}
              alt={item.menu.name}
              width={120}
              height={120}
              className="relative rounded-xl object-cover w-full sm:w-24 sm:h-24 md:w-28 md:h-28 border border-gray-100"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg md:text-xl font-bold mb-1 text-black truncate">
            {item.menu.name}
          </h2>
          
          {/* Plan Info */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs md:text-sm font-semibold">
              {item.plan.name}
            </span>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs md:text-sm font-semibold">
              {item.plan.durationDays} days
            </span>
          </div>

          {/* Meal Times */}
          {item.selectedMealTimes && item.selectedMealTimes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {item.selectedMealTimes.map((mealTime) => (
                <span 
                  key={mealTime}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-[10px] md:text-xs font-medium"
                >
                  {mealTime}
                </span>
              ))}
            </div>
          )}

          {/* Dates */}
          <div className="flex items-center gap-1.5 mb-3 text-gray-600">
            <IoCalendar className="w-4 h-4 flex-shrink-0" />
            <p className="text-xs md:text-sm">
              {format(new Date(item.startDate), "MMM d")} - {format(new Date(item.endDate), "MMM d, yyyy")}
            </p>
          </div>

          {/* Price */}
          <p className="text-2xl md:text-3xl font-black text-black">
            ₹{item.itemTotalPrice.toFixed(0)}
          </p>
        </div>

        {/* Quantity & Actions - Desktop */}
        <div className="hidden sm:flex flex-col items-end gap-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1.5 border border-gray-200">
            <button
              onClick={() => onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1 || isUpdatingQuantity}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30 bg-white hover:bg-gray-100 disabled:hover:bg-white"
            >
              <IoRemoveCircle className="w-5 h-5 text-gray-600" />
            </button>
            
            <span className="font-bold text-base min-w-[2rem] text-center text-black">
              {item.quantity}
            </span>
            
            <button
              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
              disabled={isUpdatingQuantity}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white hover:bg-gray-100"
            >
              <IoAddCircle className="w-5 h-5 text-[#3CB371]" />
            </button>
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onRemoveItem(item._id)}
            disabled={isRemovingItem}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50"
          >
            <IoTrash className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quantity Controls - Mobile */}
      <div className="flex sm:hidden items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className="text-sm font-bold text-gray-700">Quantity</span>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1.5 border border-gray-200">
            <button
              onClick={() => onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1 || isUpdatingQuantity}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-30 bg-white"
            >
              <IoRemoveCircle className="w-5 h-5 text-gray-600" />
            </button>
            
            <span className="font-bold text-base min-w-[2rem] text-center text-black">
              {item.quantity}
            </span>
            
            <button
              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
              disabled={isUpdatingQuantity}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white"
            >
              <IoAddCircle className="w-5 h-5 text-[#3CB371]" />
            </button>
          </div>
          
          <button
            onClick={() => onRemoveItem(item._id)}
            disabled={isRemovingItem}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-red-50 hover:bg-red-100 text-red-600 ml-2"
          >
            <IoTrash className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Person Details */}
      {item.personDetails && item.personDetails.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm md:text-base font-bold text-black">
              Person Details
            </h3>
            {item.quantity > 1 && (
              <button
                onClick={() => {
                  console.log("Edit button clicked, item id:", item._id);
                  onEditPersonDetails(item._id, item.personDetails, item.quantity);
                }}
                className="h-8 md:h-9 px-3 md:px-4 rounded-full text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              >
                <IoPencil className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {item.personDetails.map((person: PersonDetails, idx: number) => (
              <div 
                key={idx} 
                className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#3CB371] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="font-semibold text-sm md:text-base text-black">
                    {person.name || `Person ${idx + 1}`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-600 font-medium pl-8 sm:pl-0">
                  <IoCall className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" />
                  <span>{person.phoneNumber}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
