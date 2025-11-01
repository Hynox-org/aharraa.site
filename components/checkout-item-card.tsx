"use client"

import Image from "next/image"
import { IoCart } from "react-icons/io5"
import { CheckoutItem, PersonDetails } from "@/lib/types"

interface CheckoutItemCardProps {
  items: CheckoutItem[]
}

export function CheckoutItemCard({ items }: CheckoutItemCardProps) {
  return (
    <div className="rounded-xl p-4 sm:p-6 shadow-md" style={{ backgroundColor: "#ffffff" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #606C38, #283618)" }}>
          <IoCart className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#FEFAE0" }} />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold" style={{ color: "#283618" }}>
            Your Items
          </h3>
          <p className="text-xs sm:text-sm" style={{ color: "#606C38" }}>
            {items.length} {items.length === 1 ? 'item' : 'items'} in order
          </p>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-3 sm:space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg p-3 sm:p-4"
            style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}
          >
            <div className="flex gap-3 sm:gap-4">
              {/* Image */}
              <div className="flex-shrink-0">
                <Image
                  src={item.meal.image}
                  alt={item.meal.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover w-16 h-16 sm:w-20 sm:h-20"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base sm:text-lg mb-1 truncate" style={{ color: "#283618" }}>
                  {item.meal.name}
                </p>
                <p className="text-xs sm:text-sm mb-1" style={{ color: "#606C38" }}>
                  {item.plan.name} ({item.plan.durationDays} days)
                </p>
                <p className="text-xs" style={{ color: "#606C38" }}>
                  Quantity: <span className="font-bold">{item.quantity}</span>
                </p>

                {/* Person Details */}
                {item.quantity > 1 &&
                  item.personDetails &&
                  item.personDetails.length > 0 && (
                    <div className="mt-3 p-2 rounded-lg" style={{ backgroundColor: "rgba(96, 108, 56, 0.1)" }}>
                      <p className="text-xs font-bold mb-2" style={{ color: "#283618" }}>
                        Person Details:
                      </p>
                      <div className="space-y-1">
                        {item.personDetails.map((person, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-2 text-xs">
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

              {/* Price - Desktop */}
              <div className="hidden sm:flex items-start flex-shrink-0">
                <span className="font-bold text-lg sm:text-xl" style={{ color: "#606C38" }}>
                  ₹{item.itemTotalPrice.toFixed(0)}
                </span>
              </div>
            </div>

            {/* Price - Mobile (Below) */}
            <div className="sm:hidden mt-3 pt-3 flex justify-between items-center"
              style={{ borderTop: "1px solid rgba(221, 161, 94, 0.3)" }}>
              <span className="text-sm font-bold" style={{ color: "#283618" }}>
                Total
              </span>
              <span className="font-bold text-lg" style={{ color: "#606C38" }}>
                ₹{item.itemTotalPrice.toFixed(0)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 flex justify-between items-center"
        style={{ borderTop: "2px solid rgba(221, 161, 94, 0.3)" }}>
        <span className="text-base sm:text-lg font-bold" style={{ color: "#283618" }}>
          Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
        </span>
        <span className="text-xl sm:text-2xl font-bold" style={{ color: "#606C38" }}>
          ₹{items.reduce((sum, item) => sum + item.itemTotalPrice, 0).toFixed(0)}
        </span>
      </div>
    </div>
  )
}
