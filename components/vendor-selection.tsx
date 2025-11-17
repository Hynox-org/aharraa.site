import React from "react"
import { Vendor } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface VendorSelectionProps {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  onSelectVendor: (vendor: Vendor) => void;
}

export function VendorSelection({ vendors, selectedVendor, onSelectVendor }: VendorSelectionProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select a Vendor</CardTitle>
      </CardHeader>
      <CardContent>
        {vendors.length === 0 ? (
          <p className="text-center text-gray-500">No vendors available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {vendors.map((vendor) => (
              <Button
                key={vendor._id}
                variant={selectedVendor?._id === vendor._id ? "default" : "outline"}
                onClick={() => onSelectVendor(vendor)}
                className="flex flex-col h-auto p-4 text-center"
              >
                {vendor.image && (
                  <Image
                    src={vendor.image}
                    alt={vendor.name}
                    width={80}
                    height={80}
                    className="rounded-full mb-2 object-cover"
                  />
                )}
                <span className="font-semibold">{vendor.name}</span>
                {vendor.description && (
                  <p className="text-sm text-gray-500 mt-1">{vendor.description}</p>
                )}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
