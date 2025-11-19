import React from "react"
import { Vendor } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Check } from "lucide-react"

interface VendorSelectionProps {
  vendors: Vendor[];
  selectedVendor: Vendor | null;
  onSelectVendor: (vendor: Vendor) => void;
}

export function VendorSelection({ vendors, selectedVendor, onSelectVendor }: VendorSelectionProps) {
  return (
    <Card className="w-full border-none shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Select a Vendor</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">Choose your preferred vendor to continue</p>
      </CardHeader>
      <CardContent>
        {vendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-center text-gray-500 text-sm">No vendors available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {vendors.map((vendor) => {
              const isSelected = selectedVendor?._id === vendor._id;
              
              return (
                <button
                  key={vendor._id}
                  onClick={() => onSelectVendor(vendor)}
                  className={`
                    relative group overflow-hidden rounded-lg border-2 p-4 text-left
                    transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
                    ${isSelected 
                      ? 'border-primary bg-primary/5 shadow-sm' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                  `}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  )}

                  {/* Vendor Image */}
                  <div className="flex items-center gap-3 mb-3">
                    {vendor.image ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-100">
                        <Image
                          src={vendor.image}
                          alt={vendor.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-semibold text-gray-600">
                          {vendor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 truncate">
                        {vendor.name}
                      </h3>
                    </div>
                  </div>

                  {/* Vendor Description */}
                  {vendor.description && (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {vendor.description}
                    </p>
                  )}

                  {/* Hover Effect Gradient */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
                    ${isSelected ? 'opacity-100' : ''}
                  `} />
                </button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
