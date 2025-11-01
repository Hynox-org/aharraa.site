"use client"

import { IoClose, IoCheckmarkCircle } from "react-icons/io5"
import { PersonDetails } from "@/lib/types"

interface EditPersonDetailsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingPersonDetails: PersonDetails[]
  onPersonDetailChange: (index: number, field: keyof PersonDetails, value: string) => void
  onSave: () => void
}

export function EditPersonDetailsDialog({
  isOpen,
  onOpenChange,
  editingPersonDetails,
  onPersonDetailChange,
  onSave,
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

  const handleSave = () => {
    if (areAllDetailsValid()) {
      onSave()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" 
      style={{ backgroundColor: "rgba(40, 54, 24, 0.8)" }}
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="w-full sm:w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-xl shadow-2xl"
        style={{ backgroundColor: "#FEFAE0" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 p-4 sm:p-6 pb-3 sm:pb-4" style={{ backgroundColor: "#FEFAE0", borderBottom: "1px solid rgba(221, 161, 94, 0.2)" }}>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-lg sm:text-xl font-bold mb-1" style={{ color: "#283618" }}>
                Edit Person Details
              </h2>
              <p className="text-xs sm:text-sm" style={{ color: "#606C38" }}>
                Update names and phone numbers
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0"
              style={{ backgroundColor: "#DDA15E", color: "#FEFAE0" }}
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {editingPersonDetails.map((person, index) => {
            const nameError = person.name && !isNameValid(person.name)
            const phoneError = person.phoneNumber && !isPhoneValid(person.phoneNumber)

            return (
              <div 
                key={index} 
                className="p-3 sm:p-4 rounded-lg space-y-3 sm:space-y-4"
                style={{ 
                  backgroundColor: "#ffffff",
                  border: "2px solid #DDA15E"
                }}
              >
                {/* Person Number */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ 
                      backgroundColor: "#606C38",
                      color: "#FEFAE0"
                    }}>
                    {index + 1}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold" style={{ color: "#283618" }}>
                    Person {index + 1}
                  </h4>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2" style={{ color: "#283618" }}>
                    Name <span style={{ color: "#BC6C25" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={person.name}
                    onChange={(e) => onPersonDetailChange(index, "name", e.target.value)}
                    required
                    className="w-full h-11 sm:h-12 px-3 sm:px-4 rounded-lg transition-all text-sm sm:text-base"
                    style={{
                      border: nameError 
                        ? "2px solid #BC6C25" 
                        : person.name && isNameValid(person.name)
                        ? "2px solid #606C38"
                        : "2px solid #DDA15E",
                      color: "#283618",
                      backgroundColor: "#FEFAE0"
                    }}
                  />
                  {nameError && (
                    <p className="text-xs mt-1" style={{ color: "#BC6C25" }}>
                      Name must be at least 2 characters
                    </p>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold mb-1.5 sm:mb-2" style={{ color: "#283618" }}>
                    Phone Number <span style={{ color: "#BC6C25" }}>*</span>
                  </label>
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
                    className="w-full h-11 sm:h-12 px-3 sm:px-4 rounded-lg transition-all text-sm sm:text-base"
                    style={{
                      border: phoneError 
                        ? "2px solid #BC6C25" 
                        : person.phoneNumber && isPhoneValid(person.phoneNumber)
                        ? "2px solid #606C38"
                        : "2px solid #DDA15E",
                      color: "#283618",
                      backgroundColor: "#FEFAE0"
                    }}
                  />
                  {phoneError && (
                    <p className="text-xs mt-1" style={{ color: "#BC6C25" }}>
                      Enter valid 10-digit number
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer - Sticky on Mobile */}
        <div 
          className="sticky bottom-0 p-4 sm:p-6 pt-3 sm:pt-4 flex flex-col sm:flex-row gap-2 sm:gap-3" 
          style={{ 
            backgroundColor: "#FEFAE0", 
            borderTop: "1px solid rgba(221, 161, 94, 0.3)",
            boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.05)"
          }}
        >
          <button
            onClick={() => onOpenChange(false)}
            className="w-full sm:flex-1 py-3 rounded-lg font-bold text-sm transition-all order-2 sm:order-1"
            style={{ 
              backgroundColor: "#ffffff",
              color: "#283618",
              border: "2px solid #DDA15E"
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!areAllDetailsValid()}
            className="w-full sm:flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed order-1 sm:order-2"
            style={{ 
              backgroundColor: "#606C38",
              color: "#FEFAE0"
            }}
          >
            <IoCheckmarkCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
