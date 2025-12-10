"use client"

import { IoLocation, IoCopy, IoCheckmarkCircle, IoNavigate, IoAlertCircle } from "react-icons/io5"
import { DeliveryAddress, MealCategory } from "@/lib/types"
import { TimeSlotSelector } from "./time-slot-selector"
import { useState } from "react"
import { Spinner } from "./ui/spinner"

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
  timeSlots: TimeSlot[]
  onTimeSlotChange: (category: MealCategory, slot: string) => void
}
interface TimeSlot {
  label: string
  value: string
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
  showCopyOptions = true,
  timeSlots,
  onTimeSlotChange,
}: DeliveryAddressCardProps) {
  const [showCopyMenu, setShowCopyMenu] = useState(false)
  const [isGeolocationLoading, setIsGeolocationLoading] = useState(false)
  const [isCopyingAddress, setIsCopyingAddress] = useState(false)
  
  const isStreetValid = (street: string) => street.trim().length >= 5
  const isZipValid = (zip: string) => /^641\d{3}$/.test(zip)

  const streetError = address?.street && !isStreetValid(address.street)
  const zipError = address?.zip && !isZipValid(address.zip)
  const isComplete = address?.street && isStreetValid(address.street) && address?.zip && isZipValid(address.zip)
  
  const availableCopyTargets = allCategories.filter(cat => cat !== category)

  return (
    <div 
      className={`bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-sm border border-gray-100 relative overflow-hidden transition-all duration-300 ${
        isDisabled ? 'opacity-60' : 'hover:shadow-md'
      }`}
      // style={{ pointerEvents: isDisabled ? "none" : "auto" }}
    >
      {/* Completion Badge */}
      {isComplete && !isDisabled && (
        <div className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 z-20">
          <div className="relative">
            <div className="absolute inset-0 bg-[#3CB371] rounded-full blur-sm opacity-60 animate-pulse" />
            <div className="relative bg-[#3CB371] rounded-full p-1 md:p-1.5 shadow-lg">
              <IoCheckmarkCircle className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>
      )}

      {/* Primary Badge */}
      {isPrimary && (
        <div className="absolute top-2 right-2 md:top-4 md:right-4 px-2 py-0.5 md:px-3 md:py-1.5 bg-black rounded-full flex items-center gap-1 md:gap-1.5 text-[9px] md:text-xs font-bold text-white shadow-md">
          <IoCheckmarkCircle className="w-2.5 h-2.5 md:w-3.5 md:h-3.5" />
          <span>PRIMARY</span>
        </div>
      )}

      {/* Disabled Overlay Label */}
      {isDisabled && (
        <div className="absolute top-2 right-2 md:top-4 md:right-4 px-2 py-0.5 md:px-3 md:py-1.5 bg-gray-400 rounded-full text-[9px] md:text-xs font-bold text-white shadow-md">
          <span className="hidden sm:inline">USING PRIMARY</span>
          <span className="sm:hidden">PRIMARY</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-6 pr-20 md:pr-32">
        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-md transition-all ${
          isComplete 
            ? 'bg-[#3CB371] scale-105' 
            : 'bg-gradient-to-br from-gray-100 to-gray-200'
        }`}>
          <IoLocation className={`w-5 h-5 md:w-7 md:h-7 ${isComplete ? 'text-white' : 'text-gray-600'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-lg font-bold text-black truncate">
            {category} Delivery
          </h3>
          <p className="text-[10px] md:text-sm text-gray-500">
            Enter delivery address
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col xs:flex-row gap-2 md:gap-3 mb-3 md:mb-6">
        {/* Geolocation Button */}
        {/* <button
          onClick={async () => {
            setIsGeolocationLoading(true);
            await onGeolocation(category);
            setIsGeolocationLoading(false);
          }}
          disabled={isDisabled || isGeolocationLoading}
          className="w-full h-9 md:h-11 px-3 md:px-4 rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 text-[11px] md:text-sm font-semibold transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeolocationLoading ? (
            <Spinner className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-700" />
          ) : (
            <IoNavigate className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
          )}
          <span>Get Location</span>
        </button> */}

        {/* Copy Address Button */}
        {showCopyOptions && onCopyAddress && availableCopyTargets.length > 0 && (
          <div className="relative flex-1">
            <button
              onClick={() => setShowCopyMenu(!showCopyMenu)}
              disabled={isDisabled || isCopyingAddress}
              className="w-full h-9 md:h-11 px-3 md:px-4 rounded-lg md:rounded-xl flex items-center justify-center gap-1.5 md:gap-2 text-[11px] md:text-sm font-semibold transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 disabled:opacity-50"
            >
              {isCopyingAddress ? (
                <Spinner className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-700" />
              ) : (
                <IoCopy className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
              )}
              <span>Copy to...</span>
            </button>
            
            {/* Copy Menu Dropdown */}
            {showCopyMenu && (
              <div className="absolute left-0 right-0 xs:left-auto xs:right-0 top-full mt-2 z-10 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 min-w-full xs:min-w-[180px]">
                {availableCopyTargets.map((targetCategory) => (
                  <button
                    key={targetCategory}
                    onClick={async () => {
                      setIsCopyingAddress(true);
                      setShowCopyMenu(false);
                      await onCopyAddress(category, targetCategory);
                      setIsCopyingAddress(false);
                    }}
                    disabled={isCopyingAddress}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs md:text-sm font-semibold transition-all text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <div className="space-y-3 md:space-y-5">
        {/* Street Address */}
        <div>
          <label className="block text-[11px] md:text-sm font-bold mb-1.5 md:mb-2 text-black">
            Street Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={address?.street || ""}
              onChange={(e) => onAddressChange(category, "street", e.target.value)}
              placeholder="Enter your street address"
              required
              disabled={isDisabled}
              className={`w-full h-10 md:h-12 px-3 md:px-4 pr-9 md:pr-12 rounded-lg md:rounded-xl text-xs md:text-base text-black bg-white placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                streetError 
                  ? 'border-2 border-red-400 focus:ring-red-400' 
                  : address?.street && isStreetValid(address.street)
                  ? 'border-2 border-[#3CB371] focus:ring-[#3CB371]'
                  : 'border-2 border-gray-200 focus:ring-gray-300 hover:border-gray-300'
              }`}
            />
            {address?.street && (
              <div className="absolute right-2.5 md:right-4 top-1/2 -translate-y-1/2">
                {isStreetValid(address.street) ? (
                  <IoCheckmarkCircle className="w-4 h-4 md:w-5 md:h-5 text-[#3CB371]" strokeWidth={2.5} />
                ) : (
                  <IoAlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400" strokeWidth={2.5} />
                )}
              </div>
            )}
          </div>
          {streetError && (
            <div className="flex items-center gap-1 md:gap-1.5 mt-1.5 md:mt-2 text-red-500">
              <IoAlertCircle className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" strokeWidth={2.5} />
              <p className="text-[10px] md:text-sm font-medium">
                Street address must be at least 5 characters
              </p>
            </div>
          )}
        </div>

        {/* City and Zip Code */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 md:gap-4">
          {/* City */}
          <div>
            <label className="block text-[11px] md:text-sm font-bold mb-1.5 md:mb-2 text-black">
              City
            </label>
            <input
              type="text"
              value="Coimbatore"
              disabled
              className="w-full h-10 md:h-12 px-3 md:px-4 rounded-lg md:rounded-xl text-xs md:text-base border-2 border-gray-200 text-gray-500 bg-gray-50 cursor-not-allowed"
            />
            <p className="text-[9px] md:text-xs mt-1 md:mt-1.5 text-gray-400">
              Currently serving Coimbatore only
            </p>
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-[11px] md:text-sm font-bold mb-1.5 md:mb-2 text-black">
              Zip Code <span className="text-red-500">*</span>
            </label>
            <div className="relative">
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
                className={`w-full h-10 md:h-12 px-3 md:px-4 pr-9 md:pr-12 rounded-lg md:rounded-xl text-xs md:text-base text-black bg-white placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  zipError 
                    ? 'border-2 border-red-400 focus:ring-red-400' 
                    : address?.zip && isZipValid(address.zip)
                    ? 'border-2 border-[#3CB371] focus:ring-[#3CB371]'
                    : 'border-2 border-gray-200 focus:ring-gray-300 hover:border-gray-300'
                }`}
              />
              {address?.zip && (
                <div className="absolute right-2.5 md:right-4 top-1/2 -translate-y-1/2">
                  {isZipValid(address.zip) ? (
                    <IoCheckmarkCircle className="w-4 h-4 md:w-5 md:h-5 text-[#3CB371]" strokeWidth={2.5} />
                  ) : (
                    <IoAlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400" strokeWidth={2.5} />
                  )}
                </div>
              )}
            </div>
            {zipError && (
              <div className="flex items-center gap-1 md:gap-1.5 mt-1.5 md:mt-2 text-red-500">
                <IoAlertCircle className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" strokeWidth={2.5} />
                <p className="text-[10px] md:text-sm font-medium">
                  Enter valid Coimbatore zip code (starts with 641)
                </p>
              </div>
            )}
            {!zipError && (
              <p className="text-[9px] md:text-xs mt-1 md:mt-1.5 text-gray-400">
                Coimbatore zip codes start with 641
              </p>
            )}
          </div>
        </div>
            {/* Time Slot Selector */}
        <div className="pt-2 border-t border-gray-200">
          <TimeSlotSelector
            category={category}
            timeSlots={timeSlots}
            selectedSlot={address?.selectedTimeSlot}
            onSelectSlot={onTimeSlotChange}
            isDisabled={false}
          />
        </div>
        {/* Info Box */}
        <div className="p-2.5 md:p-4 rounded-lg md:rounded-xl bg-gray-50 border border-gray-200">
          <p className="text-[10px] md:text-sm text-gray-700 leading-relaxed">
            <span className="text-red-500 font-bold">*</span> All fields are mandatory. We currently deliver only in Coimbatore.
          </p>
        </div>
      </div>
    </div>
  )
}
