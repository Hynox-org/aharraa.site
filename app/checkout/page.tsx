"use client"

import { useEffect, useState, useMemo } from "react"
import { Header } from "@/components/header"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import CheckoutSummary from "@/components/checkout-summary"
import { LocationSelection } from "@/components/location-selection"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { shallow } from "zustand/shallow"
import { OrderSummary, DeliveryAddress } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns";
import { VENDORS } from "@/lib/vendor-data";
import { useAuth } from "@/app/context/auth-context";
import { validateToken } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth(); // Get isAuthenticated and logout from AuthContext
  const [summary, setSummary] = useState<OrderSummary | null>(null)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const deliveryAddresses = useStore((state) => state.deliveryAddresses);
  const setSelectedPlan = useStore((state) => state.setSelectedPlan);
  const setSelectedDates = useStore((state) => state.setSelectedDates);
  const setSelectedVendorId = useStore((state) => state.setSelectedVendorId);

  const selectedPlan = useStore((state) => state.selectedPlan);
  const selectedDates = useStore((state) => state.selectedDates);
  const selectedVendorId = useStore((state) => state.selectedVendorId);
  const selectedVendor = selectedVendorId
    ? VENDORS.find((vendor) => vendor.id === selectedVendorId)
    : null;

  useEffect(() => {
    const savedSummary = localStorage.getItem('orderSummary')
    if (savedSummary) {
      const parsedSummary = JSON.parse(savedSummary);
      console.log("CheckoutPage - parsedSummary from localStorage:", parsedSummary);
      setSummary({ ...parsedSummary, deliveryAddresses });

      // Update the store with the plan, dates, and vendor from the summary
      if (parsedSummary.plan) {
        setSelectedPlan({
          id: parsedSummary.plan.id,
          name: parsedSummary.plan.name,
          duration: parsedSummary.plan.duration,
          daysCount: parsedSummary.plan.daysCount,
          pricePerDay: parsedSummary.plan.pricePerDay,
          totalPrice: parsedSummary.plan.totalPrice,
          planType: parsedSummary.dietPreference, // Assuming dietPreference maps to planType
        });
      }
      if (parsedSummary.plan.dates) {
        setSelectedDates({
          startDate: new Date(parsedSummary.plan.dates.start),
          endDate: new Date(parsedSummary.plan.dates.end),
        });
      }
      if (parsedSummary.vendor) {
        setSelectedVendorId(parsedSummary.vendor.id);
      }
    } else {
      console.log("CheckoutPage - No orderSummary found in localStorage.");
    }
    console.log("CheckoutPage - selectedPlan after effect:", selectedPlan);
    console.log("CheckoutPage - summary after effect:", summary);
  }, [JSON.stringify(deliveryAddresses), setSelectedPlan, setSelectedDates, setSelectedVendorId, setSummary]) // Removed selectedPlan and summary from dependencies to prevent infinite loop

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

        {summary?.plan && (
          <div className="mb-8 relative">
            {/* Main Card with Layered Design */}
            <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl p-8 shadow-lg border border-green-200/50">

              {/* Floating Badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full shadow-lg text-sm font-semibold">
                Active Selection
              </div>

              {/* Title with Icon */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800">Order Summary</span>
                </div>
              </div>

              {/* Grid Layout for Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Left Column - Plan Details */}
                <div className="space-y-4">
                  {/* Plan Card */}
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">Meal Plan</p>
                        <p className="text-lg font-bold text-neutral-900">{summary.plan.name}</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2 pt-3 border-t border-green-100">
                      <span className="text-3xl font-bold text-green-600">₹{summary.plan.totalPrice}</span>
                      <span className="text-sm text-neutral-500">total</span>
                    </div>
                  </div>

                  {/* Vendor Card */}
                  {summary.vendor && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-5 text-white shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-green-100 font-medium uppercase tracking-wide">Vendor</p>
                          <p className="text-base font-bold">{summary.vendor.name}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Dates */}
                {summary.plan.dates && (
                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-100">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">Delivery Period</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-green-700">
                            {format(new Date(summary.plan.dates.start), "dd")}
                          </span>
                          <span className="text-xs text-green-600 font-medium">
                            {format(new Date(summary.plan.dates.start), "MMM")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-neutral-500 mb-1">Start Date</p>
                          <p className="text-sm font-semibold text-neutral-900">
                            {format(new Date(summary.plan.dates.start), "EEEE, PPP")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="w-full border-t-2 border-dashed border-green-200 relative">
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-50 px-3">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-emerald-700">
                            {format(new Date(summary.plan.dates.end), "dd")}
                          </span>
                          <span className="text-xs text-emerald-600 font-medium">
                            {format(new Date(summary.plan.dates.end), "MMM")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-neutral-500 mb-1">End Date</p>
                          <p className="text-sm font-semibold text-neutral-900">
                            {format(new Date(summary.plan.dates.end), "EEEE, PPP")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <Link href="/">
                  <Button
                    className="w-full h-12 bg-white hover:bg-neutral-50 text-green-700 border-2 border-green-200 hover:border-green-300 rounded-xl font-semibold transition-all group shadow-sm"
                  >
                    <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Modify Selection
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

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
              onProceedToPayment={async () => {
                const token = localStorage.getItem("aharraa-u-token");
                if (!token) {
                  router.push(`/auth?returnUrl=/checkout`);
                  return;
                }
                try {
                  await validateToken(token);
                  setIsLocationModalOpen(true);
                } catch (error) {
                  console.error("Session validation failed:", error);
                  logout(); // Log out the user if token is invalid
                  router.push(`/auth?returnUrl=/checkout`);
                }
              }}
              deliveryAddresses={deliveryAddresses}
            />

            <Dialog open={isLocationModalOpen} onOpenChange={setIsLocationModalOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Confirm Delivery Addresses</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] pr-4">
                  <div className="grid gap-4 py-4">
                    {hasBreakfastMeals && <LocationSelection mealType="breakfast" />}
                    {hasLunchMeals && <LocationSelection mealType="lunch" />}
                    {hasDinnerMeals && <LocationSelection mealType="dinner" />}
                  </div>
                </ScrollArea>
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
