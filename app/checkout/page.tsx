"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { useAuth } from "@/app/context/auth-context"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  DeliveryAddress,
  CheckoutData,
  CheckoutItem,
  MealCategory,
  CreatePaymentPayload,
  Vendor,
} from "@/lib/types"
import { createOrder, createPayment, updateProfileDetails } from "@/lib/api"
import { load } from "@cashfreepayments/cashfree-js"

import { CheckoutEmptyState } from "@/components/checkout-empty-state"
import { DeliveryAddressCard } from "@/components/delivery-address-card"
import { CheckoutItemCard } from "@/components/checkout-item-card"
import { CheckoutOrderSummary } from "@/components/checkout-order-summary"

export default function CheckoutPage() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()
  const cart = useStore((state) => state.cart)
  const setCheckoutData = useStore((state) => state.setCheckoutData)
  const clearCart = useStore((state) => state.clearCart)

  const [deliveryAddresses, setDeliveryAddresses] = useState<
    Partial<Record<MealCategory, DeliveryAddress>>
  >({})

  const initializeSDK = async () => {
    const cashfree = await load({
      mode: `${process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT}`,
    })
    return cashfree
  }

  const userCartItems = useMemo(
    () => cart?.items.filter((item) => item.userId === user?.id) || [],
    [cart?.items, user?.id]
  )

  const totalPrice = useMemo(
    () => userCartItems.reduce((sum, item) => sum + item.itemTotalPrice, 0),
    [userCartItems]
  )

  const uniqueMealCategories = useMemo(
    () => Array.from(new Set(userCartItems.map((item) => item.meal.category))),
    [userCartItems]
  )

  const displayCheckoutItems: CheckoutItem[] = useMemo(() => {
    return userCartItems
      .map((cartItem): CheckoutItem | null => {
        return {
          id: cartItem.id,
          meal: {
            id: cartItem.meal._id,
            name: cartItem.meal.name,
            image: cartItem.meal.image || "/defaults/default-meal.jpg",
          },
          plan: { id: cartItem.plan._id, name: cartItem.plan.name },
          quantity: cartItem.quantity,
          personDetails: cartItem.personDetails,
          startDate: cartItem.startDate,
          endDate: cartItem.endDate,
          itemTotalPrice: cartItem.itemTotalPrice,
          vendor: { id: cartItem.vendor._id, name: cartItem.vendor.name },
        }
      })
      .filter((item): item is CheckoutItem => item !== null)
  }, [userCartItems])

  const totalPlanDays = useMemo(
    () => userCartItems.reduce((sum, item) => sum + item.plan.durationDays, 0),
    [userCartItems]
  )
  const deliveryCostPerCategory = 33.33
  const deliveryCost = useMemo(
    () => uniqueMealCategories.length * deliveryCostPerCategory * totalPlanDays,
    [uniqueMealCategories.length, totalPlanDays]
  )
  const platformCost = useMemo(() => totalPrice * 0.1, [totalPrice])
  const gstCost = useMemo(() => totalPrice * 0.05, [totalPrice])
  const grandTotal = useMemo(
    () => totalPrice + deliveryCost + platformCost + gstCost,
    [totalPrice, deliveryCost, platformCost, gstCost]
  )

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth?returnUrl=/checkout")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (!loading && isAuthenticated && userCartItems.length === 0) {
      toast.info("Your cart is empty. Redirecting to pricing page.")
      router.push("/pricing")
    }
  }, [loading, isAuthenticated, userCartItems.length, router])

  useEffect(() => {
    if (userCartItems.length > 0) {
      const initialAddresses: Partial<Record<MealCategory, DeliveryAddress>> =
        {}
      uniqueMealCategories.forEach((category) => {
        initialAddresses[category] = {
          street: "",
          city: "Coimbatore",
          zip: "",
        }
      })
      setDeliveryAddresses(initialAddresses)
    }
  }, [userCartItems, uniqueMealCategories])

  if (loading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#606C38", borderTopColor: "transparent" }}
            ></div>
            <p className="text-lg font-medium" style={{ color: "#283618" }}>
              Loading checkout...
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }
  const handleAddressChange = (
    category: MealCategory,
    field: keyof DeliveryAddress,
    value: string
  ) => {
    setDeliveryAddresses((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      } as DeliveryAddress,
    }))
  }

  const handleGeolocation = (category: MealCategory) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          console.log(
            `Fetching location for ${category}: Lat ${latitude}, Lng ${longitude}`
          )

          setDeliveryAddresses((prev) => ({
            ...prev,
            [category]: {
              ...prev[category],
              lat: latitude,
              lon: longitude,
            } as DeliveryAddress,
          }))
          toast.success(
            `Location fetched for ${category}.`
          )
        },
        (error) => {
          console.error("Geolocation error:", error)
          toast.error(
            `Could not fetch location for ${category}. Please enter manually.`
          )
        }
      )
    } else {
      toast.error("Geolocation is not supported by your browser.")
    }
  }

  const handleProceedToPayment = async () => {
    if (!user?.id || !user?.email) {
      toast.error("User not authenticated or user email not found.")
      return
    }

    for (const category of uniqueMealCategories) {
      const address = deliveryAddresses[category]
      if (
        !address ||
        !address.street ||
        !address.zip ||
        address.city !== "Coimbatore"
      ) {
        toast.error(
          `Please fill in all delivery details for ${category} and ensure city is Coimbatore.`
        )
        return
      }
    }

    const token = localStorage.getItem("aharraa-u-token")

    if (!token) {
      toast.error("Authentication token not found. Please log in again.")
      router.push("/auth?returnUrl=/checkout")
      return
    }

    try {
      // 1. Update user profile with meal-specific delivery addresses
      const profileUpdatePayload: any = {
        email: user.email, // Ensure email is included for identification
      }

      if (deliveryAddresses.Breakfast) {
        profileUpdatePayload.breakfastDeliveryLocation = {
          street: deliveryAddresses.Breakfast.street,
          state: "Tamil Nadu", // Assuming a default state for Coimbatore
          pincode: deliveryAddresses.Breakfast.zip,
          lat: deliveryAddresses.Breakfast.lat,
          lon: deliveryAddresses.Breakfast.lon,
        }
      }
      if (deliveryAddresses.Lunch) {
        profileUpdatePayload.lunchDeliveryLocation = {
          street: deliveryAddresses.Lunch.street,
          state: "Tamil Nadu",
          pincode: deliveryAddresses.Lunch.zip,
          lat: deliveryAddresses.Lunch.lat,
          lon: deliveryAddresses.Lunch.lon,
        }
      }
      if (deliveryAddresses.Dinner) {
        profileUpdatePayload.dinnerDeliveryLocation = {
          street: deliveryAddresses.Dinner.street,
          state: "Tamil Nadu",
          pincode: deliveryAddresses.Dinner.zip,
          lat: deliveryAddresses.Dinner.lat,
          lon: deliveryAddresses.Dinner.lon,
        }
      }

      console.log("Updating user profile with delivery addresses:", profileUpdatePayload)
      await updateProfileDetails(profileUpdatePayload, token)
      toast.success("Delivery addresses saved to your profile!")

      // 2. Proceed with payment
      const finalizedCheckoutData: CheckoutData = {
        id: `checkout-${Date.now()}-${user.id}`,
        userId: user.id,
        items: displayCheckoutItems,
        deliveryAddresses: deliveryAddresses as Record<
          MealCategory,
          DeliveryAddress
        >,
        totalPrice: totalPrice,
        checkoutDate: new Date().toISOString(),
      }

      console.log("Finalized Checkout Data:", finalizedCheckoutData)
      setCheckoutData(finalizedCheckoutData)

      // Create a deep copy of finalizedCheckoutData and remove the image property from meal objects
      const checkoutDataForBackend: CheckoutData = JSON.parse(
        JSON.stringify(finalizedCheckoutData)
      )
      checkoutDataForBackend.items.forEach((item) => {
        if (item.meal.image) {
          delete item.meal.image
        }
      })

      const paymentPayload: CreatePaymentPayload = {
        userId: user.id,
        checkoutData: checkoutDataForBackend,
        paymentMethod: "UPI", // This should be dynamic based on user selection
        totalAmount: grandTotal,
        currency: "INR",
      }

      const response = await createPayment(paymentPayload, token)
      console.log(response.paymentSessionId)
      const cashfree = await initializeSDK()
      const checkoutOptions = {
        paymentSessionId: response.paymentSessionId,
        redirectTarget: "_self",
      }
      cashfree.checkout(checkoutOptions).then(async (result: any) => {
        if (result.error) {
          console.error("Payment error:", result.error)
          toast.error("Payment failed. Please try again.")
        } else if (result.paymentDetails) {
          console.log("Payment completed:", result.paymentDetails)
          const order = await createOrder(response.orderId, token)
          toast.success(`Order created successfully!`)
          clearCart()
          router.push(`/order-status/${order._id}`) // Redirect to order status page
        }
      })
    } catch (error: any) {
      console.error("Error during checkout process:", error)
      toast.error(
        `Failed to complete checkout: ${error.message || "Unknown error"}`
      )
    }
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: "#283618" }}>
            Checkout
          </h1>
          <p className="text-sm sm:text-base" style={{ color: "#606C38" }}>
            Review your order and enter delivery details
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {uniqueMealCategories.map((category) => (
              <DeliveryAddressCard
                key={category}
                category={category}
                address={deliveryAddresses[category]}
                onAddressChange={handleAddressChange}
                onGeolocation={handleGeolocation}
              />
            ))}

            <CheckoutItemCard items={displayCheckoutItems} />
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <CheckoutOrderSummary
                totalPrice={totalPrice}
                deliveryCost={deliveryCost}
                platformCost={platformCost}
                gstCost={gstCost}
                grandTotal={grandTotal}
                itemCount={userCartItems.length}
                deliveryCostPerCategory={deliveryCostPerCategory}
                totalPlanDays={totalPlanDays}
                uniqueCategoryCount={uniqueMealCategories.length}
                onProceedToPayment={handleProceedToPayment}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
