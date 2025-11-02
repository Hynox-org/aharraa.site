"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DUMMY_MEALS, DUMMY_PLANS, DUMMY_VENDORS } from "@/lib/data"
import { Meal, Plan, MealCategory, DietPreference, CartItem, PersonDetails } from "@/lib/types"
import { format, addDays } from "date-fns"
import { useAuth } from "@/app/context/auth-context"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"

import { PricingHeroSection } from "@/components/pricing-hero-section"
import { MealCategoryTabs } from "@/components/meal-category-tabs"
import { DietPreferenceFilter } from "@/components/diet-preference-filter"
import { MealGrid } from "@/components/meal-grid"
import { PlanSelection } from "@/components/plan-selection"
import { QuantitySelection } from "@/components/quantity-selection"
import { PersonDetailsInput } from "@/components/person-details-input"
import { DateSelection } from "@/components/date-selection"
import { OrderSummarySidebar } from "@/components/order-summary-sidebar"
import { MealDetailsModal } from "@/components/meal-details-modal"

export default function PricingPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { addToCart } = useStore()
  const { toast } = useToast()

  const [selectedCategory, setSelectedCategory] = useState<MealCategory>("Breakfast")
  const [selectedDietPreference, setSelectedDietPreference] = useState<DietPreference>("All")
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  // Initialize personDetails based on initial quantity
  const [personDetails, setPersonDetails] = useState<PersonDetails[]>(
    Array.from({ length: 1 }, () => ({ name: "", phoneNumber: "" }))
  )
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [mealDetailsOpen, setMealDetailsOpen] = useState(false)
  const [detailMeal, setDetailMeal] = useState<Meal | null>(null)

  const mealsByCategory = useMemo(() => {
    return DUMMY_MEALS.reduce((acc, meal) => {
      (acc[meal.category] = acc[meal.category] || []).push(meal)
      return acc
    }, {} as Record<MealCategory, Meal[]>)
  }, [])

  const categories = Object.keys(mealsByCategory) as MealCategory[]

  const filteredMeals = useMemo(() => {
    let meals = mealsByCategory[selectedCategory] || []
    if (selectedDietPreference !== "All") {
      meals = meals.filter(meal => meal.dietPreference === selectedDietPreference)
    }
    return meals
  }, [selectedCategory, selectedDietPreference, mealsByCategory])

  const handleMealClick = (meal: Meal) => {
    setDetailMeal(meal)
    setMealDetailsOpen(true)
  }

  const handleMealSelect = (meal: Meal) => {
    setSelectedMeal(meal)
    setSelectedPlan(null)
    setStartDate(undefined)
    setEndDate(undefined)
    setMealDetailsOpen(false)
  }

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan)
    setQuantity(1)
    // Reset person details when plan changes
    setPersonDetails(Array.from({ length: 1 }, () => ({ name: "", phoneNumber: "" })))
    setStartDate(undefined)
    setEndDate(undefined)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!arePersonDetailsValid()) {
      toast({
        title: "Missing Details",
        description: "Please fill all person details before selecting a date.",
        variant: "destructive",
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
    // Adjust personDetails array size when quantity changes
    setPersonDetails(prevDetails => {
      const newDetails = Array.from({ length: quantity }, (_, i) => {
        return prevDetails[i] || { name: "", phoneNumber: "" }
      })
      return newDetails
    })
  }, [quantity])

  // Validation check for person details
  const arePersonDetailsValid = () => {
    if (quantity < 1) {
      return true;
    }
    
    const isValid = personDetails.slice(0, quantity).every(person => {
      const nameValid = person?.name?.trim().length >= 2;
      const phoneValid = /^[6-9]\d{9}$/.test(person?.phoneNumber || "");
      return nameValid && phoneValid;
    });

    return isValid;
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/auth?returnUrl=/pricing")
      return
    }

    // Validate person details
    if (!arePersonDetailsValid()) {
      toast({
        title: "Invalid Details",
        description: "Please fill all person details correctly.",
        variant: "destructive",
      })
      return
    }

    if (selectedMeal && selectedPlan && quantity > 0 && startDate && endDate && user?.id) {
      const itemTotalPrice = selectedMeal.price * selectedPlan.durationDays * quantity

      const vendor = DUMMY_VENDORS.find((v) => v.id === selectedMeal.vendorId)
      if (!vendor) {
        toast({
          title: "Error",
          description: "Vendor not found for the selected meal.",
          variant: "destructive",
        })
        return
      }

      const newCartItem: CartItem = {
        id: `cart-${Date.now()}-${selectedMeal.id}`,
        userId: user.id,
        meal: selectedMeal,
        plan: selectedPlan,
        quantity: quantity,
        personDetails: quantity >= 1 ? personDetails : undefined,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        itemTotalPrice: itemTotalPrice,
        addedDate: new Date().toISOString(),
        vendor: vendor,
      }

      addToCart(newCartItem)

      toast({
        title: "Added to Cart!",
        description: `${quantity}x ${selectedMeal.name} (${selectedPlan.name}) added to your cart.`,
      })

      resetSelection()
    } else {
      toast({
        title: "Cannot add to cart",
        description: "Please complete all required fields.",
        variant: "destructive",
      })
    }
  }

  const resetSelection = () => {
    setSelectedMeal(null)
    setSelectedPlan(null)
    setQuantity(1)
    setPersonDetails([])
    setStartDate(undefined)
    setEndDate(undefined)
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push("/auth?returnUrl=/pricing")
      return
    }

    // Validate person details
    if (!arePersonDetailsValid()) {
      toast({
        title: "Invalid Details",
        description: "Please fill all person details correctly.",
        variant: "destructive",
      })
      return
    }

    if (selectedMeal && selectedPlan && quantity > 0 && startDate && endDate && user?.id) {
      const itemTotalPrice = selectedMeal.price * selectedPlan.durationDays * quantity

      const vendor = DUMMY_VENDORS.find((v) => v.id === selectedMeal.vendorId)
      if (!vendor) {
        toast({
          title: "Error",
          description: "Vendor not found for the selected meal.",
          variant: "destructive",
        })
        return
      }

      const newCartItem: CartItem = {
        id: `cart-${Date.now()}-${selectedMeal.id}`,
        userId: user.id,
        meal: selectedMeal,
        plan: selectedPlan,
        quantity: quantity,
        personDetails: quantity >= 1 ? personDetails : undefined,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        itemTotalPrice: itemTotalPrice,
        addedDate: new Date().toISOString(),
        vendor: vendor,
      }

      addToCart(newCartItem)

      toast({
        title: "Added to Cart & Redirecting!",
        description: `${quantity}x ${selectedMeal.name} (${selectedPlan.name}) added to your cart.`,
      })

      router.push("/checkout")
    } else {
      toast({
        title: "Cannot proceed to checkout",
        description: "Please complete all required fields.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
      <Header />
      <PricingHeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <MealCategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <DietPreferenceFilter
              selectedDietPreference={selectedDietPreference}
              onSelectDietPreference={setSelectedDietPreference}
            />
            <MealGrid
              filteredMeals={filteredMeals}
              selectedMeal={selectedMeal}
              vendors={DUMMY_VENDORS}
              handleMealClick={handleMealClick}
              handleMealSelect={handleMealSelect}
            />

            {selectedMeal && (
              <PlanSelection
                selectedMeal={selectedMeal}
                selectedPlan={selectedPlan}
                plans={DUMMY_PLANS}
                onPlanSelect={handlePlanSelect}
              />
            )}

            {selectedPlan && (
              <QuantitySelection
                quantity={quantity}
                selectedPlan={selectedPlan}
                onQuantityChange={setQuantity}
              />
            )}

            {selectedPlan && quantity >= 1 && (
              <PersonDetailsInput
                quantity={quantity}
                personDetails={personDetails}
                onPersonDetailChange={handlePersonDetailChange}
              />
            )}

            {selectedPlan && (
              <DateSelection
                startDate={startDate}
                endDate={endDate}
                selectedPlan={selectedPlan}
                onDateSelect={handleDateSelect}
                isDisabled={!arePersonDetailsValid()}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <OrderSummarySidebar
              selectedMeal={selectedMeal}
              selectedPlan={selectedPlan}
              quantity={quantity}
              startDate={startDate}
              endDate={endDate}
              onAddToCart={handleAddToCart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      <Footer />

      <MealDetailsModal
        mealDetailsOpen={mealDetailsOpen}
        detailMeal={detailMeal}
        selectedMealId={selectedMeal?.id || null}
        onClose={() => setMealDetailsOpen(false)}
        onMealSelect={handleMealSelect}
      />
    </main>
  )
}
