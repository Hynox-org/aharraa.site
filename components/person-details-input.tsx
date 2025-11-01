"use client"

import { PersonDetails } from "@/lib/types"

interface PersonDetailsInputProps {
  quantity: number
  personDetails: PersonDetails[]
  onPersonDetailChange: (index: number, field: keyof PersonDetails, value: string) => void
}

export function PersonDetailsInput({ quantity, personDetails, onPersonDetailChange }: PersonDetailsInputProps) {
  // Validation helpers
  const isNameValid = (name: string) => name.trim().length >= 2
  const isPhoneValid = (phone: string) => /^[6-9]\d{9}$/.test(phone)

  return (
    <div className="py-8">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6" style={{ color: "#283618" }}>
        Person Details
      </h2>

      {/* Details Card */}
      <div className="p-6 rounded-xl space-y-6" style={{ backgroundColor: "#FEFAE0" }}>
        {Array.from({ length: quantity }).map((_, index) => {
          const person = personDetails[index] || { name: "", phoneNumber: "" }
          const nameError = person.name && !isNameValid(person.name)
          const phoneError = person.phoneNumber && !isPhoneValid(person.phoneNumber)

          return (
            <div 
              key={index} 
              className="p-4 rounded-lg space-y-4"
              style={{ 
                backgroundColor: "#ffffff",
                border: "2px solid #DDA15E"
              }}
            >
              {/* Person Number */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                  style={{ 
                    backgroundColor: "#606C38",
                    color: "#FEFAE0"
                  }}>
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold" style={{ color: "#283618" }}>
                  Person {index + 1}
                </h3>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "#283618" }}>
                  Name <span style={{ color: "#BC6C25" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={person.name}
                  onChange={(e) => onPersonDetailChange(index, "name", e.target.value)}
                  required
                  className="w-full h-12 px-4 rounded-lg transition-all"
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
                <label className="block text-sm font-bold mb-2" style={{ color: "#283618" }}>
                  Phone Number <span style={{ color: "#BC6C25" }}>*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={person.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
                    onPersonDetailChange(index, "phoneNumber", value)
                  }}
                  required
                  maxLength={10}
                  className="w-full h-12 px-4 rounded-lg transition-all"
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
                    Enter a valid 10-digit Indian mobile number
                  </p>
                )}
              </div>
            </div>
          )
        })}

        {/* Info Box */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: "rgba(96, 108, 56, 0.1)" }}>
          <p className="text-xs font-medium" style={{ color: "#606C38" }}>
            <span style={{ color: "#BC6C25" }}>*</span> All fields are mandatory. Please provide accurate details for meal delivery.
          </p>
        </div>
      </div>
    </div>
  )
}
