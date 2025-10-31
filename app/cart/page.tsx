"use client";

import { Header } from "@/components/header";
import { useStore } from "@/lib/store";
import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ShoppingCart, Trash2, MinusCircle, PlusCircle, ArrowRight, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PersonDetails } from "@/lib/types";

export default function CartPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateCartItemQuantity = useStore((state) => state.updateCartItemQuantity);
  const getCartTotalPrice = useStore((state) => state.getCartTotalPrice);
  const getCartTotalItems = useStore((state) => state.getCartTotalItems);
  const updateCartItemPersonDetails = useStore((state) => state.updateCartItemPersonDetails); // New store action

  const [isEditingPersonDetails, setIsEditingPersonDetails] = useState(false);
  const [currentEditingCartItemId, setCurrentEditingCartItemId] = useState<string | null>(null);
  const [editingPersonDetails, setEditingPersonDetails] = useState<PersonDetails[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth?returnUrl=/cart");
    }
  }, [isAuthenticated, loading, router]);

  const handleEditPersonDetails = (itemId: string, details: PersonDetails[] | undefined) => {
    setCurrentEditingCartItemId(itemId);
    setEditingPersonDetails(details ? [...details] : []);
    setIsEditingPersonDetails(true);
  };

  const handleSavePersonDetails = () => {
    if (currentEditingCartItemId) {
      updateCartItemPersonDetails(currentEditingCartItemId, editingPersonDetails);
      setIsEditingPersonDetails(false);
      setCurrentEditingCartItemId(null);
      setEditingPersonDetails([]);
    }
  };

  const handlePersonDetailChange = (index: number, field: keyof PersonDetails, value: string) => {
    const updatedDetails = [...editingPersonDetails];
    if (!updatedDetails[index]) {
      updatedDetails[index] = { name: "", phoneNumber: "" };
    }
    updatedDetails[index][field] = value;
    setEditingPersonDetails(updatedDetails);
  };

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
                <div key={item.id}> {/* Added a div to act as a single parent element */}
                  <Card className="flex items-center p-4 shadow-md" style={{ border: "none", backgroundColor: "#ffffff" }}>
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
                  {item.personDetails && item.personDetails.length > 0 && ( // Display if person details exist
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: "#e5e7eb" }}>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-md font-bold" style={{ color: "#0B132B" }}>Person Details</h3>
                        {item.quantity > 1 && ( // Only show edit button if quantity > 1
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPersonDetails(item.id, item.personDetails)}
                            className="h-8 px-3 rounded-lg"
                            style={{ borderColor: "#034C3C", color: "#034C3C" }}
                          >
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2">
                        {item.personDetails.map((person: PersonDetails, idx: number) => (
                          <div key={idx} className="flex justify-between text-sm" style={{ color: "#0B132B" }}>
                            <span>{person.name || `Person ${idx + 1}`}</span>
                            <span>{person.phoneNumber}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
                </div>
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

      {/* Edit Person Details Dialog */}
      <Dialog open={isEditingPersonDetails} onOpenChange={setIsEditingPersonDetails}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Person Details</DialogTitle>
            <DialogDescription>
              Make changes to the names and phone numbers for each person.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {editingPersonDetails.map((person, index) => (
              <div key={index} className="space-y-2">
                <h4 className="text-md font-semibold">Person {index + 1}</h4>
                <Input
                  id={`name-${index}`}
                  placeholder="Name"
                  value={person.name}
                  onChange={(e) => handlePersonDetailChange(index, "name", e.target.value)}
                  className="col-span-3"
                />
                <Input
                  id={`phone-${index}`}
                  placeholder="Phone Number"
                  value={person.phoneNumber}
                  onChange={(e) => handlePersonDetailChange(index, "phoneNumber", e.target.value)}
                  className="col-span-3"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingPersonDetails(false)}>Cancel</Button>
            <Button onClick={handleSavePersonDetails}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
