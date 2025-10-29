'use client';

import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

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
}

interface CartSummaryProps {
  summary: OrderSummary;
}

export default function CheckoutSummary({ summary }: CartSummaryProps) {
  const router = useRouter();

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Left Column - Plan & Menu Details */}
      <div className="space-y-6 lg:col-span-8">
        {/* Plan Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Plan Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Plan Name</p>
              <p className="font-medium">{summary.plan.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{summary.plan.duration}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date Range</p>
              <p className="font-medium">
                {summary.plan.dates.start} to {summary.plan.dates.end}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price per Day</p>
              <p className="font-medium">₹{summary.plan.pricePerDay.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        {/* Vendor Details */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Vendor Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Kitchen Name</p>
              <p className="font-medium">{summary.vendor.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{summary.vendor.location}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact</p>
              <p className="font-medium">{summary.vendor.contactInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rating</p>
              <p className="font-medium">★ {summary.vendor.rating}</p>
            </div>
          </div>
        </Card>

        {/* Menu Selection */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Menu Selection</h2>
          <ScrollArea className="h-[400px] pr-4">
            {Object.entries(summary.weeklyMenu).map(([day, data]) => (
              <Fragment key={day}>
                <div className="mb-6">
                  <h3 className="font-medium mb-2">{data.date}</h3>
                  <div className="space-y-4">
                    {['breakfast', 'lunch', 'dinner'].map((slot) => (
                      <div key={slot} className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm font-medium capitalize mb-2">{slot}</p>
                        <div className="space-y-2">
                          {(data.meals[slot as keyof typeof data.meals] ?? []).map((meal) => (
                            <div key={meal.id} className="flex items-center">
                              <span className="text-sm">{meal.name}</span>
                              {meal.isVegetarian && (
                                <span className="ml-2 inline-block w-4 h-4 bg-green-500 rounded-full" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator className="my-4" />
              </Fragment>
            ))}
          </ScrollArea>
        </Card>

        {/* Accompaniments */}
        {summary.accompaniments.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Accompaniments</h2>
            <div className="space-y-4">
              {summary.accompaniments.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <span className="font-medium">₹{item.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Right Column - Order Summary */}
      <div className="lg:col-span-4">
        <Card className="p-6 sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {/* Plan Total */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan Total</span>
              <span className="font-medium">₹{summary.pricing.planTotal.toLocaleString()}</span>
            </div>

            {/* Accompaniments Total */}
            {summary.pricing.accompanimentsTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accompaniments</span>
                <span className="font-medium">₹{summary.pricing.accompanimentsTotal.toLocaleString()}</span>
              </div>
            )}

            {/* GST */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST (5%)</span>
              <span className="font-medium">
                ₹{Math.round((summary.pricing.planTotal + summary.pricing.accompanimentsTotal) * 0.05).toLocaleString()}
              </span>
            </div>

            <Separator />

            {/* Grand Total */}
            <div className="flex justify-between">
              <span className="font-medium">Grand Total</span>
              <span className="font-bold text-lg">₹{summary.pricing.grandTotal.toLocaleString()}</span>
            </div>

            {/* Checkout Button */}
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
