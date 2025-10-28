"use client"

import Image from "next/image"
import { useStore } from "@/lib/store"
import { VENDORS } from "@/lib/vendor-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function VendorSelection() {
  const selectedVendorId = useStore((state) => state.selectedVendorId)
  const setSelectedVendorId = useStore((state) => state.setSelectedVendorId)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-neutral-900">Choose Your Kitchen</h2>
      <p className="text-neutral-600">Select a vendor to view their menu and start customizing your meal plan.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VENDORS.map((vendor) => (
          <Card
            key={vendor.id}
            className={`p-6 cursor-pointer transition-all ${
              selectedVendorId === vendor.id
                ? "ring-2 ring-orange-500 bg-orange-50"
                : "hover:shadow-md"
            }`}
            onClick={() => setSelectedVendorId(vendor.id)}
          >
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src={vendor.image}
                alt={vendor.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-semibold text-neutral-900">{vendor.name}</h3>
                <div className="flex items-center gap-1 text-yellow-500">
                  <span className="text-sm">★</span>
                  <span className="font-medium">{vendor.rating}</span>
                </div>
              </div>
              
              <p className="text-sm text-neutral-600 line-clamp-2">{vendor.description}</p>
              
              <div className="pt-2">
                <div className="flex flex-wrap gap-2">
                  {vendor.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 text-xs bg-neutral-100 text-neutral-700 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant={selectedVendorId === vendor.id ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSelectedVendorId(vendor.id)}
                >
                  {selectedVendorId === vendor.id ? "Selected" : "Select Kitchen"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}