"use client"

import { useState, useMemo, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Meal, Plan, MealCategory, DietPreference, CartItem, PersonDetails, Vendor } from "@/lib/types"
import { getMeals, getPlans, getVendors } from "@/lib/api"
import { format, addDays } from "date-fns"
import { useAuth } from "@/app/context/auth-context"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

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
import { addToCartApi } from "@/lib/api"
export default function PricingPage() {
  const { user, isAuthenticated, token } = useAuth()
  const router = useRouter()
  const { addToCart } = useStore()
  // The 'toast' function is now directly imported from 'sonner'

  const [meals, setMeals] = useState<Meal[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState<MealCategory>("Breakfast")
  const [selectedDietPreference, setSelectedDietPreference] = useState<DietPreference>("All")
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [personDetails, setPersonDetails] = useState<PersonDetails[]>(
    Array.from({ length: 1 }, () => ({ name: "", phoneNumber: "" }))
  )
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [mealDetailsOpen, setMealDetailsOpen] = useState(false)
  const [detailMeal, setDetailMeal] = useState<Meal | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const fetchedMeals = await getMeals()
        const fetchedPlans = await getPlans()
        const fetchedVendors = await getVendors()
        console.log("Fetched Meals:", fetchedMeals);
        console.log("Fetched Vendors:", fetchedVendors);
        setMeals(fetchedMeals)
        setPlans(fetchedPlans)
        setVendors(fetchedVendors)
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
  }, []) // Removed toast from dependency array as it's a direct import now

  const mealsByCategory = useMemo(() => {
    return meals.reduce((acc, meal) => {
      (acc[meal.category] = acc[meal.category] || []).push(meal)
      return acc
    }, {} as Record<MealCategory, Meal[]>)
  }, [meals])

  const categories = Object.keys(mealsByCategory) as MealCategory[]

  const filteredMeals = useMemo(() => {
    let currentMeals = mealsByCategory[selectedCategory] || []
    if (selectedDietPreference !== "All") {
      currentMeals = currentMeals.filter(meal => meal.dietPreference === selectedDietPreference)
    }
    return currentMeals
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

  const handleAddToCart = async() => {
    console.log("handleAddToCart called");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("selectedMeal:", selectedMeal);
    console.log("selectedPlan:", selectedPlan);
    console.log("quantity:", quantity);
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);
    console.log("user?.id:", user?.id);
    console.log("personDetails:", personDetails);

    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to /auth");
      router.push("/auth?returnUrl=/pricing")
      return
    }

  // --- Validation ---
  if (!selectedMeal) {
    toast.error("Cannot add to cart", { description: "Please select a meal." });
    return;
  }
  if (!selectedPlan) {
    toast.error("Cannot add to cart", { description: "Please select a plan." });
    return;
  }
  if (quantity <= 0) {
    toast.error("Cannot add to cart", { description: "Quantity must be greater than 0." });
    return;
  }
  if (!startDate || !endDate) {
    toast.error("Cannot add to cart", { description: "Please select a start date." });
    return;
  }
  if (!arePersonDetailsValid()) {
    toast.error("Invalid Details", { description: "Please fill all person details correctly." });
    return;
  }
  if (!user?.id) {
    toast.error("Cannot add to cart", { description: "User not authenticated. Please log in." });
    return;
  }

  console.log("✅ All validations passed.");

  const token = localStorage.getItem("aharraa-u-token");
  console.log("Token:", token);
  if (!token) {
    console.error("❌ No auth token found. User must log in first.");
    router.push("/auth?returnUrl=/pricing");
    return;
  }

  // --- Vendor check ---
  const vendor = vendors.find((v) => v._id === (selectedMeal.vendorId as any)._id);
  if (!vendor) {
    toast.error("Error", { description: "Vendor not found for selected meal." });
    return;
  }

  // --- Prepare cart item ---
  const cartItem = {
    mealId: selectedMeal._id,
    planId: selectedPlan._id,
    quantity,
    startDate: format(startDate, "yyyy-MM-dd"),
    personDetails: quantity >= 1 ? personDetails : undefined,
  };

  console.log("📦 Sending cart item to backend:", cartItem);

  try {
    // --- Add item to cart API ---
    const updatedCart = await addToCartApi(user.id!, cartItem, token);
    console.log("✅ Added to cart successfully:", updatedCart);

    // --- Update UI / store ---
    toast.success("Added to Cart!", {
      description: `${quantity}x ${selectedMeal.name} (${selectedPlan.name}) added successfully.`,
    });

    // --- Reset selection for next item ---
    resetSelection();

  } catch (error: any) {
    console.error("❌ Error adding to cart:", error);
    toast.error("Error", {
      description: error.message || "Failed to add item to cart.",
    });
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
      toast.error("Invalid Details", {
        description: "Please fill all person details correctly.",
      })
      return
    }

    if (selectedMeal && selectedPlan && quantity > 0 && startDate && endDate && user?.id) {
      const itemTotalPrice = selectedMeal.price * selectedPlan.durationDays * quantity

      const vendor = vendors.find((v) => v._id === (selectedMeal.vendorId as any)._id)
      if (!vendor) {
        toast.error("Error", {
          description: "Vendor not found for the selected meal.",
        })
        return
      }

      const newCartItem: CartItem = {
        id: `cart-${Date.now()}-${selectedMeal._id}`,
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

      toast("Added to Cart & Redirecting!", {
        description: `${quantity}x ${selectedMeal.name} (${selectedPlan.name}) added to your cart.`,
      })

      router.push("/checkout")
    } else {
      toast.error("Cannot proceed to checkout", {
        description: "Please complete all required fields.",
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
            {loading ? (
              <div className="text-center text-gray-600">Loading meals...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : (
              <MealGrid
                filteredMeals={filteredMeals}
                selectedMeal={selectedMeal}
                vendors={vendors}
                handleMealClick={handleMealClick}
                handleMealSelect={handleMealSelect}
              />
            )}

            {selectedMeal && (
              <PlanSelection
                selectedMeal={selectedMeal}
                selectedPlan={selectedPlan}
                plans={plans}
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
        selectedMealId={selectedMeal?._id || null}
        onClose={() => setMealDetailsOpen(false)}
        onMealSelect={handleMealSelect}
      />
    </main>
  )
}
