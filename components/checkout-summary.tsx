"use client";

import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MenuSelectionTimeline } from "./menu-selection-timeline";
import { DeliveryAddress } from "@/lib/store";

export interface OrderSummary {
  plan: {
    name: string;
    duration: string;
    daysCount: number;
    pricePerDay: number;
    totalPrice: number;
    dates: {
      start: string;
      end: string;
    };
  };
  vendor: {
    id: string;
    name: string;
    location: string;
    rating: number;
    contactInfo: {
      phone: string;
      email: string;
    };
  };
  dietPreference: "veg" | "non-veg";
  weeklyMenu: {
    [key: string]: {
      date: string;
      meals: {
        breakfast: Array<{ id: string; name: string; isVegetarian: boolean }>;
        lunch: Array<{ id: string; name: string; isVegetarian: boolean }>;
        dinner: Array<{ id: string; name: string; isVegetarian: boolean }>;
      };
    };
  };
  accompaniments: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  pricing: {
    planTotal: number;
    accompanimentsTotal: number;
    grandTotal: number;
  };
  deliveryAddresses: {
    breakfast: DeliveryAddress | null;
    lunch: DeliveryAddress | null;
    dinner: DeliveryAddress | null;
  };
}

interface CartSummaryProps {
  summary: OrderSummary;
  onProceedToPayment: () => void;
  deliveryAddresses: {
    breakfast: DeliveryAddress | null;
    lunch: DeliveryAddress | null;
    dinner: DeliveryAddress | null;
  };
}

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

  const shouldShowDeliveryAddresses =
    (hasBreakfastMeals && deliveryAddresses.breakfast) ||
    (hasLunchMeals && deliveryAddresses.lunch) ||
    (hasDinnerMeals && deliveryAddresses.dinner);

  const isBreakfastAddressMissing = hasBreakfastMeals && !deliveryAddresses.breakfast?.formattedAddress;
  const isLunchAddressMissing = hasLunchMeals && !deliveryAddresses.lunch?.formattedAddress;
  const isDinnerAddressMissing = hasDinnerMeals && !deliveryAddresses.dinner?.formattedAddress;

  const areAllRequiredAddressesFilled = !(isBreakfastAddressMissing || isLunchAddressMissing || isDinnerAddressMissing);

  const handleProceedToPayment = () => {
    if (!areAllRequiredAddressesFilled) {
      onProceedToPayment(); // Open modal
    } else {
      // Proceed to actual payment page
      console.log("Proceeding to payment with summary:", summary);
      // router.push('/payment'); // Uncomment this line when actual payment page is ready
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 px-6 py-8 bg-gray-50 min-h-screen">
      {/* Left Column - Plan & Vendor */}
      <div className="space-y-8 lg:col-span-8">
        {/* Plan Details */}
        <Card className="p-6 rounded-lg border border-gray-300 shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Plan Details
          </h2>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Plan Name
              </p>
              <p className="font-medium">{summary.plan.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Duration
              </p>
              <p className="font-medium">{summary.plan.duration}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Date Range
              </p>
              <p className="font-medium">
                {summary.plan.dates.start} to {summary.plan.dates.end}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Price per Day
              </p>
              <p className="font-medium">
                ₹{summary.plan.pricePerDay.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Vendor Details */}
        <Card className="p-6 rounded-lg border border-gray-300 shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Vendor Details
          </h2>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Kitchen Name
              </p>
              <p className="font-medium">{summary.vendor.name}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Rating
              </p>
              <p className="font-medium">★ {summary.vendor.rating}</p>
            </div>
          </div>
        </Card>

        {/* Menu Selection - Contained */}
        <Card className="p-6 rounded-lg border border-gray-300 bg-white max-h-[360px] overflow-auto">
          <MenuSelectionTimeline weeklyMenu={summary.weeklyMenu} />
        </Card>

        {/* Delivery Addresses */}
        {shouldShowDeliveryAddresses && (
          <Card className="p-6 rounded-lg border border-gray-300 shadow-sm bg-white">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Delivery Addresses
            </h2>
            <div className="space-y-3 text-gray-700">
              {hasBreakfastMeals && summary.deliveryAddresses.breakfast?.formattedAddress && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Breakfast</p>
                  <p className="font-medium">{summary.deliveryAddresses.breakfast.formattedAddress}</p>
                </div>
              )}
              {hasLunchMeals && summary.deliveryAddresses.lunch?.formattedAddress && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Lunch</p>
                  <p className="font-medium">{summary.deliveryAddresses.lunch.formattedAddress}</p>
                </div>
              )}
              {hasDinnerMeals && summary.deliveryAddresses.dinner?.formattedAddress && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Dinner</p>
                  <p className="font-medium">{summary.deliveryAddresses.dinner.formattedAddress}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Accompaniments */}
        {summary.accompaniments.length > 0 && (
          <Card className="p-6 rounded-lg border border-gray-300 shadow-sm bg-white">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Accompaniments
            </h2>
            <div className="space-y-3">
              {summary.accompaniments.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-gray-700 font-medium"
                >
                  <span>{item.name}</span>
                  <span>₹{item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Right Column - Order Summary */}
      <div className="lg:col-span-4">
        <Card className="p-6 rounded-lg border border-gray-300 shadow-md bg-white sticky top-6">
          <h2 className="text-lg font-semibold mb-5 text-gray-900">
            Order Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-600">
              <span>Plan Total</span>
              <span className="font-semibold">
                ₹{summary.pricing.planTotal.toLocaleString()}
              </span>
            </div>
            {summary.pricing.accompanimentsTotal > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Accompaniments</span>
                <span className="font-semibold">
                  ₹{summary.pricing.accompanimentsTotal.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>GST (5%)</span>
              <span className="font-semibold">
                ₹
                {Math.round(
                  (summary.pricing.planTotal +
                    summary.pricing.accompanimentsTotal) *
                    0.05
                ).toLocaleString()}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg text-indigo-700">
              <span>Grand Total</span>
              <span>₹{summary.pricing.grandTotal.toLocaleString()}</span>
            </div>
            <Button
              className="w-full mt-6"
              size="lg"
              onClick={handleProceedToPayment}
              aria-label="Proceed to checkout"
            >
              Proceed to Payment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
