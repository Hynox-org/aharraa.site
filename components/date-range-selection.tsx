"use client"

import { useState } from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useStore } from "@/lib/store"

export function DateRangeSelection() {
  const selectedPlan = useStore((state) => state.selectedPlan)
  const setSelectedDates = useStore((state) => state.setSelectedDates)
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1))

  // Disable past dates and calculate the date range based on plan duration
  const disabledDates = {
    before: new Date(),
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate || !selectedPlan) return
    
    // Set the visible date in the calendar
    setDate(selectedDate)

    // Calculate the end date based on plan duration
    const endDate = addDays(selectedDate, selectedPlan.daysCount - 1)
    
    // Update selected dates in store
    setSelectedDates({
      startDate: selectedDate,
      endDate: endDate,
    })
  }

  const handleRandomDate = () => {
    if (!selectedPlan) return
    
    // Get tomorrow's date as the minimum start date
    const minStartDate = addDays(new Date(), 1)
    // Set maximum start date to allow full plan duration (30 days ahead minus plan duration)
    const maxStartDate = addDays(new Date(), 30 - selectedPlan.daysCount)
    
    // Generate random date between min and max
    const randomStartDate = new Date(
      minStartDate.getTime() + Math.random() * (maxStartDate.getTime() - minStartDate.getTime())
    )
    
    // Set the date and update selected dates
    setDate(randomStartDate)
    const endDate = addDays(randomStartDate, selectedPlan.daysCount - 1)
    setSelectedDates({
      startDate: randomStartDate,
      endDate: endDate,
    })
  }

  const setDatesConfirmed = useStore((state) => state.setDatesConfirmed)
  
  const handleProceed = () => {
    if (!date || !selectedPlan) return

    // Ensure dates are set before proceeding
    const endDate = addDays(date, selectedPlan.daysCount - 1)
    setSelectedDates({
      startDate: date,
      endDate: endDate,
    })

    // Set datesConfirmed to true to show the menu
    setDatesConfirmed(true)
  }

  const disabledDays = {
    before: addDays(new Date(), 1), // Disable past dates and today
    after: addDays(new Date(), 30), // Disable dates more than 30 days in the future
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-neutral-900">Select Start Date</h2>
        <p className="text-neutral-600">
          Choose when you want to start your {selectedPlan?.daysCount}-day meal plan
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={disabledDays}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button 
          variant="secondary" 
          onClick={handleRandomDate}
          className="bg-orange-100 hover:bg-orange-200 text-orange-700"
        >
          Random Date
        </Button>
      </div>

      {date && selectedPlan && (
        <div className="mt-4 p-4 bg-orange-50 rounded-lg">
          <p className="text-orange-800">
            Your meal plan will run from{" "}
            <span className="font-semibold">{format(date, "PPPP")}</span> to{" "}
            <span className="font-semibold">
              {format(addDays(date, selectedPlan.daysCount - 1), "PPPP")}
            </span>
          </p>
          <p className="text-sm text-orange-700 mt-2">
            You'll be able to select meals for each day in your plan on the next screen.
          </p>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleProceed}
          className="bg-orange-500 hover:bg-orange-600 text-white min-w-[120px]"
          disabled={!date || !selectedPlan}
        >
          Proceed to Menu
        </Button>
      </div>
    </div>
  )
}