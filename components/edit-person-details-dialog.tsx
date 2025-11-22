"use client"

import { IoClose, IoCheckmarkCircle, IoAlertCircle, IoPerson, IoCall } from "react-icons/io5"
import { PersonDetails } from "@/lib/types"
import { Spinner } from "./ui/spinner"

interface EditPersonDetailsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingPersonDetails: PersonDetails[]
  onPersonDetailChange: (index: number, field: keyof PersonDetails, value: string) => void
  onSave: (cartItemId: string) => void
  currentEditingCartItemId: string | null
  isSaving: boolean
}

export function EditPersonDetailsDialog({
  isOpen,
  onOpenChange,
  editingPersonDetails,
  onPersonDetailChange,
  onSave,
  currentEditingCartItemId,
  isSaving,
}: EditPersonDetailsDialogProps) {
  if (!isOpen) return null

  // Validation helpers
  const isNameValid = (name: string) => name.trim().length >= 2
  const isPhoneValid = (phone: string) => /^[6-9]\d{9}$/.test(phone)

  const areAllDetailsValid = () => {
    return editingPersonDetails.every(person => {
      return isNameValid(person.name) && isPhoneValid(person.phoneNumber)
    })
  }

  console.log("currentEditingCartItemId:", currentEditingCartItemId);
  
  const handleSave = () => {
    if (areAllDetailsValid()) {
      if(currentEditingCartItemId){
        console.log("Saving person details...");
        onSave(currentEditingCartItemId);
      } else {
        console.log("currentEditingCartItemId is null");
      }
    } else {
      console.log("validation failed");
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="w-full sm:w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-t-3xl sm:rounded-3xl shadow-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="relative bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 p-5 md:p-6">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 md:top-5 md:right-5 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-all group"
          >
            <IoClose className="w-5 h-5 md:w-6 md:h-6 text-gray-600 group-hover:text-gray-900 group-hover:rotate-90 transition-all duration-200" />
          </button>

          <div className="flex items-center gap-3 pr-12">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <IoPerson className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Edit Person Details
              </h2>
              <p className="text-xs md:text-sm text-gray-500">
                Update contact information
              </p>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(95vh-200px)] sm:max-h-[calc(90vh-200px)] p-5 md:p-6 space-y-4 md:space-y-5">
          {editingPersonDetails.map((person, index) => {
            const nameError = person.name && !isNameValid(person.name)
            const phoneError = person.phoneNumber && !isPhoneValid(person.phoneNumber)
            const isComplete = isNameValid(person.name) && isPhoneValid(person.phoneNumber)

            return (
              <div 
                key={index} 
                className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 md:p-5 border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                {/* Completion Badge */}
                {isComplete && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full blur-sm opacity-60 animate-pulse" />
                      <div className="relative bg-emerald-500 rounded-full p-1.5 shadow-lg">
                        <IoCheckmarkCircle className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Person Number Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-md transition-all ${
                    isComplete 
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white scale-105' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {index + 1}
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-gray-900">
                    Person {index + 1}
                  </h4>
                </div>

                {/* Name Input */}
                <div className="mb-4">
                  <label className="block text-xs md:text-sm font-bold mb-2 text-gray-800">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <IoPerson className="w-4 h-4 md:w-5 md:h-5 text-gray-400" strokeWidth={2} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={person.name}
                      onChange={(e) => onPersonDetailChange(index, "name", e.target.value)}
                      required
                      className={`w-full h-11 md:h-12 pl-10 md:pl-12 pr-10 md:pr-12 rounded-xl text-sm md:text-base text-gray-900 bg-white placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        nameError 
                          ? 'border-2 border-red-400 focus:ring-red-400' 
                          : person.name && isNameValid(person.name)
                          ? 'border-2 border-emerald-500 focus:ring-emerald-500'
                          : 'border-2 border-gray-200 focus:ring-gray-300 hover:border-gray-300'
                      }`}
                    />
                    {person.name && (
                      <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2">
                        {isNameValid(person.name) ? (
                          <IoCheckmarkCircle className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
                        ) : (
                          <IoAlertCircle className="w-5 h-5 text-red-400" strokeWidth={2.5} />
                        )}
                      </div>
                    )}
                  </div>
                  {nameError && (
                    <div className="flex items-center gap-1.5 mt-2 text-red-500">
                      <IoAlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />
                      <p className="text-xs md:text-sm font-medium">
                        Name must be at least 2 characters
                      </p>
                    </div>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-xs md:text-sm font-bold mb-2 text-gray-800">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <IoCall className="w-4 h-4 md:w-5 md:h-5 text-gray-400" strokeWidth={2} />
                    </div>
                    <div className="absolute left-10 md:left-12 top-1/2 -translate-y-1/2 text-gray-600 font-semibold text-xs md:text-sm pointer-events-none">
                      +91
                    </div>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={person.phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                        onPersonDetailChange(index, "phoneNumber", value)
                      }}
                      required
                      maxLength={10}
                      className={`w-full h-11 md:h-12 pl-16 md:pl-20 pr-10 md:pr-12 rounded-xl text-sm md:text-base text-gray-900 bg-white placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        phoneError 
                          ? 'border-2 border-red-400 focus:ring-red-400' 
                          : person.phoneNumber && isPhoneValid(person.phoneNumber)
                          ? 'border-2 border-emerald-500 focus:ring-emerald-500'
                          : 'border-2 border-gray-200 focus:ring-gray-300 hover:border-gray-300'
                      }`}
                    />
                    {person.phoneNumber && (
                      <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2">
                        {isPhoneValid(person.phoneNumber) ? (
                          <IoCheckmarkCircle className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
                        ) : (
                          <IoAlertCircle className="w-5 h-5 text-red-400" strokeWidth={2.5} />
                        )}
                      </div>
                    )}
                  </div>
                  {phoneError && (
                    <div className="flex items-center gap-1.5 mt-2 text-red-500">
                      <IoAlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />
                      <p className="text-xs md:text-sm font-medium">
                        Enter valid 10-digit Indian mobile number
                      </p>
                    </div>
                  )}
                  {!phoneError && person.phoneNumber.length > 0 && person.phoneNumber.length < 10 && (
                    <p className="text-xs text-gray-400 mt-2">
                      {10 - person.phoneNumber.length} digit{person.phoneNumber.length !== 9 ? 's' : ''} remaining
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer - Sticky */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 md:p-6 flex flex-col-reverse sm:flex-row gap-3 shadow-lg">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full sm:flex-1 py-3 md:py-3.5 rounded-xl font-semibold text-sm md:text-base bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!areAllDetailsValid() || isSaving}
            className="w-full sm:flex-1 py-3 md:py-3.5 rounded-xl font-bold text-sm md:text-base bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <Spinner className="w-5 h-5 text-white" />
            ) : (
              <>
                <IoCheckmarkCircle className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
