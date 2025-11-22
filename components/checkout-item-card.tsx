"use client"

import Image from "next/image"
import { IoCart, IoPerson, IoCall, IoCalendar } from "react-icons/io5"
import { CheckoutItem, CheckoutItemView, PersonDetails } from "@/lib/types"
import { format } from "date-fns"

interface CheckoutItemCardProps {
  items: CheckoutItemView[]
}

export function CheckoutItemCard({ items }: CheckoutItemCardProps) {
  console.log(items);
  
  return (
    <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6 pb-3 md:pb-5 border-b border-gray-100">
        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#3CB371] flex items-center justify-center shadow-md">
          <IoCart className="w-5 h-5 md:w-7 md:h-7 text-white" />
        </div>
        <div>
          <h3 className="text-base md:text-xl font-bold text-black">
            Order Items
          </h3>
          <p className="text-[10px] md:text-sm text-gray-500">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your order
          </p>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3 md:space-y-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg md:rounded-xl p-3 md:p-5 border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="flex gap-2 md:gap-4">
              {/* Image */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#3CB371] rounded-md md:rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  <Image
                    src={item.menu.coverImage || "/defaults/default-meal.jpg"}
                    alt={item.menu.name}
                    width={80}
                    height={80}
                    className="relative rounded-md md:rounded-lg object-cover w-14 h-14 md:w-20 md:h-20 border border-gray-100"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm md:text-lg text-black mb-1 md:mb-2 truncate">
                  {item.menu.name}
                </h4>
                
                {/* Plan & Duration */}
                <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2 flex-wrap">
                  <span className="px-1.5 py-0.5 md:px-2.5 md:py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] md:text-sm font-semibold">
                    {item.plan.name}
                  </span>
                  <span className="px-1.5 py-0.5 md:px-2.5 md:py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] md:text-sm font-semibold">
                    {item.plan.durationDays} days
                  </span>
                </div>

                {/* Meal Times */}
                {item.selectedMealTimes && item.selectedMealTimes.length > 0 && (
                  <div className="flex flex-wrap gap-1 md:gap-1.5 mb-1 md:mb-2">
                    {item.selectedMealTimes.map((mealTime) => (
                      <span 
                        key={mealTime}
                        className="px-1.5 py-0.5 md:px-2 bg-gray-100 text-gray-700 rounded-full text-[9px] md:text-xs font-medium"
                      >
                        {mealTime}
                      </span>
                    ))}
                  </div>
                )}

                {/* Dates */}
                {item.startDate && item.endDate && (
                  <div className="flex items-center gap-1 md:gap-1.5 mb-1 md:mb-2 text-gray-600">
                    <IoCalendar className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
                    <p className="text-[10px] md:text-sm">
                      {format(new Date(item.startDate), "MMM d")} - {format(new Date(item.endDate), "MMM d, yyyy")}
                    </p>
                  </div>
                )}

                {/* Quantity */}
                <div className="inline-flex items-center gap-1 md:gap-1.5 px-2 py-0.5 md:px-2.5 md:py-1 bg-gray-100 rounded-full">
                  <span className="text-[10px] md:text-sm text-gray-600 font-medium">
                    Qty: <span className="font-bold text-black">{item.quantity}</span>
                  </span>
                </div>

                {/* Person Details */}
                {item.quantity > 1 && item.personDetails && item.personDetails.length > 0 && (
                  <div className="mt-2 md:mt-4 pt-2 md:pt-4 border-t border-gray-100">
                    <p className="text-[10px] md:text-sm font-bold text-black mb-1.5 md:mb-3">
                      Person Details:
                    </p>
                    <div className="space-y-1.5 md:space-y-2">
                      {item.personDetails.map((person, idx) => (
                        <div 
                          key={idx}
                          className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 p-2 md:p-3 rounded-md md:rounded-lg bg-gray-50 border border-gray-100"
                        >
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <div className="w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#3CB371] flex items-center justify-center text-white text-[10px] md:text-xs font-bold flex-shrink-0">
                              {idx + 1}
                            </div>
                            <span className="font-semibold text-[11px] md:text-sm text-black">
                              {person.name || `Person ${idx + 1}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-sm text-gray-600 font-medium pl-6 sm:pl-0">
                            <IoCall className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
                            <span>{person.phoneNumber}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price - Desktop */}
              <div className="hidden sm:flex items-start flex-shrink-0">
                <span className="font-black text-lg md:text-2xl text-black">
                  ₹{item.itemTotalPrice.toFixed(0)}
                </span>
              </div>
            </div>

            {/* Price - Mobile */}
            <div className="sm:hidden mt-3 pt-3 flex justify-between items-center border-t border-gray-100">
              <span className="text-xs font-bold text-gray-700">
                Item Total
              </span>
              <span className="font-black text-lg text-black">
                ₹{item.itemTotalPrice.toFixed(0)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      <div className="mt-3 md:mt-6 pt-3 md:pt-6 flex justify-between items-center border-t-2 border-gray-100">
        <span className="text-sm md:text-lg font-bold text-black">
          Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
        </span>
        <span className="text-xl md:text-3xl font-black text-black">
          ₹{items.reduce((sum, item) => sum + item.itemTotalPrice, 0).toFixed(0)}
        </span>
      </div>
    </div>
  )
}
