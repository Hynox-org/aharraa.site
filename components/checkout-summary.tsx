"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MenuSelectionTimeline } from "./menu-selection-timeline";
import { CartSummaryProps } from "@/lib/types";

export default function CheckoutSummary({ summary, onProceedToPayment, deliveryAddresses }: CartSummaryProps) {
  const router = useRouter();

  const hasBreakfastMeals = Object.values(summary.weeklyMenu).some(
    (dayMenu) => dayMenu.meals.breakfast && dayMenu.meals.breakfast.length > 0
  );
  const hasLunchMeals = Object.values(summary.weeklyMenu).some(
    (dayMenu) => dayMenu.meals.lunch && dayMenu.meals.lunch.length > 0
  );
  const hasDinnerMeals = Object.values(summary.weeklyMenu).some(
    (dayMenu) => dayMenu.meals.dinner && dayMenu.meals.dinner.length > 0
  );

  const isBreakfastAddressMissing = hasBreakfastMeals && !deliveryAddresses.breakfast?.formattedAddress;
  const isLunchAddressMissing = hasLunchMeals && !deliveryAddresses.lunch?.formattedAddress;
  const isDinnerAddressMissing = hasDinnerMeals && !deliveryAddresses.dinner?.formattedAddress;

  const areAllRequiredAddressesFilled = !(isBreakfastAddressMissing || isLunchAddressMissing || isDinnerAddressMissing);

  const handleProceedToPayment = () => {
    if (!areAllRequiredAddressesFilled) {
      onProceedToPayment();
    } else {
      console.log("Proceeding to payment with summary:", summary);
      // router.push('/payment');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/50 to-green-50">
      {/* Minimal Header */}
      <div className="bg-white border-b border-green-100 py-6 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-neutral-900">Review Your Order</h1>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700">Step 3 of 3</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Left Column - Weekly Menu Only */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden rounded-3xl border-2 border-green-100 shadow-lg bg-white">
              {/* Menu Header with purple Accent */}
              <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 px-6 py-5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Your Weekly Menu</h2>
                      <p className="text-purple-100 text-sm">Curated meals for the week</p>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <p className="text-white font-bold text-lg">{summary.plan.duration}</p>
                  </div>
                </div>
              </div>
              
              {/* Menu Timeline */}
              <div className="p-8 bg-gradient-to-b from-white to-green-50/30">
                <MenuSelectionTimeline weeklyMenu={summary.weeklyMenu} />
              </div>
            </Card>
          </div>

          {/* Right Column - Payment Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="overflow-hidden rounded-3xl border-2 border-green-200 shadow-xl bg-white">
                
                {/* Header with Green Gradient */}
                <div className="bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 px-6 py-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <h2 className="text-xl font-bold text-white">Order Summary</h2>
                    </div>
                    <p className="text-green-100 text-sm">Final price breakdown</p>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Price Breakdown */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-b border-green-100">
                      <span className="text-neutral-600 font-medium">Plan Total</span>
                      <span className="text-xl font-bold text-neutral-900">₹{summary.pricing.planTotal.toLocaleString()}</span>
                    </div>
                    
                    {summary.pricing.accompanimentsTotal > 0 && (
                      <div className="flex justify-between items-center py-3 border-b border-green-100">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-neutral-600 font-medium">Add-ons</span>
                        </div>
                        <span className="text-xl font-bold text-neutral-900">₹{summary.pricing.accompanimentsTotal.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center py-3 border-b border-green-100">
                      <span className="text-neutral-600 font-medium">GST (5%)</span>
                      <span className="text-lg font-semibold text-neutral-900">
                        ₹{Math.round((summary.pricing.planTotal + summary.pricing.accompanimentsTotal) * 0.05).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Grand Total Card */}
                  <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-red-500 rounded-2xl p-6 mb-6 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                    <div className="relative">
                      <p className="text-purple-100 text-sm font-semibold uppercase tracking-wide mb-1">Total Amount</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-white font-bold text-4xl">₹{summary.pricing.grandTotal.toLocaleString()}</span>
                        <span className="text-purple-100 text-sm">incl. taxes</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handleProceedToPayment}
                  >
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Proceed to Payment
                  </Button>

                  {/* Trust Signals */}
                  <div className="mt-6 pt-6 border-t border-green-100">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">Secure Payment</p>
                          <p className="text-xs text-neutral-500">256-bit SSL encrypted</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-900">On-Time Delivery</p>
                          <p className="text-xs text-neutral-500">Guaranteed fresh meals</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Info Card */}
              <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-green-100">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 mb-1">Need help?</p>
                    <p className="text-xs text-neutral-600">Contact us at <span className="text-green-600 font-medium">info.aharraa@gmail.com</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
