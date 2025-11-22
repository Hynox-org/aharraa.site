"use client";

import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Calendar, Clock, Check, ChevronLeft, ChevronRight } from "lucide-react";
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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
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
    <div className="py-4 md:py-6 px-4">
      {/* Minimal Header */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
          Select Start Date
        </h2>
        <p className="text-xs md:text-sm text-gray-500">
          When should your meals begin?
        </p>
      </div>

      {/* Date Selection Container */}
      <div className="max-w-lg mx-auto">
        {/* Date Display - Floating Circle Style */}
        <div className="relative mb-6 md:mb-8">
          {startDate && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl opacity-60" />
          )}
          
          <button
            onClick={() => !isDisabled && setShowCalendar(!showCalendar)}
            disabled={isDisabled}
            className={`
              relative w-full px-6 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-3xl
              flex items-center justify-between gap-3
              transition-all duration-300 filter
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                startDate 
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white drop-shadow-2xl scale-[1.02]' 
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 drop-shadow-lg hover:drop-shadow-xl'
              }
            `}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" strokeWidth={2.5} />
              <div className="text-left min-w-0">
                <p className={`text-[10px] md:text-xs font-semibold uppercase tracking-wide ${startDate ? 'text-white/80' : 'text-gray-500'}`}>
                  Start Date
                </p>
                <p className="text-sm md:text-base lg:text-lg font-bold truncate">
                  {startDate ? format(startDate, "EEEE, MMM d, yyyy") : "Choose a date"}
                </p>
              </div>
            </div>
            {startDate && (
              <div className="flex-shrink-0">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Check className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Calendar Dropdown */}
        {showCalendar && (
          <div className="bg-white rounded-2xl md:rounded-3xl border-2 border-gray-200 p-4 md:p-6 shadow-2xl mb-6 md:mb-8">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-5 md:mb-6">
              <button
                onClick={() => changeMonth(-1)}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 
                         flex items-center justify-center transition-all active:scale-95"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-700" strokeWidth={2.5} />
              </button>
              
              <h3 className="text-base md:text-lg font-bold text-gray-900">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              
              <button
                onClick={() => changeMonth(1)}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-100 hover:bg-gray-200 
                         flex items-center justify-center transition-all active:scale-95"
                aria-label="Next month"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-700" strokeWidth={2.5} />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2 md:mb-3">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div
                  key={day + i}
                  className="text-center text-[10px] md:text-xs font-bold text-gray-500 py-1 md:py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {/* Empty cells */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Days */}
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
                    className={`
                      aspect-square rounded-lg md:rounded-xl
                      text-xs md:text-sm font-semibold
                      transition-all duration-200
                      flex items-center justify-center relative
                      ${
                        selected
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg scale-105'
                          : disabled || isDisabled
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95'
                      }
                    `}
                  >
                    {day}
                    {todayDate && !selected && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Delivery Info - Minimal */}
        {startDate && endDate && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl opacity-60" />
            
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl md:rounded-3xl p-5 md:p-6 text-white shadow-2xl">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold mb-1 md:mb-2 text-sm md:text-base">
                    Deliveries Scheduled
                  </h4>
                  <p className="text-xs md:text-sm text-white/90 leading-relaxed">
                    Daily meals from{" "}
                    <span className="font-bold">{format(startDate, "MMM d")}</span>
                    {" "}to{" "}
                    <span className="font-bold">{format(endDate, "MMM d, yyyy")}</span>
                  </p>
                  <div className="mt-2 md:mt-3 flex items-center gap-2">
                    <div className="px-2.5 md:px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                      <p className="text-[10px] md:text-xs font-semibold">
                        {selectedPlan.durationDays} days
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Helper Text */}
        {!startDate && (
          <p className="text-center text-xs md:text-sm text-gray-400">
            Select any future date to begin
          </p>
        )}
      </div>
    </div>
  );
}
