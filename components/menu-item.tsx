"use client"

import { useState } from "react"
import Image from "next/image"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import type { MenuItem as MenuItemType } from "@/lib/store"

interface MenuItemProps {
  item: MenuItemType
  selectedDay: string
}

export function MenuItem({ item, selectedDay }: MenuItemProps) {
  const [quantity, setQuantity] = useState(1)
  const addToCart = useStore((state) => state.addToCart)

  const handleAddToCart = () => {
    addToCart(item, selectedDay, quantity)
    setQuantity(1)
  }

  return (
    <div className="group rounded-lg border border-neutral-200 bg-white overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden bg-neutral-100">
        <div className="absolute top-2 right-2 z-10">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
              item.isVegetarian ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {item.isVegetarian ? "Veg" : "Non-Veg"}
          </span>
        </div>
        <Image
          src={item.image || "/placeholder.svg?height=200&width=300&query=food"}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2">{item.name}</h3>
        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-orange-500">₹{item.price}</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-2 py-1 border border-neutral-200 rounded hover:bg-neutral-100 transition"
          >
            −
          </button>
          <span className="flex-1 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-2 py-1 border border-neutral-200 rounded hover:bg-neutral-100 transition"
          >
            +
          </button>
        </div>
        <Button onClick={handleAddToCart} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
