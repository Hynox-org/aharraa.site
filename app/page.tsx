"use client"

import { Header } from "@/components/header"
import { PlanSelection } from "@/components/plan-selection"
import { LocationSelection } from "@/components/location-selection"
import { SlotSelection } from "@/components/slot-selection"
import { MenuDisplay } from "@/components/menu-display"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ReviewsSection } from "@/components/reviews-section"
import { FaqSection } from "@/components/faq-section"
import { FoodShowcase } from "@/components/food-showcase"
import { Footer } from "@/components/footer"

export default function Home() {
  const selectedPlan = useStore((state) => state.selectedPlan)
  const selectedLocation = useStore((state) => state.selectedLocation)
  const selectedSlot = useStore((state) => state.selectedSlot)

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Only show when no plan selected */}
      {!selectedPlan && (
        <section className="bg-gradient-to-r from-orange-50 to-white py-16 border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in-up">
                <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-4 text-balance">
                  Fresh, Home-Cooked Meals
                </h1>
                <p className="text-xl text-orange-600 font-semibold mb-4">Delivered to Your Door</p>
                <p className="text-neutral-600 mb-8 text-balance">
                  Our talented home chefs prepare delicious meals made with locally-sourced ingredients, so you can
                  enjoy home style food in the comfort of your own home.
                </p>
              </div>
              <div className="flex justify-center animate-slide-in-right">
                <div className="relative w-full h-80 bg-orange-100 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-6xl animate-pulse">🍲</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedPlan ? (
          <>
            <PlanSelection />
            <FoodShowcase />
            <ReviewsSection />
            <FaqSection />
          </>
        ) : !selectedLocation ? (
          <>
            <div className="mb-8 flex items-center gap-4">
              <Button
                onClick={() => useStore.setState({ selectedPlan: null })}
                variant="outline"
                className="border-neutral-200"
              >
                ← Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  {selectedPlan.name} - ₹{selectedPlan.totalPrice}
                </h2>
              </div>
            </div>
            <LocationSelection />
          </>
        ) : !selectedSlot ? (
          <>
            <div className="mb-8 flex items-center gap-4">
              <Button
                onClick={() => useStore.setState({ selectedLocation: null })}
                variant="outline"
                className="border-neutral-200"
              >
                ← Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  {selectedPlan.name} - {selectedLocation}
                </h2>
              </div>
            </div>
            <SlotSelection />
          </>
        ) : (
          <>
            <div className="mb-8 flex items-center gap-4">
              <Button
                onClick={() => useStore.setState({ selectedSlot: null })}
                variant="outline"
                className="border-neutral-200"
              >
                ← Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  {selectedPlan.name} - {selectedSlot.charAt(0).toUpperCase() + selectedSlot.slice(1)}
                </h2>
              </div>
            </div>
            <MenuDisplay />
          </>
        )}
      </div>

      <Footer />
    </main>
  )
}
