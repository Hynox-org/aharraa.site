"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Plan, CartItem, PersonDetails, Vendor, Menu, MenuWithPopulatedMeals } from "@/lib/types"
import { getPlans, getAllMenus, getVendorById } from "@/lib/api"
import { format, addDays } from "date-fns"
import { useAuth } from "@/app/context/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import LottieAnimation from "@/components/lottie-animation"; // Import LottieAnimation component
import ItayCheffAnimation from "../../public/lottie/ItayCheff.json"; // Import your Lottie JSON animation data

import { PricingHeroSection } from "@/components/pricing-hero-section"
import { PlanSelection } from "@/components/plan-selection"
import { QuantitySelection } from "@/components/quantity-selection"
import { PersonDetailsInput } from "@/components/person-details-input"
import { DateSelection } from "@/components/date-selection"
import { OrderSummarySidebar } from "@/components/order-summary-sidebar"
import { addToCartApi } from "@/lib/api"
import { VendorSelection } from "@/components/vendor-selection" 
import { MenuGrid } from "@/components/menu-grid"
import { MealTimeSelection } from "@/components/meal-time-selection" 

export default function PricingPage() {
  const { user, isAuthenticated, token } = useAuth()
  const router = useRouter()

  const [plans, setPlans] = useState<Plan[]>([])
  const [menus, setMenus] = useState<MenuWithPopulatedMeals[]>([]) // Menus now come with populated meals
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null) // This will be set from selectedMenu's vendor
  const [selectedMenu, setSelectedMenu] = useState<MenuWithPopulatedMeals | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [personDetails, setPersonDetails] = useState<PersonDetails[]>(
    Array.from({ length: 1 }, () => ({ name: "", phoneNumber: "" }))
  )
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [selectedMealTimes, setSelectedMealTimes] = useState<string[]>([]) // New state for selected meal times
  const [isAddingToCart, setIsAddingToCart] = useState(false) // New loading state for add to cart

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [fetchedPlans, fetchedMenus] = await Promise.all([
          getPlans(),
          getAllMenus(), // Assuming this now returns Menu[] or similar
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
    setSelectedMealTimes([]) // Reset selected meal times when menu changes
    
    // Fetch vendor details when a menu is selected using the vendor ID string
    if (menu?.vendor) { // menu.vendor is expected to be a string (ID)
      try {
        const vendorDetails = await getVendorById(menu.vendor) // Pass the string ID
        setSelectedVendor(vendorDetails)
        // console.log("Selected Vendor after fetch:", vendorDetails); // Removed Debugging line
      } catch (err: any) {
        setError(err.message || "Failed to fetch vendor details")
        toast.error("Error", {
          description: err.message || "Failed to fetch vendor details.",
        })
        setSelectedVendor(null)
        // console.error("Failed to fetch vendor details:", err); // Removed Debugging line
      }
    } else {
      setSelectedVendor(null)
      // console.log("menu.vendor ID was not available, selectedVendor set to null."); // Removed Debugging line
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

  const handleAddToCart = async () => {
    if (isAddingToCart) return; // Prevent multiple clicks

    if (!isAuthenticated) {
      router.push("/auth?returnUrl=/pricing")
      return
    }

    if (!selectedMenu) {
      toast.error("Cannot add to cart", { description: "Please select a menu." });
      return;
    }
    if (selectedMealTimes.length === 0) {
      toast.error("Cannot add to cart", { description: "Please select at least one meal time." });
      return;
    }
    if (!selectedVendor) { // Ensure selectedVendor is populated from menu
      toast.error("Cannot add to cart", { description: "Vendor details not loaded for selected menu." });
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

    const token = localStorage.getItem("aharraa-u-token");
    if (!token) {
      router.push("/auth?returnUrl=/pricing");
      return;
    }

    const cartItem = {
      menuId: selectedMenu._id,
      planId: selectedPlan._id,
      quantity,
      startDate: format(startDate, "yyyy-MM-dd"),
      personDetails: quantity >= 1 ? personDetails : undefined,
      selectedMealTimes: selectedMealTimes, // Add selected meal times
    };

    try {
      setIsAddingToCart(true); // Set loading state
      const updatedCart = await addToCartApi(user.id!, cartItem, token);
      toast.success("Added to Cart!", {
        description: `${quantity}x ${selectedMenu.name} (${selectedPlan.name}) added successfully.`,
      });
      resetSelection();
      router.push("/cart")
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to add item to cart.",
      });
    } finally {
      setIsAddingToCart(false); // Reset loading state
    }
  }

  const resetSelection = () => {
    setSelectedMenu(null)
    setSelectedPlan(null)
    setQuantity(1)
    setPersonDetails([])
    setStartDate(undefined)
    setEndDate(undefined)
    setSelectedMealTimes([]) // Reset selected meal times
  }

  const handleMealTimeSelect = useCallback((mealTime: string, isSelected: boolean) => {
    setSelectedMealTimes((prev) => {
      if (isSelected) {
        return [...prev, mealTime];
      } else {
        return prev.filter((item) => item !== mealTime);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FEFAE0]">
        <LottieAnimation animationData={ItayCheffAnimation} style={{ width: 200, height: 200 }} />
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] text-red-600 text-lg">
          {error}
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
      <Header />
      <PricingHeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <>
              <MenuGrid
                menus={menus}
                selectedMenu={selectedMenu}
                onMenuSelect={handleMenuSelect}
              />
            </>

            {selectedMenu && (
              <MealTimeSelection
                selectedMenu={selectedMenu}
                selectedMealTimes={selectedMealTimes}
                onMealTimeSelect={handleMealTimeSelect}
              />
            )}

            {selectedMenu && (
              <PlanSelection
                selectedMenu={selectedMenu}
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
              selectedMenu={selectedMenu}
              selectedPlan={selectedPlan}
              quantity={quantity}
              startDate={startDate}
              endDate={endDate}
              onAddToCart={handleAddToCart}
              isAddingToCart={isAddingToCart}
              selectedMealTimes={selectedMealTimes}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
