"use client";

import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Calendar, Clock, Check, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { Plan } from "@/lib/types";

interface DateSelectionProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  selectedPlan: Plan;
  onDateSelect: (date: Date | undefined) => void;
  isDisabled: boolean;
}

export function DateSelection({
  startDate,
  endDate,
  selectedPlan,
  onDateSelect,
  isDisabled,
}: DateSelectionProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (isDisabled && showCalendar) {
      setShowCalendar(false);
    }
  }, [isDisabled, showCalendar]);

  // Get days in current month view
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateDisabled = (day: number) => {
    const date = new Date(year, month, day);
    return date <= today;
  };

  const isDateSelected = (day: number) => {
    if (!startDate) return false;
    const date = new Date(year, month, day);
    return date.toDateString() === startDate.toDateString();
  };

  const isToday = (day: number) => {
    const date = new Date(year, month, day);
    return date.toDateString() === today.toDateString();
  };

  const handleDateClick = (day: number) => {
    const selected = new Date(year, month, day);
    if (!isDateDisabled(day)) {
      onDateSelect(selected);
      setShowCalendar(false);
    }
  };

  const changeMonth = (direction: number) => {
    setCurrentMonth(new Date(year, month + direction, 1));
  };

  return (
    <div className="py-4 sm:py-8 px-2 sm:px-4 lg:px-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#283618] mb-1 sm:mb-2">
          Select Start Date
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Choose when you'd like your meal deliveries to begin
        </p>
      </div>

      {/* Date Selection Container */}
      <div className="max-w-2xl mx-auto bg-[#FEFAE0] rounded-xl sm:rounded-2xl border-2 border-[#DDA15E] p-4 sm:p-6 shadow-sm">
        {/* Date Trigger Button */}
        <button
          onClick={() => !isDisabled && setShowCalendar(!showCalendar)}
          disabled={isDisabled}
          className={`w-full h-12 sm:h-14 px-3 sm:px-5 rounded-lg sm:rounded-xl font-semibold 
                     flex items-center justify-between gap-2 sm:gap-3 
                     transition-all duration-200 hover:shadow-md 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     ${startDate 
                       ? 'bg-[#606C38] text-[#FEFAE0] border-2 border-[#283618]' 
                       : 'bg-white text-[#606C38] border-2 border-[#DDA15E] hover:border-[#BC6C25]'
                     }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" strokeWidth={2.5} />
            <span className="text-xs sm:text-sm md:text-base truncate">
              {startDate
                ? format(startDate, window.innerWidth < 640 ? "MMM d, yyyy" : "EEEE, MMMM do, yyyy")
                : "Select start date"}
            </span>
          </div>
          {startDate && (
            <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" strokeWidth={3} />
          )}
        </button>

        {/* Calendar Dropdown */}
        {showCalendar && (
          <div className="mt-3 sm:mt-4 bg-white rounded-lg sm:rounded-xl border-2 border-[#DDA15E] p-3 sm:p-4 md:p-5 shadow-lg">
            {/* Month Navigation Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-[#DDA15E]/30">
              <button
                onClick={() => changeMonth(-1)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#DDA15E] text-white 
                         flex items-center justify-center
                         transition-all duration-200 hover:bg-[#BC6C25] 
                         active:scale-95 touch-manipulation"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </button>
              
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#283618]">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              
              <button
                onClick={() => changeMonth(1)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#DDA15E] text-white 
                         flex items-center justify-center
                         transition-all duration-200 hover:bg-[#BC6C25] 
                         active:scale-95 touch-manipulation"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-2 mb-2 sm:mb-3">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => {
                const fullDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                return (
                  <div
                    key={day + i}
                    className="text-center text-[10px] sm:text-xs font-bold text-[#606C38] py-1 sm:py-2"
                  >
                    <span className="hidden sm:inline">{fullDays[i]}</span>
                    <span className="sm:hidden">{day}</span>
                  </div>
                );
              })}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const disabled = isDateDisabled(day);
                const selected = isDateSelected(day);
                const todayDate = isToday(day);

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    disabled={disabled || isDisabled}
                    className={`aspect-square rounded-md sm:rounded-lg 
                               text-[11px] sm:text-sm font-semibold 
                               transition-all duration-200
                               flex items-center justify-center relative
                               touch-manipulation
                               ${selected
                                 ? 'bg-[#606C38] text-white shadow-md scale-105 ring-1 sm:ring-2 ring-[#283618] ring-offset-1 sm:ring-offset-2'
                                 : disabled || isDisabled
                                 ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                 : 'bg-[#FEFAE0] text-[#283618] hover:bg-[#DDA15E] hover:text-white active:scale-95 border border-[#DDA15E]/40'
                               }`}
                  >
                    {day}
                    {todayDate && !selected && (
                      <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full bg-[#BC6C25]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#DDA15E]/30">
              <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-600 flex-wrap justify-center sm:justify-start">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#606C38]" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#FEFAE0] border border-[#DDA15E]/40" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-100" />
                  <span>Past</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Period Info */}
        {startDate && endDate && (
          <div className="mt-3 sm:mt-4 bg-[#606C38] rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#DDA15E] flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#FEFAE0] mb-1 text-sm sm:text-base">
                  Daily Deliveries Scheduled
                </h4>
                <p className="text-xs sm:text-sm text-[#FEFAE0]/90 leading-relaxed">
                  Your meals will be delivered daily from{" "}
                  <span className="font-bold text-white">
                    {format(startDate, "MMM d")}
                  </span>{" "}
                  to{" "}
                  <span className="font-bold text-white">
                    {format(endDate, "MMM d, yyyy")}
                  </span>
                </p>
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/20">
                  <p className="text-[10px] sm:text-xs text-[#FEFAE0]/80">
                    Total duration: <span className="font-semibold">{selectedPlan.durationDays} days</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Helper Info */}
        {!startDate && (
          <div className="mt-3 sm:mt-4 bg-blue-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs sm:text-sm font-bold text-blue-900 mb-0.5 sm:mb-1">
                  Choose Your Start Date
                </h5>
                <p className="text-[10px] sm:text-xs text-blue-800 leading-relaxed">
                  Select any future date to begin your {selectedPlan.durationDays}-day meal plan. 
                  Deliveries will arrive daily at your chosen time.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
