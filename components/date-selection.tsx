"use client"

import { format } from "date-fns"
import { useState, useEffect } from "react"
import { IoCalendarOutline, IoTimeOutline, IoCheckmarkCircle } from "react-icons/io5"
import { Plan } from "@/lib/types"

interface DateSelectionProps {
  startDate: Date | undefined
  endDate: Date | undefined
  selectedPlan: Plan
  onDateSelect: (date: Date | undefined) => void
  isDisabled: boolean
}

export function DateSelection({ startDate, endDate, selectedPlan, onDateSelect, isDisabled }: DateSelectionProps) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    if (isDisabled && showCalendar) {
      setShowCalendar(false)
    }
  }, [isDisabled, showCalendar])

  // Get days in current month view
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isDateDisabled = (day: number) => {
    const date = new Date(year, month, day)
    return date < today
  }

  const isDateSelected = (day: number) => {
    if (!startDate) return false
    const date = new Date(year, month, day)
    return date.toDateString() === startDate.toDateString()
  }

  const handleDateClick = (day: number) => {
    const selected = new Date(year, month, day)
    if (!isDateDisabled(day)) {
      onDateSelect(selected)
      setShowCalendar(false)
    }
  }

  const changeMonth = (direction: number) => {
    setCurrentMonth(new Date(year, month + direction, 1))
  }

  return (
    <div className="py-8">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6" style={{ color: "#283618" }}>
        Select Start Date
      </h2>

      {/* Date Card */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: "#FEFAE0" }}>
        {/* Date Button */}
        <button
          onClick={() => !isDisabled && setShowCalendar(!showCalendar)}
          disabled={isDisabled}
          className="w-full h-14 px-4 rounded-lg font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: startDate ? "#606C38" : "#ffffff",
            color: startDate ? "#FEFAE0" : "#606C38",
            border: `2px solid ${startDate ? "#283618" : "#DDA15E"}`
          }}
        >
          <IoCalendarOutline className="w-5 h-5" />
          {startDate ? format(startDate, "EEEE, MMMM do, yyyy") : "Click to select start date"}
        </button>

        {/* Simple Calendar Dropdown */}
        {showCalendar && (
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: "#ffffff", border: "2px solid #DDA15E" }}>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => changeMonth(-1)}
                className="w-8 h-8 rounded-lg font-bold transition-all"
                style={{ backgroundColor: "#DDA15E", color: "#FEFAE0" }}
              >
                ←
              </button>
              <span className="font-bold" style={{ color: "#283618" }}>
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <button
                onClick={() => changeMonth(1)}
                className="w-8 h-8 rounded-lg font-bold transition-all"
                style={{ backgroundColor: "#DDA15E", color: "#FEFAE0" }}
              >
                →
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="text-center text-xs font-bold" style={{ color: "#606C38" }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const disabled = isDateDisabled(day)
                const selected = isDateSelected(day)

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    disabled={disabled || isDisabled}
                    className="w-full aspect-square rounded-lg text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: selected ? "#606C38" : disabled || isDisabled ? "#f5f5f5" : "#FEFAE0",
                      color: selected ? "#FEFAE0" : "#283618",
                      border: selected ? "2px solid #283618" : "1px solid #DDA15E"
                    }}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Delivery Period Info */}
        {startDate && endDate && (
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: "#606C38" }}>
            <div className="flex items-center gap-2 mb-2">
              <IoTimeOutline className="w-5 h-5" style={{ color: "#FEFAE0" }} />
              <p className="font-bold" style={{ color: "#FEFAE0" }}>Daily Deliveries</p>
            </div>
            <p className="text-sm" style={{ color: "#FEFAE0" }}>
              From <span className="font-bold">{format(startDate, "MMM d")}</span> to{" "}
              <span className="font-bold">{format(endDate, "MMM d, yyyy")}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
