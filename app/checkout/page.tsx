"use client"

import { useEffect, useState, useMemo } from "react"
import { Header } from "@/components/header"
import { useStore, DeliveryAddress } from "@/lib/store"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import CheckoutSummary from "@/components/checkout-summary"
import { LocationSelection } from "@/components/location-selection"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { shallow } from "zustand/shallow"

interface OrderSummary {
  plan: {
    name: string
    duration: string
    daysCount: number
    pricePerDay: number
    totalPrice: number
    dates: {
      start: string
      end: string
    }
  }
  vendor: {
    id: string
    name: string
    location: string
    rating: number
    contactInfo: {
      phone: string
      email: string
    }
  }
  dietPreference: "veg" | "non-veg"
  weeklyMenu: {
    [key: string]: {
      date: string
      meals: {
        breakfast: Array<{ id: string; name: string; isVegetarian: boolean }>
        lunch: Array<{ id: string; name: string; isVegetarian: boolean }>
        dinner: Array<{ id: string; name: string; isVegetarian: boolean }>
      }
    }
  }
  accompaniments: Array<{
    id: string
    name: string
    price: number
  }>
  pricing: {
    planTotal: number
    accompanimentsTotal: number
    grandTotal: number
  }
  deliveryAddresses: {
    breakfast: DeliveryAddress | null,
    lunch: DeliveryAddress | null,
    dinner: DeliveryAddress | null,
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [summary, setSummary] = useState<OrderSummary | null>(null)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const deliveryAddresses = useStore((state) => state.deliveryAddresses);

  useEffect(() => {
    const savedSummary = localStorage.getItem('orderSummary')
    if (savedSummary) {
      const parsedSummary = JSON.parse(savedSummary);
      setSummary({ ...parsedSummary, deliveryAddresses });
    }
  }, [JSON.stringify(deliveryAddresses)]) // Re-run effect if deliveryAddresses change

  const { hasBreakfastMeals, hasLunchMeals, hasDinnerMeals } = useMemo(() => {
    if (!summary?.weeklyMenu) {
      return { hasBreakfastMeals: false, hasLunchMeals: false, hasDinnerMeals: false };
    }

    const hasBreakfast = Object.values(summary.weeklyMenu).some(
      (dayMenu) => dayMenu.meals.breakfast && dayMenu.meals.breakfast.length > 0
    );
    const hasLunch = Object.values(summary.weeklyMenu).some(
      (dayMenu) => dayMenu.meals.lunch && dayMenu.meals.lunch.length > 0
    );
    const hasDinner = Object.values(summary.weeklyMenu).some(
      (dayMenu) => dayMenu.meals.dinner && dayMenu.meals.dinner.length > 0
    );
    return { hasBreakfastMeals: hasBreakfast, hasLunchMeals: hasLunch, hasDinnerMeals: hasDinner };
  }, [summary?.weeklyMenu]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Review Your Order</h1>

        {!summary ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-6">No order details found</p>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Return to Home</Button>
            </Link>
          </div>
        ) : (
          <>
            <CheckoutSummary
              summary={summary}
              onProceedToPayment={() => setIsLocationModalOpen(true)}
              deliveryAddresses={deliveryAddresses}
            />

            <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Confirm Delivery Addresses</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {hasBreakfastMeals && <LocationSelection mealType="breakfast" />}
                  {hasLunchMeals && <LocationSelection mealType="lunch" />}
                  {hasDinnerMeals && <LocationSelection mealType="dinner" />}
                </div>
                <DialogFooter>
                  <Button type="button" onClick={() => setIsLocationModalOpen(false)}>
                    Done
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </main>
  )
}
