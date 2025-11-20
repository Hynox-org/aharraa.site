"use client"

import { IoLocation, IoCopy, IoCheckmarkCircle } from "react-icons/io5"
import { DeliveryAddress, MealCategory } from "@/lib/types"
import { useState } from "react"

interface DeliveryAddressCardProps {
  category: MealCategory
  address: DeliveryAddress | undefined
  onAddressChange: (category: MealCategory, field: keyof DeliveryAddress, value: string) => void
  onGeolocation: (category: MealCategory) => void
  onCopyAddress?: (fromCategory: MealCategory, toCategory: MealCategory) => void
  isPrimary?: boolean
  isDisabled?: boolean
  allCategories?: MealCategory[]
  showCopyOptions?: boolean
}

export function DeliveryAddressCard({ 
  category, 
  address, 
  onAddressChange, 
  onGeolocation,
  onCopyAddress,
  isPrimary = false,
  isDisabled = false,
  allCategories = [],
  showCopyOptions = true
}: DeliveryAddressCardProps) {
  const [showCopyMenu, setShowCopyMenu] = useState(false)
  
  // Validation helpers
  const isStreetValid = (street: string) => street.trim().length >= 5
  const isZipValid = (zip: string) => /^641\d{3}$/.test(zip)

  const streetError = address?.street && !isStreetValid(address.street)
  const zipError = address?.zip && !isZipValid(address.zip)
  
  const availableCopyTargets = allCategories.filter(cat => cat !== category)

  return (
    <div 
      className="rounded-xl p-4 sm:p-6 shadow-md relative" 
      style={{ 
        backgroundColor: "#ffffff",
        opacity: isDisabled ? 0.6 : 1,
        pointerEvents: isDisabled ? "none" : "auto"
      }}
    >
      {/* Primary Badge */}
      {isPrimary && (
        <div 
          className="absolute top-4 right-4 px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold"
          style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
        >
          <IoCheckmarkCircle className="w-4 h-4" />
          PRIMARY
        </div>
      )}

      {/* Disabled Overlay Label */}
      {isDisabled && (
        <div 
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
          style={{ backgroundColor: "#DDA15E", color: "#FEFAE0" }}
        >
          USING PRIMARY ADDRESS
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div 
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #606C38, #283618)" }}
        >
          <IoLocation className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#FEFAE0" }} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold mb-1" style={{ color: "#283618" }}>
            Delivery Details
          </h3>
          <p className="text-sm" style={{ color: "#606C38" }}>
            {category}
          </p>
        </div>
        
        {/* Copy Address Button */}
        {showCopyOptions && onCopyAddress && availableCopyTargets.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowCopyMenu(!showCopyMenu)}
              className="h-9 px-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-all"
              style={{ 
                backgroundColor: "#DDA15E",
                color: "#FEFAE0"
              }}
            >
              <IoCopy className="w-4 h-4" />
              Copy to...
            </button>
            
            {/* Copy Menu Dropdown */}
            {showCopyMenu && (
              <div 
                className="absolute right-0 top-12 z-10 rounded-lg shadow-lg p-2 min-w-[160px]"
                style={{ backgroundColor: "#ffffff", border: "2px solid #DDA15E" }}
              >
                {availableCopyTargets.map((targetCategory) => (
                  <button
                    key={targetCategory}
                    onClick={() => {
                      onCopyAddress(category, targetCategory)
                      setShowCopyMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all hover:bg-opacity-10"
                    style={{ 
                      color: "#283618",
                      backgroundColor: "transparent"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(96, 108, 56, 0.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    Copy to {targetCategory}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-4 sm:space-y-5">
        {/* Street Address */}
        <div>
          <label className="block text-xs sm:text-sm font-bold mb-2" style={{ color: "#283618" }}>
            Street Address <span style={{ color: "#BC6C25" }}>*</span>
          </label>
          <input
            type="text"
            value={address?.street || ""}
            onChange={(e) => onAddressChange(category, "street", e.target.value)}
            placeholder="Enter your street address"
            required
            disabled={isDisabled}
            className="w-full h-11 sm:h-12 px-3 sm:px-4 rounded-lg transition-all text-sm sm:text-base"
            style={{
              border: streetError 
                ? "2px solid #BC6C25" 
                : address?.street && isStreetValid(address.street)
                ? "2px solid #606C38"
                : "2px solid #DDA15E",
              color: "#283618",
              backgroundColor: "#FEFAE0"
            }}
          />
          {streetError && (
            <p className="text-xs mt-1" style={{ color: "#BC6C25" }}>
              Street address must be at least 5 characters
            </p>
          )}
        </div>

        {/* City and Zip Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* City */}
          <div>
            <label className="block text-xs sm:text-sm font-bold mb-2" style={{ color: "#283618" }}>
              City
            </label>
            <input
              type="text"
              value="Coimbatore"
              disabled
              className="w-full h-11 sm:h-12 px-3 sm:px-4 rounded-lg text-sm sm:text-base"
              style={{
                border: "2px solid #DDA15E",
                color: "#606C38",
                backgroundColor: "rgba(221, 161, 94, 0.1)",
                cursor: "not-allowed"
              }}
            />
            <p className="text-xs mt-1" style={{ color: "#606C38" }}>
              Currently serving Coimbatore only
            </p>
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-xs sm:text-sm font-bold mb-2" style={{ color: "#283618" }}>
              Zip Code <span style={{ color: "#BC6C25" }}>*</span>
            </label>
            <input
              type="text"
              value={address?.zip || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                onAddressChange(category, "zip", value)
              }}
              placeholder="641001"
              required
              disabled={isDisabled}
              maxLength={6}
              className="w-full h-11 sm:h-12 px-3 sm:px-4 rounded-lg transition-all text-sm sm:text-base"
              style={{
                border: zipError 
                  ? "2px solid #BC6C25" 
                  : address?.zip && isZipValid(address.zip)
                  ? "2px solid #606C38"
                  : "2px solid #DDA15E",
                color: "#283618",
                backgroundColor: "#FEFAE0"
              }}
            />
            {zipError && (
              <p className="text-xs mt-1" style={{ color: "#BC6C25" }}>
                Enter valid Coimbatore zip code (starts with 641)
              </p>
            )}
            {!zipError && (
              <p className="text-xs mt-1" style={{ color: "#606C38" }}>
                Coimbatore zip codes (e.g., 641001)
              </p>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3 sm:p-4 rounded-lg" style={{ backgroundColor: "rgba(96, 108, 56, 0.1)" }}>
          <p className="text-xs sm:text-sm font-medium" style={{ color: "#606C38" }}>
            <span style={{ color: "#BC6C25" }}>*</span> All fields are mandatory. We currently deliver only in Coimbatore.
          </p>
        </div>
      </div>
    </div>
  )
}
