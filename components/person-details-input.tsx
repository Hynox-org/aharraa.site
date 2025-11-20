"use client"

import { PersonDetails } from "@/lib/types"
import { User, Phone, CheckCircle2, AlertCircle, Info } from "lucide-react"

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
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#283618] mb-2">
          Person Details
        </h2>
        <p className="text-sm text-gray-600">
          Please provide accurate contact information for meal delivery
        </p>
      </div>

      {/* Details Container */}
      <div className="max-w-3xl mx-auto space-y-4">
        {Array.from({ length: quantity }).map((_, index) => {
          const person = personDetails[index] || { name: "", phoneNumber: "" }
          const nameError = person.name && !isNameValid(person.name)
          const phoneError = person.phoneNumber && !isPhoneValid(person.phoneNumber)
          const nameSuccess = person.name && isNameValid(person.name)
          const phoneSuccess = person.phoneNumber && isPhoneValid(person.phoneNumber)

          return (
            <div 
              key={index} 
              className="bg-[#FEFAE0] rounded-2xl border-2 border-[#DDA15E] p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Person Header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#DDA15E]/30">
                <div className="w-10 h-10 rounded-full bg-[#606C38] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-lg font-bold text-[#FEFAE0]">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#283618]">
                    Person {index + 1}
                  </h3>
                  <p className="text-xs text-gray-600">
                    Meal recipient details
                  </p>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#283618] mb-2">
                    Full Name <span className="text-[#BC6C25]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <User className="w-5 h-5 text-[#606C38]" strokeWidth={2} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={person.name}
                      onChange={(e) => onPersonDetailChange(index, "name", e.target.value)}
                      required
                      className={`w-full h-12 pl-12 pr-12 rounded-lg transition-all duration-200
                                 text-[#283618] bg-white placeholder:text-gray-400
                                 focus:outline-none focus:ring-2 focus:ring-offset-2
                                 ${nameError 
                                   ? 'border-2 border-[#BC6C25] focus:ring-[#BC6C25]' 
                                   : nameSuccess
                                   ? 'border-2 border-[#606C38] focus:ring-[#606C38]'
                                   : 'border-2 border-[#DDA15E] focus:ring-[#DDA15E]'
                                 }`}
                    />
                    {/* Validation Icon */}
                    {person.name && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {nameSuccess ? (
                          <CheckCircle2 className="w-5 h-5 text-[#606C38]" strokeWidth={2.5} />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-[#BC6C25]" strokeWidth={2.5} />
                        )}
                      </div>
                    )}
                  </div>
                  {/* Error Message */}
                  {nameError && (
                    <div className="flex items-center gap-1.5 mt-2 text-[#BC6C25]">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />
                      <p className="text-xs font-medium">
                        Name must be at least 2 characters
                      </p>
                    </div>
                  )}
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-semibold text-[#283618] mb-2">
                    Phone Number <span className="text-[#BC6C25]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Phone className="w-5 h-5 text-[#606C38]" strokeWidth={2} />
                    </div>
                    <div className="absolute left-12 top-1/2 -translate-y-1/2 text-[#606C38] font-medium text-sm pointer-events-none">
                      +91
                    </div>
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
                      className={`w-full h-12 pl-20 pr-12 rounded-lg transition-all duration-200
                                 text-[#283618] bg-white placeholder:text-gray-400
                                 focus:outline-none focus:ring-2 focus:ring-offset-2
                                 ${phoneError 
                                   ? 'border-2 border-[#BC6C25] focus:ring-[#BC6C25]' 
                                   : phoneSuccess
                                   ? 'border-2 border-[#606C38] focus:ring-[#606C38]'
                                   : 'border-2 border-[#DDA15E] focus:ring-[#DDA15E]'
                                 }`}
                    />
                    {/* Validation Icon */}
                    {person.phoneNumber && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {phoneSuccess ? (
                          <CheckCircle2 className="w-5 h-5 text-[#606C38]" strokeWidth={2.5} />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-[#BC6C25]" strokeWidth={2.5} />
                        )}
                      </div>
                    )}
                  </div>
                  {/* Error Message */}
                  {phoneError && (
                    <div className="flex items-center gap-1.5 mt-2 text-[#BC6C25]">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />
                      <p className="text-xs font-medium">
                        Enter a valid 10-digit Indian mobile number
                      </p>
                    </div>
                  )}
                  {/* Helper Text */}
                  {!phoneError && person.phoneNumber.length > 0 && person.phoneNumber.length < 10 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {10 - person.phoneNumber.length} digit{person.phoneNumber.length !== 9 ? 's' : ''} remaining
                    </p>
                  )}
                </div>
              </div>

              {/* Completion Status */}
              {nameSuccess && phoneSuccess && (
                <div className="mt-4 pt-4 border-t border-[#DDA15E]/30">
                  <div className="flex items-center gap-2 text-[#606C38]">
                    <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                    <p className="text-xs font-semibold">
                      Details completed for Person {index + 1}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Info Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-900 mb-1">
                Important Information
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                <span className="text-[#BC6C25] font-bold">*</span> All fields are mandatory. 
                Please provide accurate contact details for smooth meal delivery coordination. 
                Each person will receive notifications on their registered mobile number.
              </p>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        {quantity > 1 && (
          <div className="bg-white border-2 border-[#DDA15E] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-[#283618]">
                Form Completion
              </span>
              <span className="text-sm font-bold text-[#606C38]">
                {personDetails.filter(p => 
                  p && isNameValid(p.name) && isPhoneValid(p.phoneNumber)
                ).length} / {quantity}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#DDA15E] to-[#606C38] transition-all duration-300 rounded-full"
                style={{ 
                  width: `${(personDetails.filter(p => 
                    p && isNameValid(p.name) && isPhoneValid(p.phoneNumber)
                  ).length / quantity) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
