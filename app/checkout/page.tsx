"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { useStore } from "@/lib/store";
import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ShoppingCart, MapPin, ArrowRight, AlertCircle, Locate } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { DeliveryAddress, CheckoutData, CheckoutItem, MealCategory, CreateOrderPayload, Vendor } from "@/lib/types";
import { DUMMY_VENDORS } from "@/lib/data";
import { createOrder, sendOrderConfirmationEmail } from "@/lib/api";
import { load } from "@cashfreepayments/cashfree-js";

export default function CheckoutPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const setCheckoutData = useStore((state) => state.setCheckoutData);
  const clearCart = useStore((state) => state.clearCart);

  const [deliveryAddresses, setDeliveryAddresses] = useState<
    Partial<Record<MealCategory, DeliveryAddress>>
  >({});

  const initializeSDK = async () => {
  const cashfree = await load({ mode: "sandbox" }); // Use "production" for live environment
  return cashfree;
};

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth?returnUrl=/checkout");
    }
  }, [isAuthenticated, loading, router]);

  // Initialize delivery addresses based on cart items
  useEffect(() => {
    initializeSDK()
    const userCartItems = cart?.items.filter(item => item.userId === user?.id) || [];
    if (userCartItems.length > 0) {
      const initialAddresses: Partial<Record<MealCategory, DeliveryAddress>> = {};
      const uniqueCategories = Array.from(
        new Set(userCartItems.map((item) => item.meal.category))
      );

      uniqueCategories.forEach((category) => {
        initialAddresses[category] = {
          street: "",
          city: "Coimbatore", // Pre-fill city
          zip: "",
        };
      });
      setDeliveryAddresses(initialAddresses);
    }
  }, [cart?.items, user?.id]); // Depend on cart items and user ID to re-initialize

  if (loading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p>Loading user data...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Redirect handled by useEffect
  }

  const userCartItems = cart?.items.filter(item => item.userId === user.id) || [];
  const totalPrice = userCartItems.reduce((sum, item) => sum + item.itemTotalPrice, 0);
  const uniqueMealCategories = Array.from(new Set(userCartItems.map(item => item.meal.category)));

  if (userCartItems.length === 0) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <AlertCircle className="w-24 h-24 mx-auto mb-6 opacity-30 text-red-500" />
          <h1 className="text-3xl font-black mb-4" style={{ color: "#0B132B" }}>
            Your cart is empty!
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Button asChild className="mt-8 px-8 py-4 text-lg font-bold rounded-xl" style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}>
            <Link href="/pricing">Start Shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  const handleAddressChange = (category: MealCategory, field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddresses((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      } as DeliveryAddress,
    }));
  };

  const handleGeolocation = (category: MealCategory) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Simulate reverse geocoding for Coimbatore
          // In a real app, you'd use a geocoding API here (e.g., Google Maps Geocoding API)
          console.log(`Fetching location for ${category}: Lat ${latitude}, Lng ${longitude}`);
          
          // Dummy data for Coimbatore address
          const dummyStreet = "123 Main Road";
          const dummyZip = "641001"; // A common Coimbatore zip code

          setDeliveryAddresses((prev) => ({
            ...prev,
            [category]: {
              ...prev[category],
              street: dummyStreet,
              city: "Coimbatore", // Ensure city remains Coimbatore
              zip: dummyZip,
            } as DeliveryAddress,
          }));
          toast.success(`Location fetched for ${category}: ${dummyStreet}, Coimbatore ${dummyZip}`);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error(`Could not fetch location for ${category}. Please enter manually. Error: ${error.message}`);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  const handlePayment = async (paymentSessionId: string) => {
  const cashfree = await initializeSDK();
  const checkoutOptions = {
    paymentSessionId: paymentSessionId, // Replace with the actual session ID from the backend
    redirectTarget: "_self", // Options: "_self", "_blank", "_modal", or a DOM element
  };
  cashfree.checkout(checkoutOptions).then((result:any) => {
    if (result.error) {
      console.error("Payment error:", result.error);
    } else if (result.paymentDetails) {
      console.log("Payment completed:", result.paymentDetails);
    }
  });
};

  const handleProceedToPayment = async () => {
    if (!user?.id) {
      toast.error("User not authenticated.");
      return;
    }

    // Validate all required delivery addresses
    for (const category of uniqueMealCategories) {
      const address = deliveryAddresses[category];
      if (!address || !address.street || !address.zip || address.city !== "Coimbatore") {
        toast.error(`Please fill in all delivery details for ${category} and ensure city is Coimbatore.`);
        return;
      }
      // Add more specific zip code validation for Coimbatore here if needed
    }

    const checkoutItems: CheckoutItem[] = userCartItems.map((cartItem) => {
      const vendor = DUMMY_VENDORS.find((v: Vendor) => v.id === cartItem.meal.vendorId);
      return {
        id: cartItem.id,
        meal: cartItem.meal,
        plan: cartItem.plan,
        quantity: cartItem.quantity,
        personDetails: cartItem.personDetails, // Include person details
        startDate: cartItem.startDate,
        endDate: cartItem.endDate,
        itemTotalPrice: cartItem.itemTotalPrice,
        vendor: vendor || { id: "unknown", name: "Unknown Vendor" }, // Fallback vendor
      };
    });

    const finalizedCheckoutData: CheckoutData = {
      id: `checkout-${Date.now()}-${user.id}`,
      userId: user.id,
      items: checkoutItems,
      deliveryAddresses: deliveryAddresses as Record<MealCategory, DeliveryAddress>, // Cast to correct type
      totalPrice: totalPrice,
      checkoutDate: new Date().toISOString(),
    };

    console.log("Finalized Checkout Data:", finalizedCheckoutData);
    setCheckoutData(finalizedCheckoutData); // Save to store

    // Prepare payload for backend API
    const orderItems = userCartItems.map(item => ({
      productId: item.meal.id,
      quantity: item.quantity,
      price: item.itemTotalPrice,
    }));

    // Assuming a single shipping address for simplicity, or you can derive it per category
    // For now, taking the first available address. You might need a more robust logic here.
    const firstCategory = uniqueMealCategories[0];
    const shippingAddress = deliveryAddresses[firstCategory];

    if (!shippingAddress) {
      toast.error("Shipping address not found.");
      return;
    }

    const orderPayload: CreateOrderPayload = {
      userId: user.id,
      items: orderItems,
      shippingAddress: shippingAddress,
      billingAddress: shippingAddress, // Assuming billing is same as shipping for now
      deliveryAddresses: finalizedCheckoutData.deliveryAddresses, // Include all delivery addresses
      paymentMethod: "UPI", // Hardcoded for now, can be dynamic
      totalAmount: totalPrice,
      currency: "INR", // Hardcoded for now
    };

    const token = localStorage.getItem("aharraa-u-token"); // Retrieve token from local storage

    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      router.push("/auth?returnUrl=/checkout");
      return;
    }

    try {
      const order = await createOrder(orderPayload, token);
      console.log(order.paymentSessionId)
      await handlePayment(order.paymentSessionId);
      // toast.success(`Order created successfully! Order ID: ${order._id}`);
      // clearCart(); // Clear the cart after successful order creation

      // Send confirmation email
      // if (user?.email) {
      //   try {
      //     await sendOrderConfirmationEmail(order.id, user.email, token);
      //     toast.success("Order confirmation email sent!");
      //   } catch (emailError: any) {
      //     console.error("Error sending confirmation email:", emailError);
      //     toast.error(`Failed to send confirmation email: ${emailError.message || "Unknown error"}`);
      //   }
      // } else {
      //   console.warn("User email not available, skipping confirmation email.");
      // }

      // router.push(`/order-status/${order._id}`); // Navigate to order confirmation page
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(`Failed to create order: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black mb-8" style={{ color: "#0B132B" }}>
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Delivery Details */}
          <div className="lg:col-span-2 space-y-6">
            {uniqueMealCategories.map((category) => (
              <Card key={category} className="shadow-md" style={{ border: "none", backgroundColor: "#ffffff" }}>
                <CardHeader>
                  <CardTitle className="text-2xl font-black flex items-center gap-2" style={{ color: "#0B132B" }}>
                    <MapPin className="w-6 h-6" />
                    Delivery Details for {category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`street-${category}`} className="text-sm font-medium" style={{ color: "#0B132B" }}>Street Address</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`street-${category}`}
                          value={deliveryAddresses[category]?.street || ""}
                          onChange={(e) => handleAddressChange(category, "street", e.target.value)}
                          placeholder="123 Main St"
                          className="mt-1 rounded-lg flex-1"
                          style={{ borderColor: "#034C3C", color: "#0B132B" }}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleGeolocation(category)}
                          className="mt-1 rounded-lg"
                          style={{ borderColor: "#034C3C", color: "#034C3C" }}
                          title="Use current location"
                        >
                          <Locate className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`city-${category}`} className="text-sm font-medium" style={{ color: "#0B132B" }}>City</Label>
                        <Input
                          id={`city-${category}`}
                          value="Coimbatore"
                          disabled
                          className="mt-1 rounded-lg"
                          style={{ borderColor: "#034C3C", color: "#0B132B", backgroundColor: "#f0f0f0" }}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`zip-${category}`} className="text-sm font-medium" style={{ color: "#0B132B" }}>Zip Code</Label>
                        <Input
                          id={`zip-${category}`}
                          value={deliveryAddresses[category]?.zip || ""}
                          onChange={(e) => handleAddressChange(category, "zip", e.target.value)}
                          placeholder="12345"
                          className="mt-1 rounded-lg"
                          style={{ borderColor: "#034C3C", color: "#0B132B" }}
                        />
                        <p className="text-xs text-neutral-500 mt-1">
                          Only Coimbatore zip codes are accepted. (e.g., 641001)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Cart Items */}
            <Card className="shadow-md" style={{ border: "none", backgroundColor: "#ffffff" }}>
              <CardHeader>
                <CardTitle className="text-2xl font-black flex items-center gap-2" style={{ color: "#0B132B" }}>
                  <ShoppingCart className="w-6 h-6" />
                  Your Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userCartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg" style={{ backgroundColor: "#EAFFF9" }}>
                    <Image
                      src={item.meal.image}
                      alt={item.meal.name}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-lg" style={{ color: "#0B132B" }}>{item.meal.name}</p>
                      <p className="text-sm text-neutral-600">{item.plan.name} ({item.plan.durationDays} days)</p>
                      <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                      {item.quantity > 1 && item.personDetails && item.personDetails.length > 0 && (
                        <div className="mt-2 text-xs text-neutral-700 space-y-1">
                          <p className="font-semibold">Person Details:</p>
                          {item.personDetails.map((person, idx) => (
                            <div key={idx} className="flex justify-between">
                              <span>{person.name || `Person ${idx + 1}`}</span>
                              <span>{person.phoneNumber}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-lg" style={{ color: "#034C3C" }}>₹{item.itemTotalPrice.toFixed(2)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 shadow-xl" style={{ border: "none", backgroundColor: "#0B132B" }}>
              <CardHeader>
                <CardTitle className="text-2xl font-black flex items-center gap-2" style={{ color: "#EAFFF9" }}>
                  <ShoppingCart className="w-6 h-6" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm" style={{ color: "rgba(234, 255, 249, 0.8)" }}>
                  <span>Subtotal ({userCartItems.length} items)</span>
                  <span className="font-semibold" style={{ color: "#EAFFF9" }}>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm" style={{ color: "rgba(234, 255, 249, 0.8)" }}>
                  <span>Delivery Fee</span>
                  <span className="font-semibold" style={{ color: "#EAFFF9" }}>₹0.00</span> {/* Placeholder */}
                </div>
                <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: "rgba(234, 255, 249, 0.2)" }}>
                  <span className="text-xl font-bold" style={{ color: "#EAFFF9" }}>Total</span>
                  <span className="text-2xl font-bold" style={{ color: "#EAFFF9" }}>₹{totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full py-6 text-base font-black rounded-xl transition-all hover:scale-105 shadow-lg"
                  style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
