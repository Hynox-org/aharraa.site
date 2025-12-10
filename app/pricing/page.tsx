"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Plan, CartItem, PersonDetails, Vendor, Menu, MenuWithPopulatedMeals, MealCategory } from "@/lib/types"
import { getPlans, getAllMenus, getVendorById } from "@/lib/api"
import { format, addDays } from "date-fns"
import { useAuth } from "@/app/context/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import LottieAnimation from "@/components/lottie-animation"
import ItayCheffAnimation from "../../public/lottie/ItayCheff.json"
import { IoArrowForward, IoArrowBack, IoCheckmarkCircle } from "react-icons/io5"

import { PlanSelection } from "@/components/plan-selection"
import { QuantitySelection } from "@/components/quantity-selection"
import { PersonDetailsInput } from "@/components/person-details-input"
import { DateSelection } from "@/components/date-selection"
import { OrderSummarySidebar } from "@/components/order-summary-sidebar"
import { addToCartApi } from "@/lib/api"
import { addLocalCartItem, LocalCartItem } from "@/lib/localCart"
import { MenuGrid } from "@/components/menu-grid"
import { MealTimeSelection } from "@/components/meal-time-selection"

const STEPS = [
  { id: 1, name: "Select Menu", key: "menu" },
  { id: 2, name: "Meal Times", key: "mealTimes" },
  { id: 3, name: "Choose Plan", key: "plan" },
  { id: 4, name: "Quantity", key: "quantity" },
  { id: 5, name: "Person Details", key: "personDetails" },
  { id: 6, name: "Start Date", key: "date" },
]

export default function PricingPage() {
  const { user, isAuthenticated, token } = useAuth()
  const router = useRouter()

  const [plans, setPlans] = useState<Plan[]>([])
  const [menus, setMenus] = useState<MenuWithPopulatedMeals[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [selectedMenu, setSelectedMenu] = useState<MenuWithPopulatedMeals | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [personDetails, setPersonDetails] = useState<PersonDetails[]>(
    Array.from({ length: 1 }, () => ({ name: "", phoneNumber: "" }))
  )
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [selectedMealTimes, setSelectedMealTimes] = useState<MealCategory[]>([]) // Changed type to MealCategory[]
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isDirectCheckingOut, setIsDirectCheckingOut] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [fetchedPlans, fetchedMenus] = await Promise.all([
          getPlans(),
          getAllMenus(),
        ])
        setPlans(fetchedPlans)
        setMenus(fetchedMenus)
      } catch (err: any) {
        setError(err.message || "Failed to fetch data")
        toast.error("Error", {
          description: err.message || "Failed to fetch data.",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleMenuSelect = useCallback(async (menu: MenuWithPopulatedMeals) => {
    setSelectedMenu(menu)
    setSelectedPlan(null)
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedMealTimes([])
    
    if (menu?.vendor) {
      try {
        const vendorDetails = await getVendorById(menu.vendor)
        setSelectedVendor(vendorDetails)
      } catch (err: any) {
        setError(err.message || "Failed to fetch vendor details")
        toast.error("Error", {
          description: err.message || "Failed to fetch vendor details.",
        })
        setSelectedVendor(null)
      }
    } else {
      setSelectedVendor(null)
    }
  }, [])

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan)
    setQuantity(1)
    setPersonDetails(Array.from({ length: 1 }, () => ({ name: "", phoneNumber: "" })))
    setStartDate(undefined)
    setEndDate(undefined)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!arePersonDetailsValid()) {
      toast.error("Missing Details", {
        description: "Please fill all person details before selecting a date.",
      })
      return
    }

    if (date && selectedPlan) {
      setStartDate(date)
      const calculatedEndDate = addDays(date, selectedPlan.durationDays - 1)
      setEndDate(calculatedEndDate)
    } else {
      setStartDate(undefined)
      setEndDate(undefined)
    }
  }

  const handlePersonDetailChange = (index: number, field: keyof PersonDetails, value: string) => {
    const updatedDetails = [...personDetails]
    if (!updatedDetails[index]) {
      updatedDetails[index] = { name: "", phoneNumber: "" }
    }
    updatedDetails[index][field] = value
    setPersonDetails(updatedDetails)
  }

  useEffect(() => {
    setPersonDetails(prevDetails => {
      const newDetails = Array.from({ length: quantity }, (_, i) => {
        return prevDetails[i] || { name: "", phoneNumber: "" }
      })
      return newDetails
    })
  }, [quantity])

  const arePersonDetailsValid = () => {
    if (quantity < 1) return true
    
    return personDetails.slice(0, quantity).every(person => {
      const nameValid = person?.name?.trim().length >= 2
      const phoneValid = /^[6-9]\d{9}$/.test(person?.phoneNumber || "")
      return nameValid && phoneValid
    })
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return !!selectedMenu
      case 2:
        return selectedMealTimes.length > 0
      case 3:
        return !!selectedPlan
      case 4:
        return quantity >= 1
      case 5:
        return arePersonDetailsValid()
      case 6:
        return !!startDate && !!endDate
      default:
        return false
    }
  }

  const handleNext = () => {
    if (!canProceedToNextStep()) {
      const stepMessages: Record<number, string> = {
        1: "Please select a menu to continue",
        2: "Please select at least one meal time",
        3: "Please select a plan to continue",
        4: "Please set quantity to continue",
        5: "Please fill all person details correctly",
        6: "Please select a start date",
      }
      toast.error("Cannot proceed", {
        description: stepMessages[currentStep],
      })
      return
    }
    
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleCheckoutProcess = async (
    redirectTo: string,
    setLoadingState: (loading: boolean) => void
  ) => {
    setLoadingState(true)

    if (!selectedMenu || !selectedPlan || !startDate || !endDate) {
      toast.error("Cannot proceed", { description: "Please complete all steps." })
      setLoadingState(false)
      return
    }

    const newCartItem = {
      menuId: selectedMenu._id,
      planId: selectedPlan._id,
      quantity,
      startDate: format(startDate, "yyyy-MM-dd"),
      personDetails: quantity >= 1 ? personDetails : undefined,
      selectedMealTimes: selectedMealTimes,
    }; // Removed vendorId as it's not allowed by backend

    if (!isAuthenticated) {
      // Save to local storage if not authenticated
      try {
        addLocalCartItem(newCartItem, selectedMenu, selectedPlan); // Pass selectedMenu and selectedPlan
        toast.success("Success!", {
          description: `${quantity}x ${selectedMenu.name} (${selectedPlan.name}) added to local cart.`,
        });
        resetSelection();
        router.push(redirectTo); // Redirect to cart or checkout page
      } catch (error: any) {
        toast.error("Error", {
          description: error.message || "Failed to add to local cart.",
        });
      } finally {
        setLoadingState(false);
      }
      return;
    }

    // If authenticated, proceed with existing backend logic
    const token = localStorage.getItem("aharraa-u-token")
    if (!token) {
      router.push("/auth?returnUrl=/pricing"); // Should ideally not happen if isAuthenticated is true, but as a fallback
      setLoadingState(false);
      return;
    }

    try {
      // Use user.id which is guaranteed to be present if isAuthenticated is true
      await addToCartApi(user!.id!, newCartItem, token); 
      toast.success("Success!", {
        description: `${quantity}x ${selectedMenu.name} (${selectedPlan.name}) added to cart.`,
      });
      resetSelection();
      router.push(redirectTo);
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to process order.",
      });
    } finally {
      setLoadingState(false);
    }
  }

  const handleAddToCart = async () => {
    if (isAddingToCart || isDirectCheckingOut) return
    await handleCheckoutProcess("/cart", setIsAddingToCart)
  }

  const handleDirectCheckout = async () => {
    if (isDirectCheckingOut || isAddingToCart) return
    await handleCheckoutProcess("/checkout", setIsDirectCheckingOut)
  }

  const resetSelection = () => {
    setSelectedMenu(null)
    setSelectedPlan(null)
    setQuantity(1)
    setPersonDetails([])
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedMealTimes([])
    setCurrentStep(1)
  }

  const handleMealTimeSelect = useCallback((mealTime: MealCategory, isSelected: boolean) => { // Changed type to MealCategory
    setSelectedMealTimes((prev) => {
      if (isSelected) {
        return [...prev, mealTime]
      } else {
        return prev.filter((item) => item !== mealTime)
      }
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LottieAnimation animationData={ItayCheffAnimation} style={{ width: 200, height: 200 }} />
      </div>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-red-600 text-lg">
          {error}
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Progress Steps */}
         <div className="mb-6 sm:mb-8 md:mb-12 overflow-x-auto py-2">
          <div className="flex items-center justify-between min-w-[600px] sm:min-w-0 max-w-4xl mx-auto px-2">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center flex-1 min-w-0">
                  {/* Step Circle */}
                  <div className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 flex-shrink-0 ${
                    currentStep > step.id
                      ? 'bg-[#3CB371] scale-105 sm:scale-110'
                      : currentStep === step.id
                      ? 'bg-black scale-110 sm:scale-125 shadow-lg'
                      : 'bg-gray-200'
                  }`}>
                    {currentStep > step.id ? (
                      <IoCheckmarkCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                    ) : (
                      <span className={`text-xs sm:text-sm md:text-base font-bold ${
                        currentStep === step.id ? 'text-white' : 'text-gray-500'
                      }`}>
                        {step.id}
                      </span>
                    )}
                  </div>
                  
                  {/* Step Label - Responsive */}
                  <span className={`mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] md:text-xs font-semibold text-center whitespace-nowrap ${
                    currentStep >= step.id ? 'text-black' : 'text-gray-400'
                  }`}>
                    <span className="sm:inline">{step.name}</span>
                  </span>
                </div>
                
                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div className={`h-0.5 sm:h-1 flex-1 mx-1 sm:mx-2 rounded-full transition-all duration-300 ${
                    currentStep > step.id
                      ? 'bg-[#3CB371]'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Current Step */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 min-h-[500px]">
              {currentStep === 1 && (
                <MenuGrid
                  menus={menus}
                  selectedMenu={selectedMenu}
                  onMenuSelect={handleMenuSelect}
                />
              )}

              {currentStep === 2 && selectedMenu && (
                <MealTimeSelection
                  selectedMenu={selectedMenu}
                  selectedMealTimes={selectedMealTimes}
                  onMealTimeSelect={handleMealTimeSelect}
                />
              )}

              {currentStep === 3 && selectedMenu && (
                <PlanSelection
                  selectedMenu={selectedMenu}
                  selectedPlan={selectedPlan}
                  plans={plans}
                  onPlanSelect={handlePlanSelect}
                  selectedMealTimes={selectedMealTimes as string[]}
                  quantity={quantity}
                />
              )}

              {currentStep === 4 && selectedPlan && (
                <>
                  <QuantitySelection
                    quantity={quantity}
                    selectedPlan={selectedPlan}
                    onQuantityChange={setQuantity}
                  />
                  
                  {/* Add Delivery Charge Info */}
                  <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 md:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#3CB371] rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        Save on Delivery!
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        <span className="font-semibold text-[#3CB371]">Single delivery charge</span> applies for up to <span className="font-bold">4 persons</span> ordering the same menu and meal timings. Perfect for families and groups!
                      </p>
                    </div>
                  </div>
                </div>

                </>
              )}

              {currentStep === 5 && selectedPlan && quantity >= 1 && (
                <PersonDetailsInput
                  quantity={quantity}
                  personDetails={personDetails}
                  onPersonDetailChange={handlePersonDetailChange}
                />
              )}

              {currentStep === 6 && selectedPlan && (
                <DateSelection
                  startDate={startDate}
                  endDate={endDate}
                  selectedPlan={selectedPlan}
                  onDateSelect={handleDateSelect}
                  isDisabled={!arePersonDetailsValid()}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6 md:mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
              >
                <IoArrowBack className="w-5 h-5" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Step <span className="font-bold text-black">{currentStep}</span> of {STEPS.length}
                </p>
              </div>

              {currentStep < STEPS.length ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceedToNextStep()}
                  className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-3.5 rounded-xl font-bold bg-[#3CB371] hover:bg-[#2FA05E] text-white shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300"
                >
                  <span className="hidden sm:inline">Next Step</span>
                  <span className="sm:hidden">Next</span>
                  <IoArrowForward className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={!canProceedToNextStep() || isAddingToCart || isDirectCheckingOut}
                    className="px-4 md:px-6 py-3 md:py-3.5 rounded-xl font-semibold bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 text-sm md:text-base"
                  >
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <OrderSummarySidebar
              selectedMenu={selectedMenu}
              selectedPlan={selectedPlan}
              quantity={quantity}
              startDate={startDate}
              endDate={endDate}
              onAddToCart={handleAddToCart}
              isAddingToCart={isAddingToCart}
              onDirectCheckout={handleDirectCheckout}
              isDirectCheckingOut={isDirectCheckingOut}
              selectedMealTimes={selectedMealTimes}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
