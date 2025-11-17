"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Plan, CartItem, PersonDetails, Vendor, Menu, PopulatedMenu } from "@/lib/types"
import { getPlans, getVendors, getMenusByVendor } from "@/lib/api"
import { format, addDays } from "date-fns"
import { useAuth } from "@/app/context/auth-context"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { toast } from "sonner"

import { PricingHeroSection } from "@/components/pricing-hero-section"
import { PlanSelection } from "@/components/plan-selection"
import { QuantitySelection } from "@/components/quantity-selection"
import { PersonDetailsInput } from "@/components/person-details-input"
import { DateSelection } from "@/components/date-selection"
import { OrderSummarySidebar } from "@/components/order-summary-sidebar"
import { addToCartApi } from "@/lib/api"
import { VendorSelection } from "@/components/vendor-selection" // New component
import { MenuGrid } from "@/components/menu-grid" // New component

export default function PricingPage() {
  const { user, isAuthenticated, token } = useAuth()
  const router = useRouter()
  const { addToCart } = useStore()

  const [plans, setPlans] = useState<Plan[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [personDetails, setPersonDetails] = useState<PersonDetails[]>(
    Array.from({ length: 1 }, () => ({ name: "", phoneNumber: "" }))
  )
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const fetchedPlans = await getPlans()
        const fetchedVendors = await getVendors()
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
  }, [])

  useEffect(() => {
    async function fetchMenusForVendor() {
      if (selectedVendor) {
        try {
          setLoading(true)
          const fetchedMenus = await getMenusByVendor(selectedVendor._id)
          setMenus(fetchedMenus)
        } catch (err: any) {
          setError(err.message || "Failed to fetch menus")
          toast.error("Error", {
            description: err.message || "Failed to fetch menus.",
          })
        } finally {
          setLoading(false)
        }
      } else {
        setMenus([])
      }
    }
    fetchMenusForVendor()
  }, [selectedVendor])

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setSelectedMenu(null) // Reset menu when vendor changes
    setSelectedPlan(null)
    setStartDate(undefined)
    setEndDate(undefined)
  }

  const handleMenuSelect = (menu: Menu) => {
    setSelectedMenu(menu)
    setSelectedPlan(null)
    setStartDate(undefined)
    setEndDate(undefined)
  }

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

  const handleAddToCart = async() => {
    if (!isAuthenticated) {
      router.push("/auth?returnUrl=/pricing")
      return
    }

  if (!selectedVendor) {
    toast.error("Cannot add to cart", { description: "Please select a vendor." });
    return;
  }
  if (!selectedMenu) {
    toast.error("Cannot add to cart", { description: "Please select a menu." });
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
  };

  try {
    const updatedCart = await addToCartApi(user.id!, cartItem, token);
    toast.success("Added to Cart!", {
      description: `${quantity}x ${selectedMenu.name} (${selectedPlan.name}) added successfully.`,
    });
    resetSelection();
  } catch (error: any) {
    toast.error("Error", {
      description: error.message || "Failed to add item to cart.",
    });
  }
}

  const resetSelection = () => {
    setSelectedMenu(null)
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

    if (!arePersonDetailsValid()) {
      toast.error("Invalid Details", {
        description: "Please fill all person details correctly.",
      })
      return
    }

    if (selectedVendor && selectedMenu && selectedPlan && quantity > 0 && startDate && endDate && user?.id) {
      const itemTotalPrice = selectedMenu.perDayPrice * selectedPlan.durationDays * quantity

      const newCartItem: CartItem = {
        _id: `cart-${Date.now()}-${selectedMenu._id}`,
        user: user.id,
        menu: selectedMenu,
        plan: selectedPlan,
        quantity: quantity,
        personDetails: quantity >= 1 ? personDetails : undefined,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        itemTotalPrice: itemTotalPrice,
        addedDate: new Date().toISOString(),
        vendor: selectedVendor._id,
      }

      addToCart(newCartItem)

      toast("Added to Cart & Redirecting!", {
        description: `${quantity}x ${selectedMenu.name} (${selectedPlan.name}) added to your cart.`,
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
            {loading ? (
              <div className="text-center text-gray-600">Loading vendors...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : (
              <VendorSelection
                vendors={vendors}
                selectedVendor={selectedVendor}
                onSelectVendor={handleVendorSelect}
              />
            )}

            {selectedVendor && (
              <MenuGrid
                menus={menus}
                selectedMenu={selectedMenu}
                onMenuSelect={handleMenuSelect}
              />
            )}

            {selectedMenu && (
              <PlanSelection
                selectedMenu={selectedMenu} // Meal is no longer directly selected
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
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
