"use client";

import { format } from "date-fns";
import { Header } from "@/components/header";
import { PlanSelection } from "@/components/plan-selection";
import { DateRangeSelection } from "@/components/date-range-selection";
import { VendorSelection } from "@/components/vendor-selection";
import { MenuDisplay } from "@/components/menu-display";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ReviewsSection } from "@/components/reviews-section";
import { FaqSection } from "@/components/faq-section";
import { FoodShowcase } from "@/components/food-showcase";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/auth-context";
import { useEffect } from "react";
import { VENDORS } from "@/lib/vendor-data";

export default function Home() {
  const selectedPlan = useStore((state) => state.selectedPlan);
  const selectedDates = useStore((state) => state.selectedDates);
  const datesConfirmed = useStore((state) => state.datesConfirmed);
  const selectedVendorId = useStore((state) => state.selectedVendorId);
  const selectedVendor = selectedVendorId
    ? VENDORS.find((vendor) => vendor.id === selectedVendorId)
    : null;

  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1)); // Remove '#'
        const accessToken = params.get("access_token");

        if (accessToken) {
          await login(accessToken);
          // Clean up the URL hash
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
          router.push("/");
        }
      }
    };

    handleOAuthRedirect();
  }, [router, login]);

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
                <p className="text-xl text-orange-600 font-semibold mb-4">
                  Delivered to Your Door
                </p>
                <p className="text-neutral-600 mb-8 text-balance">
                  Our talented home chefs prepare delicious meals made with
                  locally-sourced ingredients, so you can enjoy home style food
                  in the comfort of your own home.
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
        ) : !selectedDates || !datesConfirmed ? (
          <>
            <div className="mb-8 flex items-center gap-4">
              <Button
                onClick={() => {
                  useStore.setState({
                    selectedPlan: null,
                    selectedDates: null,
                    datesConfirmed: false,
                  });
                }}
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
            <DateRangeSelection />
          </>
        ) : !selectedVendorId ? (
          <>
            <div className="mb-8 flex items-center gap-4">
              <Button
                onClick={() => {
                  useStore.setState({
                    datesConfirmed: false,
                    selectedDates: null,
                  });
                }}
                variant="outline"
                className="border-neutral-200"
              >
                ← Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  {selectedPlan.name} - ₹{selectedPlan.totalPrice}
                </h2>
                <p className="text-sm text-neutral-600 mt-1">
                  {format(selectedDates.startDate, "PPP")} to{" "}
                  {format(selectedDates.endDate, "PPP")}
                </p>
              </div>
            </div>
            <VendorSelection />
          </>
        ) : (
          <>
            <div className="mb-8 flex items-center gap-4">
              <Button
                onClick={() => {
                  useStore.setState({
                    selectedVendorId: null,
                  });
                }}
                variant="outline"
                className="border-neutral-200"
              >
                ← Back
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  {selectedPlan.name} - ₹{selectedPlan.totalPrice}
                </h2>
                <p className="text-sm text-neutral-600 mt-1">
                  {format(selectedDates.startDate, "PPP")} to{" "}
                  {format(selectedDates.endDate, "PPP")}
                </p>
              </div>
            </div>
            <MenuDisplay />
          </>
        )}
      </div>

      <Footer />
    </main>
  );
}
