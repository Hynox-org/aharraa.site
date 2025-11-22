"use client"

import { useState, useEffect, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
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
  Cart,
  CartItem,
  Menu,
  Plan,
  CheckoutItemView,
} from "@/lib/types"
import { createOrder, updateProfileDetails, getProfileDetails } from "@/lib/api"
import { load } from "@cashfreepayments/cashfree-js"
import LottieAnimation from "@/components/lottie-animation"
import ItayCheffAnimation from "@/public/lottie/ItayCheff.json"

import { CheckoutEmptyState } from "@/components/checkout-empty-state"
import { DeliveryAddressCard } from "@/components/delivery-address-card"
import { CheckoutItemCard } from "@/components/checkout-item-card"
import { CheckoutOrderSummary } from "@/components/checkout-order-summary"
import {
  calculateGrandTotal,
  calculateDeliveryCost,
  calculatePlatformCost,
  calculateGstCost,
} from "@/lib/checkout-helpers"
import { getCartItems , clearCart} from "@/lib/api"; 
import { Button } from "@/components/ui/button"

export default function CheckoutPage() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()
  const [cartData, setCartData] = useState<Cart | null>(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [deliveryAddresses, setDeliveryAddresses] = useState<
    Partial<Record<MealCategory, DeliveryAddress>>
  >({})
  const [useDefaultForAll, setUseDefaultForAll] = useState(false)
  const [primaryAddress, setPrimaryAddress] = useState<MealCategory>("Breakfast")
  const [isFetchingAddresses, setIsFetchingAddresses] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) return
      const token = localStorage.getItem("aharraa-u-token");
      console.log("Token:", token);
      if (!token) {
        console.error("❌ No auth token found. User must log in first.");
        router.push("/auth?returnUrl=/pricing");
        return;
      }
      try {
        setCartLoading(true)
        const fetchedCart = await getCartItems(user.id, token);
        if (fetchedCart) {
          setCartData(fetchedCart)
        } else {
          toast.info("Your cart is empty.")
        }
      } catch (error) {
        console.error("Error fetching cart items:", error)
        toast.error("Failed to load cart items.")
      } finally {
        setCartLoading(false)
      }
    }
    if (isAuthenticated && !loading) {
      fetchCart()
    }
  }, [isAuthenticated, loading, user?.id])
  
  const initializeSDK = async () => {
    const cashfree = await load({
      mode: `${process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT}`,
    })
    return cashfree
  }

  const userCartItems = useMemo(
    () =>
      cartData?.items.filter(
        (item): item is CartItem & { menu: Menu; plan: Plan } =>
          typeof item !== "string" &&
          item.user === user?.id &&
          typeof item.menu === "object" &&
          typeof item.plan === "object"
      ) || [],
    [cartData?.items, user?.id]
  );
console.log("userCartItems:", userCartItems);

const displayCheckoutItems: CheckoutItem[] = useMemo(() => {
    return userCartItems
      .map((cartItem): CheckoutItem | null => {
        if (typeof cartItem.menu === 'string' || !cartItem.menu) {
          console.error("CartItem menu is not a populated object:", cartItem.menu);
          return null;
        }
        if (typeof cartItem.menu.vendor === 'string' || !cartItem.menu.vendor) {
          console.error("CartItem menu vendor is not a populated object:", cartItem.menu.vendor);
          return null;
        }

        return {
          id: cartItem._id,
          menu: cartItem.menu._id,
          plan: cartItem.plan._id,
          quantity: cartItem.quantity,
          personDetails: cartItem.personDetails,
          startDate: cartItem.startDate,
          endDate: cartItem.endDate,
          itemTotalPrice: cartItem.itemTotalPrice,
          vendor: (cartItem.menu.vendor as Vendor)._id,
          selectedMealTimes: cartItem.selectedMealTimes,
        }
      })
      .filter((item): item is CheckoutItem => item !== null)
  }, [userCartItems])
  
  const displayCheckoutItemsView: CheckoutItemView[] = useMemo(() => {
    return userCartItems
      .map((cartItem): CheckoutItemView | null => {
        console.log("cartItem:", cartItem);
        return {
          id: cartItem._id,
          menu: {
            id: cartItem.menu._id,
            name: cartItem.menu.name,
            coverImage: cartItem.menu.coverImage || "/defaults/default-meal.jpg",
          },
          plan: { id: cartItem.plan._id, name: cartItem.plan.name , durationDays: cartItem.plan.durationDays },
          quantity: cartItem.quantity,
          personDetails: cartItem.personDetails,
          startDate: cartItem.startDate,
          endDate: cartItem.endDate,
          itemTotalPrice: cartItem.itemTotalPrice,
          vendor: {
            id: cartItem.vendor,
            name: "Vendor",
          },
          selectedMealTimes: cartItem.selectedMealTimes,
        }
      })
      .filter((item): item is CheckoutItemView => item !== null)
  }, [userCartItems])
  
   const totalPrice = useMemo(
    () => userCartItems.reduce((sum, item) => sum + item.itemTotalPrice, 0),
    [userCartItems]
  )

  const uniqueMealCategories = useMemo(
    () =>
      Array.from(
        new Set(
          userCartItems.flatMap((item) =>
            item.menu.menuItems.map((menuItem) => menuItem.category)
          )
        )
      ),
    [userCartItems]
  );

  const deliveryCostPerMealPerDay = 33
  const deliveryCost = useMemo(
    () =>
      calculateDeliveryCost(
        userCartItems,
        deliveryCostPerMealPerDay
      ),
    [userCartItems, deliveryCostPerMealPerDay]
  )
  const platformCost = useMemo(
    () => calculatePlatformCost(totalPrice),
    [totalPrice]
  )
  const gstCost = useMemo(() => calculateGstCost(totalPrice), [totalPrice])
  const grandTotal = useMemo(
    () =>
      calculateGrandTotal({
        subtotal: totalPrice,
        deliveryCost,
        platformCost,
        gstCost,
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
      }),
    [totalPrice, deliveryCost, platformCost, gstCost]
  )

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth?returnUrl=/checkout")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (!loading && !cartLoading && isAuthenticated && userCartItems.length === 0) {
      toast.info("Your cart is empty. Redirecting to pricing page.")
      router.push("/pricing")
    }
  }, [loading, cartLoading, isAuthenticated, userCartItems.length, router])

  useEffect(() => {
    const allMealCategories: MealCategory[] = ["Breakfast", "Lunch", "Dinner"];
    const initialAddresses: Partial<Record<MealCategory, DeliveryAddress>> = {};

    allMealCategories.forEach((category) => {
      initialAddresses[category] = {
        street: "",
        city: "Coimbatore",
        zip: "",
      };
    });
    setDeliveryAddresses(initialAddresses);
  }, []);

  if (loading || cartLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LottieAnimation animationData={ItayCheffAnimation} style={{ width: 200, height: 200 }} />
      </div>
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

  const handleFetchAddressesFromProfile = async () => {
    if (!user?.id) {
      toast.error("User not authenticated.")
      return
    }
    const token = localStorage.getItem("aharraa-u-token")
    if (!token) {
      toast.error("Authentication token not found. Please log in again.")
      router.push("/auth?returnUrl=/checkout")
      return
    }

    setIsFetchingAddresses(true)
    try {
      const userProfile = await getProfileDetails(token)
      if (userProfile) {
        const newDeliveryAddresses: Partial<Record<MealCategory, DeliveryAddress>> = {}

        const mapLocationToAddress = (location: any): DeliveryAddress | undefined => {
          if (!location) return undefined
          return {
            street: location.street || "",
            city: "Coimbatore",
            zip: location.pincode || "",
            lat: location.lat,
            lon: location.lon,
          }
        }

        if (userProfile.breakfastDeliveryLocation) {
          newDeliveryAddresses.Breakfast = mapLocationToAddress(userProfile.breakfastDeliveryLocation)
        }
        if (userProfile.lunchDeliveryLocation) {
          newDeliveryAddresses.Lunch = mapLocationToAddress(userProfile.lunchDeliveryLocation)
        }
        if (userProfile.dinnerDeliveryLocation) {
          newDeliveryAddresses.Dinner = mapLocationToAddress(userProfile.dinnerDeliveryLocation)
        }

        if (Object.keys(newDeliveryAddresses).length > 0) {
          setDeliveryAddresses((prev) => {
            const updatedAddresses = { ...prev };
            (Object.keys(newDeliveryAddresses) as MealCategory[]).forEach((category) => {
              if (newDeliveryAddresses[category]) {
                updatedAddresses[category] = newDeliveryAddresses[category];
              }
            });
            return updatedAddresses;
          });
          toast.success("Delivery addresses fetched from your profile!")
        } else {
          toast.info("No saved delivery addresses found in your profile.")
        }
      } else {
        toast.info("Could not fetch user profile details.")
      }
    } catch (error) {
      console.error("Error fetching profile addresses:", error)
        toast.error("Failed to fetch addresses from profile.")
    } finally {
      setIsFetchingAddresses(false)
    }
  }

  const handleProceedToPayment = async () => {
    if (!user?.id || !user?.email) {
      toast.error("User not authenticated or user email not found.")
      return
    }

    const allMealCategories: MealCategory[] = ["Breakfast", "Lunch", "Dinner"];
    for (const category of allMealCategories) {
      const address = deliveryAddresses[category];
      if (
        !address ||
        !address.street ||
        !address.zip ||
        address.city !== "Coimbatore"
      ) {
        toast.error(
          `Please fill in all delivery details for ${category} and ensure city is Coimbatore.`
        );
        return;
      }
    }

    const token = localStorage.getItem("aharraa-u-token")

    if (!token) {
      toast.error("Authentication token not found. Please log in again.")
      router.push("/auth?returnUrl=/checkout")
      return
    }

    setIsProcessingPayment(true)
    try {
      const profileUpdatePayload: any = {
        email: user.email,
      }

      if (deliveryAddresses.Breakfast) {
        profileUpdatePayload.breakfastDeliveryLocation = {
          street: deliveryAddresses.Breakfast.street,
          state: "Tamil Nadu",
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
      console.log("initialCheckoutItems:",displayCheckoutItems )
      
      const finalizedCheckoutData: CheckoutData = {
        id: `checkout-${Date.now()}-${user.id}`,
        userId: user.id,
        items: displayCheckoutItems,
        deliveryAddresses: deliveryAddresses as Record<
          MealCategory,
          DeliveryAddress
        >,
        totalPrice: grandTotal,
        checkoutDate: new Date().toISOString(),
      }

      console.log("Finalized Checkout Data:", finalizedCheckoutData)

      const checkoutDataForBackend: CheckoutData = JSON.parse(
        JSON.stringify(finalizedCheckoutData)
      )

      const paymentPayload: CreatePaymentPayload = {
        userId: user.id,
        checkoutData: checkoutDataForBackend,
        paymentMethod: "UPI",
        totalAmount: grandTotal,
        currency: "INR",
      }
      console.log("Payment Payload:", paymentPayload)
      const response = await createOrder(paymentPayload, token)
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
          toast.success(`Order created successfully!`)
        }
      })
  } catch (error: any) {
    console.error("Error during checkout process:", error)
    toast.error(`Failed to complete checkout: ${error.message || "Unknown error"}`)
  } finally {
    setIsProcessingPayment(false)
  }
}

const handleCopyAddress = (fromCategory: MealCategory, toCategory: MealCategory) => {
  const sourceAddress = deliveryAddresses[fromCategory]
  if (sourceAddress) {
    setDeliveryAddresses((prev) => ({
      ...prev,
      [toCategory]: { ...sourceAddress },
    }))
    toast.success(`Address copied from ${fromCategory} to ${toCategory}`)
  }
}

const handleUseDefaultForAll = (checked: boolean, category: MealCategory) => {
  setUseDefaultForAll(checked)
  setPrimaryAddress(category)
  
  if (checked) {
    const sourceAddress = deliveryAddresses[category]
    if (sourceAddress) {
      const allCategories: MealCategory[] = ["Breakfast", "Lunch", "Dinner"]
      const newAddresses = { ...deliveryAddresses }
      
      allCategories.forEach((cat) => {
        if (cat !== category) {
          newAddresses[cat] = { ...sourceAddress }
        }
      })
      
      setDeliveryAddresses(newAddresses)
      toast.success(`Using ${category} address for all deliveries`)
    }
  }
}

const handleAddressChangeWithSync = (
  category: MealCategory,
  field: keyof DeliveryAddress,
  value: string
) => {
  handleAddressChange(category, field, value)
  
  if (useDefaultForAll && category === primaryAddress) {
    const allCategories: MealCategory[] = ["Breakfast", "Lunch", "Dinner"]
    allCategories.forEach((cat) => {
      if (cat !== category) {
        setDeliveryAddresses((prev) => ({
          ...prev,
          [cat]: {
            ...prev[cat],
            [field]: value,
          } as DeliveryAddress,
        }))
      }
    })
  }
}

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-black">
            Checkout
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Review your order and enter delivery details
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl p-4 sm:p-6 shadow-md flex justify-between items-center bg-white border border-gray-100">
              <p className="text-base font-bold text-black">
                Fetch addresses from your profile
              </p>
              <Button
                onClick={handleFetchAddressesFromProfile}
                className="text-white px-4 py-2 rounded-lg bg-[#3CB371] hover:bg-[#2FA05E]"
                disabled={isFetchingAddresses}
              >
                {isFetchingAddresses ? "Fetching..." : "Fetch Addresses"}
              </Button>
            </div>
            
            {/* Global "Use Same Address for All" Option */}
            <div className="rounded-xl p-4 sm:p-6 shadow-md bg-white border border-gray-100">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="use-same-address"
                  checked={useDefaultForAll}
                  onChange={(e) => handleUseDefaultForAll(e.target.checked, primaryAddress)}
                  className="mt-1 w-5 h-5 rounded cursor-pointer accent-[#3CB371]"
                />
                <div className="flex-1">
                  <label
                    htmlFor="use-same-address"
                    className="text-base font-bold cursor-pointer block text-black"
                  >
                    Use same address for all deliveries
                  </label>
                  <p className="text-sm mt-1 text-gray-600">
                    Check this to use your primary address for Breakfast, Lunch, and Dinner deliveries
                  </p>
                </div>
              </div>
            </div>

            {/* Address Cards */}
            {["Breakfast", "Lunch", "Dinner"].map((category, index) => (
              <DeliveryAddressCard
                key={category as MealCategory}
                category={category as MealCategory}
                address={deliveryAddresses[category as MealCategory]}
                onAddressChange={handleAddressChangeWithSync}
                onGeolocation={handleGeolocation}
                onCopyAddress={handleCopyAddress}
                isPrimary={useDefaultForAll && category === primaryAddress}
                isDisabled={useDefaultForAll && category !== primaryAddress}
                allCategories={["Breakfast", "Lunch", "Dinner"]}
                showCopyOptions={!useDefaultForAll}
              />
            ))}

            <CheckoutItemCard items={displayCheckoutItemsView} />
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-25">
              <CheckoutOrderSummary
                totalPrice={totalPrice}
                deliveryCost={deliveryCost}
                platformCost={platformCost}
                gstCost={gstCost}
                grandTotal={grandTotal}
                itemCount={userCartItems.length}
                onProceedToPayment={handleProceedToPayment}
                isProcessingPayment={isProcessingPayment}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
