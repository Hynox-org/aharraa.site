"use client"

import Image from "next/image"
import { useStore } from "@/lib/store"
import { VENDORS } from "@/lib/vendor-data"

export function VendorInfo() {
  const selectedVendorId = useStore((state) => state.selectedVendorId)
  const vendor = VENDORS.find((v) => v.id === selectedVendorId)

  if (!vendor) return null

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex gap-4 items-start">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={vendor.image}
            alt={vendor.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-lg font-semibold text-neutral-900">{vendor.name}</h3>
            <div className="flex items-center gap-1 text-yellow-500">
              <span className="text-sm">★</span>
              <span className="font-medium">{vendor.rating}</span>
            </div>
          </div>
          
          <p className="text-sm text-neutral-600 mb-2">{vendor.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {vendor.specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-700 rounded-full"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}