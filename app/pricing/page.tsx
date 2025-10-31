"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DUMMY_MEALS, DUMMY_PLANS, DUMMY_VENDORS } from "@/lib/data";
import { Meal, Plan, Vendor, Order, MealCategory } from "@/lib/types";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle2, Clock, MapPin, Utensils, ChevronRight, Sparkles, ShoppingBag, ArrowRight, Package, TrendingUp } from "lucide-react";
import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [orderConfirmed, setOrderConfirmed] = useState<Order | null>(null);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const mealsByCategory = useMemo(() => {
    return DUMMY_MEALS.reduce((acc, meal) => {
      (acc[meal.category] = acc[meal.category] || []).push(meal);
      return acc;
    }, {} as Record<MealCategory, Meal[]>);
  }, []);

  const handleMealSelect = (meal: Meal) => {
    setSelectedMeal(meal);
    setSelectedPlan(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setOrderConfirmed(null);
    setCurrentStep(2);
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setStartDate(undefined);
    setEndDate(undefined);
    setOrderConfirmed(null);
    setCurrentStep(3);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && selectedPlan) {
      setStartDate(date);
      const calculatedEndDate = addDays(date, selectedPlan.durationDays - 1);
      setEndDate(calculatedEndDate);
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  const handleConfirmOrder = () => {
    if (!isAuthenticated) {
      router.push("/auth?returnUrl=/checkout");
      return;
    }

    if (selectedMeal && selectedPlan && startDate && endDate && user?.id) {
      const vendor = DUMMY_VENDORS.find(v => v.id === selectedMeal.vendorId);
      if (!vendor) {
        console.error("Vendor not found for selected meal.");
        return;
      }

      const dailyMealPrice = selectedMeal.price;
      const calculatedTotalPrice = dailyMealPrice * selectedPlan.durationDays;

      const newOrder: Order = {
        id: `order-${Date.now()}`,
        userId: user.id,
        selectedMeal: selectedMeal,
        vendor: vendor,
        plan: { ...selectedPlan, price: calculatedTotalPrice }, // Update plan price in order
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        totalPrice: calculatedTotalPrice,
        orderDate: new Date().toISOString(),
      };
      setOrderConfirmed(newOrder);
      console.log("Order Confirmed:", newOrder);
    } else {
      alert("Please select a meal, a plan, and valid dates.");
    }
  };

  const resetOrder = () => {
    setSelectedMeal(null);
    setSelectedPlan(null);
    setStartDate(undefined);
    setEndDate(undefined);
    setOrderConfirmed(null);
    setCurrentStep(1);
  };

  if (orderConfirmed) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#EAFFF9" }}>
        <Header />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Success Animation */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 animate-bounce" style={{ backgroundColor: "#034C3C" }}>
              <CheckCircle2 className="w-12 h-12" style={{ color: "#EAFFF9" }} />
            </div>
            <h1 className="text-5xl font-bold mb-2" style={{ color: "#0B132B" }}>
              Order Confirmed!
            </h1>
            <p className="text-xl" style={{ color: "#034C3C" }}>
              Thank you, {user?.name || "valued customer"}! Your meal plan is ready.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-8 overflow-hidden shadow-2xl" style={{ border: "none", backgroundColor: "#ffffff" }}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b-2" style={{ borderColor: "#EAFFF9" }}>
                <h2 className="text-3xl font-bold flex items-center gap-3" style={{ color: "#0B132B" }}>
                  <Package className="w-8 h-8" style={{ color: "#034C3C" }} />
                  Order Summary
                </h2>
                <span className="px-4 py-2 rounded-full text-sm font-bold" style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}>
                  ORDER #{orderConfirmed.id.split('-')[1]}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <p className="text-xs uppercase font-bold mb-3 tracking-wide" style={{ color: "#034C3C" }}>Your Meal</p>
                    <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: "#EAFFF9" }}>
                      <img 
                        src={orderConfirmed.selectedMeal.image} 
                        alt={orderConfirmed.selectedMeal.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      <div>
                        <p className="font-bold text-lg" style={{ color: "#0B132B" }}>{orderConfirmed.selectedMeal.name}</p>
                        <p className="text-sm" style={{ color: "#034C3C" }}>{orderConfirmed.vendor.name}</p>
                        <p className="text-xs mt-1" style={{ color: "#034C3C" }}>₹{orderConfirmed.selectedMeal.price} per meal</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase font-bold mb-3 tracking-wide" style={{ color: "#034C3C" }}>Subscription Plan</p>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#EAFFF9" }}>
                      <p className="font-bold text-lg mb-1" style={{ color: "#0B132B" }}>{orderConfirmed.plan.name}</p>
                      <p className="text-sm" style={{ color: "#034C3C" }}>{orderConfirmed.plan.durationDays} days of delivery</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase font-bold mb-3 tracking-wide" style={{ color: "#034C3C" }}>Delivery Schedule</p>
                  <div className="p-4 rounded-xl space-y-3" style={{ backgroundColor: "#EAFFF9" }}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" style={{ color: "#034C3C" }} />
                      <div>
                        <p className="text-xs font-medium" style={{ color: "#034C3C" }}>Start Date</p>
                        <p className="font-semibold" style={{ color: "#0B132B" }}>{format(new Date(orderConfirmed.startDate), "PP")}</p>
                      </div>
                    </div>
                    <div className="h-8 w-0.5 ml-2" style={{ backgroundColor: "#034C3C" }} />
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" style={{ color: "#034C3C" }} />
                      <div>
                        <p className="text-xs font-medium" style={{ color: "#034C3C" }}>End Date</p>
                        <p className="font-semibold" style={{ color: "#0B132B" }}>{format(new Date(orderConfirmed.endDate), "PP")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: "#034C3C" }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm" style={{ color: "#EAFFF9" }}>Subtotal</span>
                      <span className="font-medium" style={{ color: "#EAFFF9" }}>₹{orderConfirmed.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: "rgba(234, 255, 249, 0.3)" }}>
                      <span className="text-xl font-bold" style={{ color: "#EAFFF9" }}>Total</span>
                      <span className="text-2xl font-bold" style={{ color: "#EAFFF9" }}>₹{orderConfirmed.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center space-y-6">
            <div className="p-6 rounded-xl" style={{ backgroundColor: "rgba(3, 76, 60, 0.1)" }}>
              <p className="text-sm mb-2" style={{ color: "#034C3C" }}>
                <strong>Confirmation Email Sent!</strong>
              </p>
              <p className="text-sm" style={{ color: "#034C3C" }}>
                Check {user?.email || "your registered email"} for order details and tracking information.
              </p>
            </div>
            <Button
              onClick={resetOrder}
              className="px-10 py-6 text-lg font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
              style={{ backgroundColor: "#0B132B", color: "#EAFFF9" }}
            >
              Start New Order
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      <Header />
      
      {/* Hero Section */}
      <div className="py-20" style={{ backgroundColor: "#0B132B" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-black mb-6" style={{ color: "#EAFFF9" }}>
            Simple Meal Plans,<br />Extraordinary Taste
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8" style={{ color: "rgba(234, 255, 249, 0.8)" }}>
            Select your meal, choose duration, pick a date. Fresh, homemade food delivered daily.
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full" style={{ backgroundColor: "#034C3C" }}>
            <TrendingUp className="w-5 h-5" style={{ color: "#EAFFF9" }} />
            <span className="text-sm font-bold" style={{ color: "#EAFFF9" }}>OVER 10,000 MEALS DELIVERED</span>
          </div>

          {/* Progress Steps */}
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              {[
                { num: 1, label: "Choose Meal", icon: Utensils },
                { num: 2, label: "Select Plan", icon: Clock },
                { num: 3, label: "Pick Date", icon: CalendarIcon },
              ].map((step, idx) => (
                <div key={step.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div 
                      className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all",
                        currentStep >= step.num ? "scale-110" : "scale-100"
                      )}
                      style={{ 
                        backgroundColor: currentStep >= step.num ? "#EAFFF9" : "rgba(234, 255, 249, 0.2)",
                        border: `2px solid ${currentStep >= step.num ? "#EAFFF9" : "rgba(234, 255, 249, 0.3)"}`
                      }}
                    >
                      {currentStep > step.num ? (
                        <CheckCircle2 className="w-7 h-7" style={{ color: "#034C3C" }} />
                      ) : (
                        <step.icon className="w-6 h-6" style={{ color: currentStep >= step.num ? "#034C3C" : "#EAFFF9" }} />
                      )}
                    </div>
                    <span 
                      className="text-sm font-semibold text-center"
                      style={{ color: currentStep >= step.num ? "#EAFFF9" : "rgba(234, 255, 249, 0.6)" }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div 
                      className="h-0.5 flex-1 mx-2 transition-all"
                      style={{ 
                        backgroundColor: currentStep > step.num ? "#EAFFF9" : "rgba(234, 255, 249, 0.2)"
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 mb-8">
            {[
              { num: 1, label: "Meal" },
              { num: 2, label: "Plan" },
              { num: 3, label: "Date" },
            ].map((step, idx) => (
              <div key={step.num} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                      currentStep >= step.num ? "scale-110" : ""
                    )}
                    style={{ 
                      backgroundColor: currentStep >= step.num ? "#034C3C" : "#e5e7eb",
                      color: currentStep >= step.num ? "#EAFFF9" : "#9ca3af"
                    }}
                  >
                    {currentStep > step.num ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                  </div>
                  <span className="text-sm font-medium hidden sm:inline" style={{ color: currentStep >= step.num ? "#0B132B" : "#9ca3af" }}>
                    {step.label}
                  </span>
                </div>
                {idx < 2 && (
                  <div className="w-12 h-0.5 mx-2" style={{ backgroundColor: currentStep > step.num ? "#034C3C" : "#e5e7eb" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Step 1: Meal Selection */}
            <div>
              <div className="flex items-baseline gap-3 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-black" style={{ backgroundColor: currentStep === 1 ? "#034C3C" : "#e5e7eb", color: currentStep === 1 ? "#EAFFF9" : "#9ca3af" }}>
                  1
                </div>
                <h2 className="text-3xl font-black" style={{ color: "#0B132B" }}>Choose Your Meal</h2>
                {selectedMeal && <CheckCircle2 className="w-6 h-6 ml-auto" style={{ color: "#034C3C" }} />}
              </div>

            <Card className="overflow-hidden shadow-lg" style={{ border: "none" }}>
              <CardContent className="p-6">
                {Object.entries(mealsByCategory).map(([category, meals]) => (
                  <div key={category} className="mb-10 last:mb-0">
                    <h3 className="text-sm uppercase font-bold mb-4 tracking-wider px-3 py-2 rounded-lg inline-block" style={{ color: "#0B132B", backgroundColor: "#EAFFF9" }}>
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {meals.map((meal) => (
                        <div
                          key={meal.id}
                          className={cn(
                            "relative rounded-2xl overflow-hidden cursor-pointer transition-all group",
                            selectedMeal?.id === meal.id ? "ring-4 ring-offset-2 shadow-xl ring-[#034C3C]" : "hover:shadow-md"
                          )}
                          style={{
                            backgroundColor: "#ffffff"
                          }}
                          onClick={() => handleMealSelect(meal)}
                        >
                          <div className="flex items-center gap-4 p-4">
                            <div className="relative flex-shrink-0">
                              <img 
                                src={meal.image} 
                                alt={meal.name} 
                                className="w-28 h-28 object-cover rounded-xl transition-transform group-hover:scale-105"
                              />
                              {selectedMeal?.id === meal.id && (
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "#034C3C" }}>
                                  <CheckCircle2 className="w-5 h-5" style={{ color: "#EAFFF9" }} />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <h4 className="font-bold text-xl" style={{ color: "#0B132B" }}>{meal.name}</h4>
                                <span className="text-2xl font-black flex-shrink-0" style={{ color: "#034C3C" }}>₹{meal.price.toFixed(0)}</span>
                              </div>
                              <p className="text-sm mb-3 line-clamp-2" style={{ color: "#6b7280" }}>{meal.description}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: "#EAFFF9", color: "#034C3C" }}>
                                  {meal.dietPreference}
                                </span>
                                <span className="text-xs" style={{ color: "#9ca3af" }}>
                                  by {DUMMY_VENDORS.find(v => v.id === meal.vendorId)?.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            </div>

            {/* Step 2: Plan Selection */}
            {selectedMeal && (
              <div>
                <div className="flex items-baseline gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-black" style={{ backgroundColor: currentStep >= 2 ? "#034C3C" : "#e5e7eb", color: currentStep >= 2 ? "#EAFFF9" : "#9ca3af" }}>
                    2
                  </div>
                  <h2 className="text-3xl font-black" style={{ color: "#0B132B" }}>Select Your Plan</h2>
                  {selectedPlan && <CheckCircle2 className="w-6 h-6 ml-auto" style={{ color: "#034C3C" }} />}
                </div>

              <Card className="overflow-hidden shadow-lg" style={{ border: "none" }}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {DUMMY_PLANS.map((plan, idx) => (
                      <div
                        key={plan.id}
                        className={cn(
                          "relative rounded-2xl p-6 cursor-pointer transition-all text-center",
                          selectedPlan?.id === plan.id ? "ring-4 ring-offset-2 shadow-xl scale-105 ring-[#034C3C]" : "hover:shadow-md",
                          idx === 1 && "sm:-mt-3 sm:mb-3"
                        )}
                        style={{
                          backgroundColor: idx === 1 ? "#034C3C" : "#ffffff",
                          color: idx === 1 ? "#EAFFF9" : "#0B132B"
                        }}
                        onClick={() => handlePlanSelect(plan)}
                      >
                        {idx === 1 && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black" style={{ backgroundColor: "#0B132B", color: "#EAFFF9" }}>
                            MOST POPULAR
                          </div>
                        )}
                        {selectedPlan?.id === plan.id && (
                          <div className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: idx === 1 ? "#EAFFF9" : "#034C3C" }}>
                            <CheckCircle2 className="w-5 h-5" style={{ color: idx === 1 ? "#034C3C" : "#EAFFF9" }} />
                          </div>
                        )}
                        <h4 className="font-black text-2xl mb-3" style={{ color: idx === 1 ? "#EAFFF9" : "#0B132B" }}>{plan.name}</h4>
                        <div className="mb-4">
                          {selectedMeal && (
                            <span className="text-5xl font-black" style={{ color: idx === 1 ? "#EAFFF9" : "#034C3C" }}>
                              ₹{(selectedMeal.price * plan.durationDays).toFixed(0)}
                            </span>
                          )}
                          {!selectedMeal && (
                            <span className="text-5xl font-black" style={{ color: idx === 1 ? "#EAFFF9" : "#034C3C" }}>
                              ₹{plan.price} {/* Fallback if no meal selected, though ideally a meal is selected first */}
                            </span>
                          )}
                        </div>
                        <p className="text-sm mb-4 font-medium" style={{ color: idx === 1 ? "rgba(234, 255, 249, 0.8)" : "#6b7280" }}>
                          {plan.durationDays} days delivery
                        </p>
                        <div className="pt-4 border-t" style={{ borderColor: idx === 1 ? "rgba(234, 255, 249, 0.3)" : "#e5e7eb" }}>
                          <p className="text-xs font-medium" style={{ color: idx === 1 ? "rgba(234, 255, 249, 0.7)" : "#9ca3af" }}>
                            {selectedMeal ? `₹${selectedMeal.price.toFixed(0)} per day` : `Select a meal to see daily price`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </div>
            )}

            {/* Step 3: Date Selection */}
            {selectedPlan && (
              <div>
                <div className="flex items-baseline gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-black" style={{ backgroundColor: currentStep >= 3 ? "#034C3C" : "#e5e7eb", color: currentStep >= 3 ? "#EAFFF9" : "#9ca3af" }}>
                    3
                  </div>
                  <h2 className="text-3xl font-black" style={{ color: "#0B132B" }}>Pick Your Start Date</h2>
                  {startDate && <CheckCircle2 className="w-6 h-6 ml-auto" style={{ color: "#034C3C" }} />}
                </div>

              <Card className="overflow-hidden shadow-lg" style={{ border: "none" }}>
                <CardContent className="p-6">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-center text-center font-bold h-16 text-lg rounded-xl transition-all",
                          !startDate && "text-muted-foreground"
                        )}
                        style={{
                          border: startDate ? "3px solid #034C3C" : "2px dashed #e5e7eb",
                          backgroundColor: startDate ? "#EAFFF9" : "#ffffff",
                          color: startDate ? "#0B132B" : "#9ca3af"
                        }}
                      >
                        <CalendarIcon className="mr-3 h-6 w-6" />
                        {startDate ? format(startDate, "EEEE, MMMM do, yyyy") : "Click to select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" sideOffset={5}>
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={handleDateSelect}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {startDate && endDate && (
                    <div className="mt-6 p-6 rounded-2xl" style={{ backgroundColor: "#034C3C" }}>
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="w-6 h-6" style={{ color: "#EAFFF9" }} />
                        <p className="font-bold text-lg" style={{ color: "#EAFFF9" }}>Daily Deliveries</p>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(234, 255, 249, 0.9)" }}>
                        Your fresh meals will arrive every day from <span className="font-bold">{format(startDate, "MMM d")}</span> to <span className="font-bold">{format(endDate, "MMM d, yyyy")}</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* Order Summary */}
              <Card className="overflow-hidden shadow-2xl" style={{ border: "none", backgroundColor: "#0B132B" }}>
                <CardHeader className="pb-0">
                  <CardTitle className="text-2xl font-black flex items-center gap-2" style={{ color: "#EAFFF9" }}>
                    <ShoppingBag className="w-6 h-6" />
                    Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  {!selectedMeal ? (
                    <div className="text-center py-12" style={{ color: "rgba(234, 255, 249, 0.5)" }}>
                      <Utensils className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-sm font-medium">Start by selecting a meal</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs uppercase font-bold mb-3 tracking-wide" style={{ color: "rgba(234, 255, 249, 0.6)" }}>Meal</p>
                        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "rgba(234, 255, 249, 0.1)" }}>
                          <img 
                            src={selectedMeal.image} 
                            alt={selectedMeal.name}
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm truncate" style={{ color: "#EAFFF9" }}>{selectedMeal.name}</p>
                            <p className="text-xs" style={{ color: "rgba(234, 255, 249, 0.7)" }}>
                              ₹{selectedMeal.price}/meal
                            </p>
                          </div>
                        </div>
                      </div>

                      {selectedPlan && (
                        <div>
                          <p className="text-xs uppercase font-bold mb-3 tracking-wide" style={{ color: "rgba(234, 255, 249, 0.6)" }}>Plan</p>
                          <div className="p-4 rounded-xl" style={{ backgroundColor: "rgba(234, 255, 249, 0.1)" }}>
                          <p className="font-bold text-lg mb-1" style={{ color: "#EAFFF9" }}>{selectedPlan.name}</p>
                          <p className="text-xs" style={{ color: "rgba(234, 255, 249, 0.7)" }}>
                            {selectedPlan.durationDays} days • {selectedMeal ? `₹${selectedMeal.price.toFixed(0)}/day` : 'Select meal for daily price'}
                          </p>
                          </div>
                        </div>
                      )}

                      {startDate && endDate && (
                        <div>
                          <p className="text-xs uppercase font-bold mb-3 tracking-wide" style={{ color: "rgba(234, 255, 249, 0.6)" }}>Dates</p>
                          <div className="p-4 rounded-xl space-y-2" style={{ backgroundColor: "rgba(234, 255, 249, 0.1)" }}>
                            <div className="flex justify-between text-xs">
                              <span style={{ color: "rgba(234, 255, 249, 0.7)" }}>Start</span>
                              <span className="font-semibold" style={{ color: "#EAFFF9" }}>{format(startDate, "MMM d")}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span style={{ color: "rgba(234, 255, 249, 0.7)" }}>End</span>
                              <span className="font-semibold" style={{ color: "#EAFFF9" }}>{format(endDate, "MMM d")}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedPlan && (
                        <>
                          <div className="pt-5 mt-5 border-t" style={{ borderColor: "rgba(234, 255, 249, 0.2)" }}>
                            <div className="flex justify-between items-baseline mb-4">
                              <span className="text-sm font-medium" style={{ color: "rgba(234, 255, 249, 0.8)" }}>Total Amount</span>
                              <span className="text-3xl font-black" style={{ color: "#EAFFF9" }}>
                                ₹{selectedMeal && selectedPlan ? (selectedMeal.price * selectedPlan.durationDays).toFixed(0) : "0"}
                              </span>
                            </div>

                            <Button
                              className="w-full py-6 text-base font-black rounded-xl transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl"
                              style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}
                              onClick={handleConfirmOrder}
                              disabled={!startDate || !endDate}
                            >
                              {!startDate || !endDate ? "Complete all steps" : (
                                <span className="flex items-center justify-center gap-2">
                                  Confirm & Pay
                                  <ArrowRight className="w-5 h-5" />
                                </span>
                              )}
                            </Button>
                          </div>

                          <div className="space-y-2 pt-4">
                            <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(234, 255, 249, 0.6)" }}>
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              <span>Freshly prepared daily</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(234, 255, 249, 0.6)" }}>
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              <span>Cancel anytime</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(234, 255, 249, 0.6)" }}>
                              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                              <span>Money-back guarantee</span>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
