"use client"

import { PersonDetails } from "@/lib/types"
import { User, Phone, CheckCircle2, AlertCircle } from "lucide-react"

interface PersonDetailsInputProps {
  quantity: number
  personDetails: PersonDetails[]
  onPersonDetailChange: (index: number, field: keyof PersonDetails, value: string) => void
}

export function PersonDetailsInput({ quantity, personDetails, onPersonDetailChange }: PersonDetailsInputProps) {
  // Validation helpers
  const isNameValid = (name: string) => name.trim().length >= 2
  const isPhoneValid = (phone: string) => /^[6-9]\d{9}$/.test(phone)

  const completedCount = personDetails.filter(p => 
    p && isNameValid(p.name) && isPhoneValid(p.phoneNumber)
  ).length

  return (
    <div className="py-4 md:py-6 px-4">
      {/* Minimal Header */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
          Person Details
        </h2>
        <p className="text-xs md:text-sm text-gray-500">
          Contact info for meal delivery
        </p>
      </div>

      {/* Details Container */}
      <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
        {Array.from({ length: quantity }).map((_, index) => {
          const person = personDetails[index] || { name: "", phoneNumber: "" }
          const nameError = person.name && !isNameValid(person.name)
          const phoneError = person.phoneNumber && !isPhoneValid(person.phoneNumber)
          const nameSuccess = person.name && isNameValid(person.name)
          const phoneSuccess = person.phoneNumber && isPhoneValid(person.phoneNumber)
          const isComplete = nameSuccess && phoneSuccess

          return (
            <div key={index} className="relative">
              {/* Glow Effect for Completed */}
              {isComplete && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl opacity-60" />
              )}

              {/* Floating Card */}
              <div className="relative">
                {/* Person Number Badge - Floating */}
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="relative">
                    <div className={`
                      w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center
                      transition-all duration-300 filter
                      ${
                        isComplete
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600 drop-shadow-2xl scale-110"
                          : "bg-gradient-to-br from-gray-100 to-gray-200 drop-shadow-xl"
                      }
                    `}>
                      <span className={`text-xl md:text-2xl font-black ${isComplete ? "text-white" : "text-gray-700"}`}>
                        {index + 1}
                      </span>
                    </div>
                    
                    {/* Completion Badge */}
                    {isComplete && (
                      <div className="absolute -top-1 -right-1">
                        <div className="relative">
                          <div className="absolute inset-0 bg-emerald-400 rounded-full blur-sm opacity-60 animate-pulse" />
                          <div className="relative bg-emerald-500 rounded-full p-1 shadow-lg">
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={3} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 md:space-y-5">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-gray-800 mb-2 ml-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <User className="w-4 h-4 md:w-5 md:h-5 text-gray-400" strokeWidth={2} />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={person.name}
                        onChange={(e) => onPersonDetailChange(index, "name", e.target.value)}
                        required
                        className={`
                          w-full h-11 md:h-12 pl-10 md:pl-12 pr-10 md:pr-12 rounded-full
                          text-sm md:text-base text-gray-900 bg-white placeholder:text-gray-400
                          transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-offset-2
                          ${
                            nameError 
                              ? 'border-2 border-red-400 focus:ring-red-400' 
                              : nameSuccess
                              ? 'border-2 border-emerald-500 focus:ring-emerald-500'
                              : 'border-2 border-gray-200 focus:ring-gray-300 hover:border-gray-300'
                          }
                        `}
                      />
                      {/* Validation Icon */}
                      {person.name && (
                        <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2">
                          {nameSuccess ? (
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" strokeWidth={2.5} />
                          ) : (
                            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400" strokeWidth={2.5} />
                          )}
                        </div>
                      )}
                    </div>
                    {/* Error Message */}
                    {nameError && (
                      <div className="flex items-center gap-1.5 mt-2 ml-1 text-red-500">
                        <AlertCircle className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" strokeWidth={2.5} />
                        <p className="text-[10px] md:text-xs font-medium">
                          Name must be at least 2 characters
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-xs md:text-sm font-bold text-gray-800 mb-2 ml-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-400" strokeWidth={2} />
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
                        className={`
                          w-full h-11 md:h-12 pl-16 md:pl-20 pr-10 md:pr-12 rounded-full
                          text-sm md:text-base text-gray-900 bg-white placeholder:text-gray-400
                          transition-all duration-200
                          focus:outline-none focus:ring-2 focus:ring-offset-2
                          ${
                            phoneError 
                              ? 'border-2 border-red-400 focus:ring-red-400' 
                              : phoneSuccess
                              ? 'border-2 border-emerald-500 focus:ring-emerald-500'
                              : 'border-2 border-gray-200 focus:ring-gray-300 hover:border-gray-300'
                          }
                        `}
                      />
                      {/* Validation Icon */}
                      {person.phoneNumber && (
                        <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2">
                          {phoneSuccess ? (
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" strokeWidth={2.5} />
                          ) : (
                            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400" strokeWidth={2.5} />
                          )}
                        </div>
                      )}
                    </div>
                    {/* Error Message */}
                    {phoneError && (
                      <div className="flex items-center gap-1.5 mt-2 ml-1 text-red-500">
                        <AlertCircle className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" strokeWidth={2.5} />
                        <p className="text-[10px] md:text-xs font-medium">
                          Enter valid 10-digit Indian mobile number
                        </p>
                      </div>
                    )}
                    {/* Helper Text */}
                    {!phoneError && person.phoneNumber.length > 0 && person.phoneNumber.length < 10 && (
                      <p className="text-[10px] md:text-xs text-gray-400 mt-2 ml-1">
                        {10 - person.phoneNumber.length} digit{person.phoneNumber.length !== 9 ? 's' : ''} remaining
                      </p>
                    )}
                  </div>
                </div>

                {/* Completion Message */}
                {isComplete && (
                  <div className="mt-4 md:mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
                      <p className="text-xs md:text-sm font-semibold">
                        Details completed
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Overall Progress */}
        {quantity > 1 && (
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm md:text-base font-bold text-gray-900">
                Progress
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs md:text-sm font-bold text-gray-700">
                {completedCount} / {quantity}
              </span>
            </div>
            <div className="max-w-xs mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-2 md:h-2.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500 rounded-full"
                  style={{ width: `${(completedCount / quantity) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Helper Note */}
        <p className="text-center text-[10px] md:text-xs text-gray-400 max-w-md mx-auto">
          We'll send delivery updates to these numbers
        </p>
      </div>
    </div>
  )
}
