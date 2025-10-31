"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DUMMY_MEALS, DUMMY_PLANS, DUMMY_VENDORS } from "@/lib/data";
import { Meal, Plan, MealCategory, DietPreference, CartItem } from "@/lib/types"; // Removed Order, Added CartItem
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle2, Clock, MapPin, Utensils, ChevronRight, Sparkles, ShoppingBag, ArrowRight, Package, TrendingUp, X, Info, Flame, Droplet, Wheat } from "lucide-react";
import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store"; // Added useStore
import { useToast } from "@/components/ui/use-toast"; // Added useToast

export default function PricingPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { addToCart } = useStore(); // Get addToCart from store
  const { toast } = useToast(); // Get toast from useToast

  const [selectedCategory, setSelectedCategory] = useState<MealCategory>("Breakfast");
  const [selectedDietPreference, setSelectedDietPreference] = useState<DietPreference>("All");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  // const [orderConfirmed, setOrderConfirmed] = useState<Order | null>(null); // Removed orderConfirmed state
  const [mealDetailsOpen, setMealDetailsOpen] = useState(false);
  const [detailMeal, setDetailMeal] = useState<Meal | null>(null);

  const mealsByCategory = useMemo(() => {
    return DUMMY_MEALS.reduce((acc, meal) => {
      (acc[meal.category] = acc[meal.category] || []).push(meal);
      return acc;
    }, {} as Record<MealCategory, Meal[]>);
  }, []);

  const categories = Object.keys(mealsByCategory) as MealCategory[];

  const filteredMeals = useMemo(() => {
    let meals = mealsByCategory[selectedCategory] || [];
    if (selectedDietPreference !== "All") {
      meals = meals.filter(meal => meal.dietPreference === selectedDietPreference);
    }
    return meals;
  }, [selectedCategory, selectedDietPreference, mealsByCategory]);

  const handleMealClick = (meal: Meal) => {
    setDetailMeal(meal);
    setMealDetailsOpen(true);
  };

  const handleMealSelect = (meal: Meal) => {
    setSelectedMeal(meal);
    setSelectedPlan(null);
    setStartDate(undefined);
    setEndDate(undefined);
    // setOrderConfirmed(null); // Removed
    setMealDetailsOpen(false);
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setQuantity(1);
    setStartDate(undefined);
    setEndDate(undefined);
    // setOrderConfirmed(null); // Removed
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

  const handleAddToCart = () => { // Renamed from handleConfirmOrder
    if (!isAuthenticated) {
      router.push("/auth?returnUrl=/pricing"); // Redirect to pricing after login
      return;
    }

    if (selectedMeal && selectedPlan && quantity > 0 && startDate && endDate && user?.id) {
      const itemTotalPrice = selectedMeal.price * selectedPlan.durationDays * quantity;

      const newCartItem: CartItem = {
        id: `cart-${Date.now()}-${selectedMeal.id}`, // Unique ID for cart item
        userId: user.id,
        meal: selectedMeal,
        plan: selectedPlan,
        quantity: quantity,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        itemTotalPrice: itemTotalPrice,
        addedDate: new Date().toISOString(),
      };

      addToCart(newCartItem); // Add to cart using the store action

      toast({
        title: "Added to Cart!",
        description: `${quantity}x ${selectedMeal.name} (${selectedPlan.name}) added to your cart.`,
      });

      // Optionally reset selection after adding to cart
      resetSelection();
    } else {
      toast({
        title: "Cannot add to cart",
        description: "Please select a meal, a plan, a valid quantity, and valid dates.",
        variant: "destructive",
      });
    }
  };

  const resetSelection = () => { // Renamed from resetOrder
    setSelectedMeal(null);
    setSelectedPlan(null);
    setQuantity(1);
    setStartDate(undefined);
    setEndDate(undefined);
    // setOrderConfirmed(null); // Removed
  };

  // Removed the entire if (orderConfirmed) block

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
      <Header />
      
      {/* Hero Section */}
      <div className="py-16" style={{ backgroundColor: "#0B132B" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-black mb-4" style={{ color: "#EAFFF9" }}>
              Discover Your Perfect Meal
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "rgba(234, 255, 249, 0.8)" }}>
              Browse by category, explore nutritional details, and customize your subscription
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: "rgba(234, 255, 249, 0.1)" }}>
              <TrendingUp className="w-4 h-4" style={{ color: "#EAFFF9" }} />
              <span className="text-sm font-medium" style={{ color: "#EAFFF9" }}>10,000+ Meals Delivered</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: "rgba(234, 255, 249, 0.1)" }}>
              <Sparkles className="w-4 h-4" style={{ color: "#EAFFF9" }} />
              <span className="text-sm font-medium" style={{ color: "#EAFFF9" }}>Freshly Prepared Daily</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Meals */}
          <div className="lg:col-span-2 space-y-8">
            {/* Category Tabs */}
            <div>
              <h2 className="text-3xl font-black mb-6" style={{ color: "#0B132B" }}>
                Browse Our Menu
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-shrink-0",
                      selectedCategory === category 
                        ? "shadow-lg scale-105" 
                        : "hover:scale-105"
                    )}
                    style={{
                      backgroundColor: selectedCategory === category ? "#034C3C" : "#ffffff",
                      color: selectedCategory === category ? "#EAFFF9" : "#0B132B",
                      border: selectedCategory === category ? "none" : "2px solid #e5e7eb"
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Diet Preference Filter */}
              <div className="mb-6">
                <ToggleGroup 
                  type="single" 
                  value={selectedDietPreference} 
                  onValueChange={(value: DietPreference) => setSelectedDietPreference(value)}
                  className="flex justify-start gap-3"
                >
                  <ToggleGroupItem 
                    value="All" 
                    aria-label="Toggle all"
                    className={cn(
                      "px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-shrink-0",
                      selectedDietPreference === "All" 
                        ? "shadow-lg scale-105" 
                        : "hover:scale-105"
                    )}
                    style={{
                      backgroundColor: selectedDietPreference === "All" ? "#034C3C" : "#ffffff",
                      color: selectedDietPreference === "All" ? "#EAFFF9" : "#0B132B",
                      border: selectedDietPreference === "All" ? "none" : "2px solid #e5e7eb"
                    }}
                  >
                    All
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="Veg" 
                    aria-label="Toggle veg"
                    className={cn(
                      "px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-shrink-0",
                      selectedDietPreference === "Veg" 
                        ? "shadow-lg scale-105" 
                        : "hover:scale-105"
                    )}
                    style={{
                      backgroundColor: selectedDietPreference === "Veg" ? "#034C3C" : "#ffffff",
                      color: selectedDietPreference === "Veg" ? "#EAFFF9" : "#0B132B",
                      border: selectedDietPreference === "Veg" ? "none" : "2px solid #e5e7eb"
                    }}
                  >
                    Veg
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="Non-Veg" 
                    aria-label="Toggle non-veg"
                    className={cn(
                      "px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-shrink-0",
                      selectedDietPreference === "Non-Veg" 
                        ? "shadow-lg scale-105" 
                        : "hover:scale-105"
                    )}
                    style={{
                      backgroundColor: selectedDietPreference === "Non-Veg" ? "#034C3C" : "#ffffff",
                      color: selectedDietPreference === "Non-Veg" ? "#EAFFF9" : "#0B132B",
                      border: selectedDietPreference === "Non-Veg" ? "none" : "2px solid #e5e7eb"
                    }}
                  >
                    Non-Veg
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Meals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className={cn(
                      "rounded-2xl overflow-hidden cursor-pointer transition-all group relative",
                      selectedMeal?.id === meal.id 
                        ? "ring-4 ring-[#034C3C] shadow-xl scale-105" 
                        : "hover:shadow-lg hover:scale-102"
                    )}
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={meal.image} 
                        alt={meal.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div 
                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                      />
                      <div className="absolute top-3 right-3">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ backgroundColor: "#EAFFF9", color: "#034C3C" }}
                        >
                          {meal.dietPreference}
                        </span>
                      </div>
                      {selectedMeal?.id === meal.id && (
                        <div className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#034C3C" }}>
                          <CheckCircle2 className="w-5 h-5" style={{ color: "#EAFFF9" }} />
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-bold text-xl text-white mb-1">{meal.name}</h3>
                        <p className="text-sm text-white/80">{DUMMY_VENDORS.find(v => v.id === meal.vendorId)?.name}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm mb-4 line-clamp-2" style={{ color: "#6b7280" }}>
                        {meal.description}
                      </p>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-2xl font-black" style={{ color: "#034C3C" }}>
                          ₹{meal.price.toFixed(0)}
                          <span className="text-sm font-normal" style={{ color: "#6b7280" }}>/meal</span>
                        </span>
                        <div className="flex gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMealClick(meal);
                            }}
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                            style={{ borderColor: "#034C3C", color: "#034C3C" }}
                          >
                            <Info className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMealSelect(meal);
                            }}
                            size="sm"
                            className="rounded-lg font-bold"
                            style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}
                          >
                            {selectedMeal?.id === meal.id ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plans Section */}
            {selectedMeal && (
              <div>
                <h2 className="text-3xl font-black mb-6" style={{ color: "#0B132B" }}>
                  Choose Your Plan
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {DUMMY_PLANS.map((plan, idx) => (
                    <div
                      key={plan.id}
                      onClick={() => handlePlanSelect(plan)}
                      className={cn(
                        "rounded-2xl p-6 cursor-pointer transition-all relative",
                        selectedPlan?.id === plan.id 
                          ? "ring-4 ring-[#034C3C] shadow-xl scale-105" 
                          : "hover:shadow-md hover:scale-102",
                        idx === 1 && "sm:-mt-2 sm:mb-2"
                      )}
                      style={{
                        backgroundColor: idx === 1 ? "#034C3C" : "#ffffff",
                        color: idx === 1 ? "#EAFFF9" : "#0B132B"
                      }}
                    >
                      {idx === 1 && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black" style={{ backgroundColor: "#0B132B", color: "#EAFFF9" }}>
                          POPULAR
                        </div>
                      )}
                      {selectedPlan?.id === plan.id && (
                        <div className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: idx === 1 ? "#EAFFF9" : "#034C3C" }}>
                          <CheckCircle2 className="w-5 h-5" style={{ color: idx === 1 ? "#034C3C" : "#EAFFF9" }} />
                        </div>
                      )}
                      <div className="text-center">
                        <h4 className="font-black text-xl mb-2">{plan.name}</h4>
                        <div className="mb-3">
                          <span className="text-4xl font-black">
                            ₹{(selectedMeal.price * plan.durationDays).toFixed(0)}
                          </span>
                        </div>
                        <p className="text-sm font-medium opacity-80 mb-3">
                          {plan.durationDays} days delivery
                        </p>
                        <div className="pt-3 border-t" style={{ borderColor: idx === 1 ? "rgba(234, 255, 249, 0.3)" : "#e5e7eb" }}>
                          <p className="text-xs font-medium opacity-70">
                            ₹{selectedMeal.price.toFixed(0)} per day
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            {selectedPlan && (
              <div>
                <h2 className="text-3xl font-black mb-6" style={{ color: "#0B132B" }}>
                  Select Quantity
                </h2>
                <Card style={{ border: "none", backgroundColor: "#ffffff" }}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        disabled={quantity <= 1}
                        className="w-12 h-12 rounded-full text-2xl font-bold"
                        style={{ borderColor: "#034C3C", color: "#034C3C" }}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                        className="w-24 text-center text-2xl font-bold h-14 rounded-xl"
                        style={{ border: "3px solid #034C3C", color: "#0B132B" }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="w-12 h-12 rounded-full text-2xl font-bold"
                        style={{ borderColor: "#034C3C", color: "#034C3C" }}
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-center text-sm mt-4" style={{ color: "#6b7280" }}>
                      You are ordering {quantity} meal plan(s) for {selectedPlan.durationDays} days.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Date Selection */}
            {selectedPlan && (
              <div>
                <h2 className="text-3xl font-black mb-6" style={{ color: "#0B132B" }}>
                  Select Start Date
                </h2>
                <Card style={{ border: "none", backgroundColor: "#ffffff" }}>
                  <CardContent className="p-6">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-center text-center font-bold h-14 text-base rounded-xl transition-all",
                            !startDate && "text-muted-foreground"
                          )}
                          style={{
                            border: startDate ? "3px solid #034C3C" : "2px dashed #e5e7eb",
                            backgroundColor: startDate ? "#EAFFF9" : "#ffffff",
                            color: startDate ? "#0B132B" : "#9ca3af"
                          }}
                        >
                          <CalendarIcon className="mr-3 h-5 w-5" />
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
                      <div className="mt-6 p-5 rounded-xl" style={{ backgroundColor: "#034C3C" }}>
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="w-5 h-5" style={{ color: "#EAFFF9" }} />
                          <p className="font-bold" style={{ color: "#EAFFF9" }}>Daily Deliveries</p>
                        </div>
                        <p className="text-sm" style={{ color: "rgba(234, 255, 249, 0.9)" }}>
                          From <span className="font-bold">{format(startDate, "MMM d")}</span> to <span className="font-bold">{format(endDate, "MMM d, yyyy")}</span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sticky Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="overflow-hidden shadow-xl" style={{ border: "none", backgroundColor: "#0B132B" }}>
                <CardHeader>
                  <CardTitle className="text-2xl font-black flex items-center gap-2" style={{ color: "#EAFFF9" }}>
                    <ShoppingBag className="w-6 h-6" />
                    Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {!selectedMeal ? (
                    <div className="text-center py-12" style={{ color: "rgba(234, 255, 249, 0.5)" }}>
                      <Utensils className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-sm font-medium">Select a meal to begin</p>
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
                              {selectedPlan.durationDays} days • ₹{selectedMeal.price.toFixed(0)}/day
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Quantity in Order Summary */}
                      {selectedPlan && quantity > 0 && (
                        <div>
                          <p className="text-xs uppercase font-bold mb-3 tracking-wide" style={{ color: "rgba(234, 255, 249, 0.6)" }}>Quantity</p>
                          <div className="p-4 rounded-xl" style={{ backgroundColor: "rgba(234, 255, 249, 0.1)" }}>
                            <p className="font-bold text-lg mb-1" style={{ color: "#EAFFF9" }}>{quantity} meal plan(s)</p>
                            <p className="text-xs" style={{ color: "rgba(234, 255, 249, 0.7)" }}>
                              Total meals: {quantity * selectedPlan.durationDays}
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
                                ₹{(selectedMeal.price * selectedPlan.durationDays * quantity).toFixed(0)}
                              </span>
                            </div>

                            <Button
                              className="w-full py-6 text-base font-black rounded-xl transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl"
                              style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}
                              onClick={handleAddToCart}
                              disabled={!startDate || !endDate || quantity < 1}
                            >
                              {!startDate || !endDate || quantity < 1 ? "Select date and quantity to continue" : (
                                <span className="flex items-center justify-center gap-2">
                                  Add to Cart
                                  <ShoppingBag className="w-5 h-5" />
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

      {/* Meal Details Modal */}
      {mealDetailsOpen && detailMeal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(11, 19, 43, 0.8)" }}
          onClick={() => setMealDetailsOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-80">
              <img 
                src={detailMeal.image} 
                alt={detailMeal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={() => setMealDetailsOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
              >
                <X className="w-5 h-5" style={{ color: "#0B132B" }} />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-black text-3xl text-white">{detailMeal.name}</h3>
                  <span className="text-2xl font-black px-4 py-2 rounded-xl" style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}>
                    ₹{detailMeal.price}
                  </span>
                </div>
                <p className="text-white/90 text-sm">
                  by {DUMMY_VENDORS.find(v => v.id === detailMeal.vendorId)?.name}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-bold text-lg mb-2" style={{ color: "#0B132B" }}>Description</h4>
                <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                  {detailMeal.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: "#EAFFF9" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils className="w-5 h-5" style={{ color: "#034C3C" }} />
                    <span className="text-xs font-bold uppercase" style={{ color: "#034C3C" }}>Category</span>
                  </div>
                  <p className="font-bold" style={{ color: "#0B132B" }}>{detailMeal.category}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: "#EAFFF9" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" style={{ color: "#034C3C" }} />
                    <span className="text-xs font-bold uppercase" style={{ color: "#034C3C" }}>Diet</span>
                  </div>
                  <p className="font-bold" style={{ color: "#0B132B" }}>{detailMeal.dietPreference}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2" style={{ color: "#0B132B" }}>
                  <Flame className="w-5 h-5" style={{ color: "#034C3C" }} />
                  Nutritional Information
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "#f8f9fa" }}>
                    <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: "#034C3C" }}>
                      <Flame className="w-5 h-5" style={{ color: "#EAFFF9" }} />
                    </div>
                    <p className="text-2xl font-black mb-1" style={{ color: "#0B132B" }}>420</p>
                    <p className="text-xs font-medium" style={{ color: "#6b7280" }}>Calories</p>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "#f8f9fa" }}>
                    <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: "#034C3C" }}>
                      <Package className="w-5 h-5" style={{ color: "#EAFFF9" }} />
                    </div>
                    <p className="text-2xl font-black mb-1" style={{ color: "#0B132B" }}>25g</p>
                    <p className="text-xs font-medium" style={{ color: "#6b7280" }}>Protein</p>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "#f8f9fa" }}>
                    <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: "#034C3C" }}>
                      <Wheat className="w-5 h-5" style={{ color: "#EAFFF9" }} />
                    </div>
                    <p className="text-2xl font-black mb-1" style={{ color: "#0B132B" }}>45g</p>
                    <p className="text-xs font-medium" style={{ color: "#6b7280" }}>Carbs</p>
                  </div>
                  <div className="p-4 rounded-xl text-center" style={{ backgroundColor: "#f8f9fa" }}>
                    <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: "#034C3C" }}>
                      <Droplet className="w-5 h-5" style={{ color: "#EAFFF9" }} />
                    </div>
                    <p className="text-2xl font-black mb-1" style={{ color: "#0B132B" }}>15g</p>
                    <p className="text-xs font-medium" style={{ color: "#6b7280" }}>Fat</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-3" style={{ color: "#0B132B" }}>
                  Serving Size & Quantity
                </h4>
                <div className="p-4 rounded-xl" style={{ backgroundColor: "#EAFFF9" }}>
                  <p className="text-sm mb-1" style={{ color: "#034C3C" }}>
                    <span className="font-bold">1 serving</span> (approximately 350-400g)
                  </p>
                  <p className="text-xs" style={{ color: "#034C3C" }}>
                    Perfectly portioned for one person
                  </p>
                </div>
              </div>

              <Button
                onClick={() => {
                  handleMealSelect(detailMeal);
                  setMealDetailsOpen(false);
                }}
                className="w-full py-6 text-base font-black rounded-xl transition-all hover:scale-105 shadow-lg"
                style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}
              >
                {selectedMeal?.id === detailMeal.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Selected
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Select This Meal
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
