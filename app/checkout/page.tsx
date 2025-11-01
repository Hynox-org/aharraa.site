"use client"

import { useState, useEffect } from "react"
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
  CreateOrderPayload,
  Vendor,
} from "@/lib/types"
import { DUMMY_VENDORS } from "@/lib/data"
import { createOrder, createPayment } from "@/lib/api"
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

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth?returnUrl=/checkout")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    const userCartItems =
      cart?.items.filter((item) => item.userId === user?.id) || []
    if (userCartItems.length > 0) {
      const initialAddresses: Partial<Record<MealCategory, DeliveryAddress>> =
        {}
      const uniqueCategories = Array.from(
        new Set(userCartItems.map((item) => item.meal.category))
      )

      uniqueCategories.forEach((category) => {
        initialAddresses[category] = {
          street: "",
          city: "Coimbatore",
          zip: "",
        }
      })
      setDeliveryAddresses(initialAddresses)
    }
  }, [cart?.items, user?.id])

  if (loading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#606C38", borderTopColor: "transparent" }}>
            </div>
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

  const userCartItems =
    cart?.items.filter((item) => item.userId === user.id) || []
  const totalPrice = userCartItems.reduce(
    (sum, item) => sum + item.itemTotalPrice,
    0
  )
  const uniqueMealCategories = Array.from(
    new Set(userCartItems.map((item) => item.meal.category))
  )

  const deliveryCostPerCategory = 50
  const deliveryCost = uniqueMealCategories.length * deliveryCostPerCategory
  const platformCost = totalPrice * 0.10
  const gstCost = totalPrice * 0.05
  const grandTotal = totalPrice + deliveryCost + platformCost + gstCost

  if (userCartItems.length === 0) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
        <Header />
        <CheckoutEmptyState />
        <Footer />
      </main>
    )
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

          const dummyStreet = "123 Main Road"
          const dummyZip = "641001"

          setDeliveryAddresses((prev) => ({
            ...prev,
            [category]: {
              ...prev[category],
              street: dummyStreet,
              city: "Coimbatore",
              zip: dummyZip,
            } as DeliveryAddress,
          }))
          toast.success(
            `Location fetched for ${category}. Please verify details.`
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
    if (!user?.id) {
      toast.error("User not authenticated.")
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

    const checkoutItems: CheckoutItem[] = userCartItems.map((cartItem) => {
      const vendor = DUMMY_VENDORS.find(
        (v: Vendor) => v.id === cartItem.meal.vendorId
      )
      return {
        id: cartItem.id,
        meal: cartItem.meal,
        plan: cartItem.plan,
        quantity: cartItem.quantity,
        personDetails: cartItem.personDetails,
        startDate: cartItem.startDate,
        endDate: cartItem.endDate,
        itemTotalPrice: cartItem.itemTotalPrice,
        vendor: vendor || { id: "unknown", name: "Unknown Vendor" },
      }
    })

    const finalizedCheckoutData: CheckoutData = {
      id: `checkout-${Date.now()}-${user.id}`,
      userId: user.id,
      items: checkoutItems,
      deliveryAddresses: deliveryAddresses as Record<
        MealCategory,
        DeliveryAddress
      >,
      totalPrice: totalPrice,
      checkoutDate: new Date().toISOString(),
    }

    console.log("Finalized Checkout Data:", finalizedCheckoutData)
    setCheckoutData(finalizedCheckoutData)

    const orderItems = userCartItems.map((item) => ({
      productId: item.meal.id,
      quantity: item.quantity,
      price: item.itemTotalPrice,
    }))

    const firstCategory = uniqueMealCategories[0]
    const shippingAddress = deliveryAddresses[firstCategory]

    if (!shippingAddress) {
      toast.error("Shipping address not found.")
      return
    }

    const orderPayload: CreateOrderPayload = {
      userId: user.id,
      items: orderItems,
      shippingAddress: shippingAddress,
      billingAddress: shippingAddress,
      deliveryAddresses: finalizedCheckoutData.deliveryAddresses,
      paymentMethod: "UPI",
      totalAmount: grandTotal,
      currency: "INR",
    }

    const token = localStorage.getItem("aharraa-u-token")

    if (!token) {
      toast.error("Authentication token not found. Please log in again.")
      router.push("/auth?returnUrl=/checkout")
      return
    }

    try {
      const paymentSessionId = await createPayment(orderPayload, token)
      console.log(paymentSessionId)
      const cashfree = await initializeSDK()
      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        redirectTarget: "_self",
      }
      cashfree.checkout(checkoutOptions).then(async (result: any) => {
        if (result.error) {
          console.error("Payment error:", result.error)
        } else if (result.paymentDetails) {
          console.log("Payment completed:", result.paymentDetails)
          const order = await createOrder(orderPayload, token)
          toast.success(`Order created successfully!`)
          clearCart()
        }
      })
    } catch (error: any) {
      console.error("Error creating order:", error)
      toast.error(
        `Failed to create order: ${error.message || "Unknown error"}`
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

            <CheckoutItemCard items={userCartItems} />
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
