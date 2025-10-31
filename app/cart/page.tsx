"use client";

import { Header } from "@/components/header";
import { useStore } from "@/lib/store";
import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ShoppingCart, Trash2, MinusCircle, PlusCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateCartItemQuantity = useStore((state) => state.updateCartItemQuantity);
  const getCartTotalPrice = useStore((state) => state.getCartTotalPrice);
  const getCartTotalItems = useStore((state) => state.getCartTotalItems);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth?returnUrl=/cart");
    }
  }, [isAuthenticated, loading, router]);

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
  const totalItems = userCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = userCartItems.reduce((sum, item) => sum + item.itemTotalPrice, 0);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-black mb-8" style={{ color: "#0B132B" }}>
          Your Shopping Cart
        </h1>

        {userCartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-24 h-24 mx-auto mb-6 opacity-30" style={{ color: "#0B132B" }} />
            <p className="text-xl font-medium" style={{ color: "#0B132B" }}>
              Your cart is empty.
            </p>
            <Button asChild className="mt-8 px-8 py-4 text-lg font-bold rounded-xl" style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}>
              <Link href="/pricing">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {userCartItems.map((item) => (
                <Card key={item.id} className="flex items-center p-4 shadow-md" style={{ border: "none", backgroundColor: "#ffffff" }}>
                  <Image
                    src={item.meal.image}
                    alt={item.meal.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="ml-4 flex-1">
                    <h2 className="text-lg font-bold" style={{ color: "#0B132B" }}>{item.meal.name}</h2>
                    <p className="text-sm text-neutral-600">{item.plan.name} ({item.plan.durationDays} days)</p>
                    <p className="text-sm text-neutral-600">
                      {format(new Date(item.startDate), "MMM d")} - {format(new Date(item.endDate), "MMM d, yyyy")}
                    </p>
                    <p className="text-md font-semibold mt-1" style={{ color: "#034C3C" }}>
                      ₹{item.itemTotalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-full"
                      style={{ borderColor: "#034C3C", color: "#034C3C" }}
                    >
                      <MinusCircle className="w-4 h-4" />
                    </Button>
                    <span className="font-bold text-lg" style={{ color: "#0B132B" }}>{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full"
                      style={{ borderColor: "#034C3C", color: "#034C3C" }}
                    >
                      <PlusCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-6 shadow-xl" style={{ border: "none", backgroundColor: "#0B132B" }}>
                <CardHeader>
                  <CardTitle className="text-2xl font-black flex items-center gap-2" style={{ color: "#EAFFF9" }}>
                    <ShoppingCart className="w-6 h-6" />
                    Cart Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm" style={{ color: "rgba(234, 255, 249, 0.8)" }}>
                    <span>Total Items</span>
                    <span className="font-semibold" style={{ color: "#EAFFF9" }}>{totalItems}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: "rgba(234, 255, 249, 0.2)" }}>
                    <span className="text-xl font-bold" style={{ color: "#EAFFF9" }}>Order Total</span>
                    <span className="text-2xl font-bold" style={{ color: "#EAFFF9" }}>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <Button asChild className="w-full py-6 text-base font-black rounded-xl transition-all hover:scale-105 shadow-lg" style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}>
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
