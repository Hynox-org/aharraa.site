"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/app/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PersonDetails } from "@/lib/types"
import LottieAnimation from "@/components/lottie-animation"
import ItayCheffAnimation from "@/public/lottie/ItayCheff.json"
import { useToast } from "@/components/ui/use-toast" // Import useToast

import { CartEmptyState } from "@/components/cart-empty-state"
import { CartItemCard } from "@/components/cart-item-card"
import { CartSummaryCard } from "@/components/cart-summary-card"
import { EditPersonDetailsDialog } from "@/components/edit-person-details-dialog"
import { getCartItems ,removeFromCart , updateCartItemQuantity ,updateCartItemPersonDetails} from "@/lib/api"
import { User } from "@/lib/types"

export default function CartPage() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast() // Initialize useToast

  const [isEditingPersonDetails, setIsEditingPersonDetails] = useState(false)
  const [currentEditingCartItemId, setCurrentEditingCartItemId] = useState<string | null>(null)
  const [editingPersonDetails, setEditingPersonDetails] = useState<PersonDetails[]>([])
  const [pendingNewQuantity, setPendingNewQuantity] = useState<number | null>(null)
  const [fetchedCart, setFetchedCart] = useState<any>(null)
  const [isCartLoading, setIsCartLoading] = useState(true) // New state for cart loading
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false) // New loading state
  const [isRemovingItem, setIsRemovingItem] = useState(false) // New loading state
  const [isSavingPersonDetails, setIsSavingPersonDetails] = useState(false) // New loading state

  // Helper function for person details validation
  const arePersonDetailsValidForQuantity = (details: PersonDetails[] | undefined, requiredQuantity: number) => {
    if (requiredQuantity < 1) return true;
    if (!details || details.length < requiredQuantity) return false;

    return details.slice(0, requiredQuantity).every(person => {
      const nameValid = person?.name?.trim().length >= 2;
      const phoneValid = /^[6-9]\d{9}$/.test(person?.phoneNumber || "");
      return nameValid && phoneValid;
    });
  };
  const User = user;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth?returnUrl=/cart")
    }
  }, [isAuthenticated, loading, router])

  useEffect(() => {
    if (currentEditingCartItemId !== null) {
      setIsEditingPersonDetails(true);
    }
  }, [currentEditingCartItemId]);

  useEffect(() => {
    if (!loading && isAuthenticated && user?.id) {
      const token = localStorage.getItem("aharraa-u-token");
      console.log(token);
      if (!token) {
        console.error("No auth token found — user must log in first");
        router.push("/auth?returnUrl=/cart")
        setIsCartLoading(false); // Ensure loading state is false if redirecting
        return;
      }
      const fetchCart = async () => {
        setIsCartLoading(true); // Start loading
        try {
          const cartData = await getCartItems(user.id!, token!); // Use ! to assert user.id is not undefined
          console.log("Fetched cart items:", cartData);
          setFetchedCart(cartData);
        } catch (error) {
          console.error("Failed to fetch cart items:", error);
          toast({ title: "Error", description: "Failed to fetch cart items." }); // Add toast for error
        } finally {
          setIsCartLoading(false); // End loading
        }
      };
      fetchCart();
    } else if (!loading && !isAuthenticated) {
      setIsCartLoading(false); // If not authenticated, cart is not loading
    }
  }, [isAuthenticated, loading, user?.id, toast, router]); // Add toast to dependency array

  const handleEditPersonDetails = (itemId: string, details: PersonDetails[] | undefined, quantityToEdit: number) => {
    console.log("setting currentEditingCartItemId to", itemId);
    setCurrentEditingCartItemId(itemId);
    
    // Initialize editingPersonDetails with existing details or empty objects up to quantityToEdit
    const initialDetails = Array.from({ length: quantityToEdit }, (_, i) => {
      return details?.[i] || { name: "", phoneNumber: "" };
    });
    setEditingPersonDetails(initialDetails);
    setIsEditingPersonDetails(true);
  };

  const handleSavePersonDetails = async () => {
    if (isSavingPersonDetails) return; // Prevent multiple clicks
    setIsSavingPersonDetails(true);

    console.log("handleSavePersonalDetails called")
    const currentItem = currentEditingCartItemId;
    if (currentEditingCartItemId) {
      // Validation is handled within EditPersonDetailsDialog before onSave is called
      const token = localStorage.getItem("aharraa-u-token");
      if (!token || !user?.id) {
        router.push("/auth?returnUrl=/cart");
        setIsSavingPersonDetails(false);
        return;
      }
      console.log("verified token and user");
      try {
        // Update person details via API
        console.log("Calling updateCartItemPersonDetails API");
        const updatedCart = await updateCartItemPersonDetails(user.id, currentEditingCartItemId, editingPersonDetails, token);
        console.log("API call success, updating local state");
        setFetchedCart(updatedCart);
        toast({ title: "Person details updated successfully!" });

        // If there's a pending new quantity, update the quantity in the store
        if (pendingNewQuantity !== null) {
          console.log("Updating quantity after person details update");
          const updatedCartWithQuantity = await updateCartItemQuantity(user.id, currentEditingCartItemId, pendingNewQuantity, token);
          setFetchedCart(updatedCartWithQuantity);
          toast({ title: "Quantity updated successfully!" });

          setPendingNewQuantity(null);
        }
        console.log("Closing edit dialog");
        setIsEditingPersonDetails(false);
        setCurrentEditingCartItemId(null);
        setEditingPersonDetails([]);
      } catch (error) {
        console.error("Failed to update person details:", error);
        toast({ title: "Error", description: "Failed to save person details." });
      } finally {
        setIsSavingPersonDetails(false);
      }
    } else {
      console.error("currentEditingCartItemId is null");
      setIsSavingPersonDetails(false);
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

  // New handler for updating quantity
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (isUpdatingQuantity) return; // Prevent multiple clicks
    setIsUpdatingQuantity(true);

    const currentItem = (fetchedCart?.items || []).find((item: any) => item._id === itemId);
    if (!currentItem || !user?.id) {
      setIsUpdatingQuantity(false);
      return;
    }
    const token = localStorage.getItem("aharraa-u-token");
    if (!token) {
      router.push("/auth?returnUrl=/cart");
      setIsUpdatingQuantity(false);
      return;
    }

    try {
      if (newQuantity > currentItem.quantity) {
        setPendingNewQuantity(newQuantity);
        handleEditPersonDetails(itemId, currentItem.personDetails, newQuantity);
        // Note: isUpdatingQuantity will be set to false after person details are saved.
        return;
      } else if (newQuantity < currentItem.quantity) {
        const updatedDetails = currentItem.personDetails?.slice(0, newQuantity) || [];
        await updateCartItemPersonDetails(user.id, itemId, updatedDetails, token);
        toast({ title: "Person details updated!" });
      }

      const updatedCart = await updateCartItemQuantity(user.id, itemId, newQuantity, token);
      setFetchedCart(updatedCart);
      toast({ title: "Quantity updated successfully!" });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast({ title: "Failed to update quantity", variant: "destructive" });
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (isRemovingItem) return; // Prevent multiple clicks
    setIsRemovingItem(true);

    const token = localStorage.getItem("aharraa-u-token");
    if (!token) {
      router.push("/auth?returnUrl=/cart");
      setIsRemovingItem(false);
      return;
    }

    if (!user?.id) {
      setIsRemovingItem(false);
      return;
    }

    try {
      const updatedCart = await removeFromCart(user.id, itemId, token!);
      if (updatedCart) {
        setFetchedCart(updatedCart);
        toast({ title: "Item removed successfully!" });
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast({ title: "Error", description: "Failed to remove item from cart." });
    } finally {
      setIsRemovingItem(false);
    }
  };

  // Combine authentication loading and cart specific loading
  if (loading || isCartLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FEFAE0]">
        <LottieAnimation animationData={ItayCheffAnimation} style={{ width: 200, height: 200 }} />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null // Should already be redirected by useEffect
  }
  console.log("User ID:", user?.id);
  console.log("Fetched Cart:", fetchedCart);
  const userCartItems = (fetchedCart?.items || []).filter((item: any) => item.user === user.id) || []
  console.log("User Cart Items:", userCartItems);
  const totalItems = userCartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
  const totalPrice = userCartItems.reduce((sum: number, item: any) => sum + item.itemTotalPrice, 0)

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: "#283618" }}>
            Your Shopping Cart
          </h1>
          {userCartItems.length > 0 && (
            <p className="text-sm sm:text-base" style={{ color: "#606C38" }}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          )}
        </div>

        {userCartItems.length === 0 ? (
          <CartEmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items - Mobile: Full width, Desktop: 2 columns */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {userCartItems.map((item: any) => (
                <CartItemCard
                  key={item._id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={() => handleRemoveItem(item._id!)}
                  onEditPersonDetails={handleEditPersonDetails}
                  isUpdatingQuantity={isUpdatingQuantity}
                  isRemovingItem={isRemovingItem}
                />
              ))}
            </div>

            {/* Cart Summary - Mobile: Full width, Desktop: 1 column */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6">
                <CartSummaryCard
                  totalItems={totalItems}
                  totalPrice={totalPrice}
                  isUpdatingCart={isUpdatingQuantity || isRemovingItem || isSavingPersonDetails}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />

      <EditPersonDetailsDialog
        isOpen={isEditingPersonDetails}
        onOpenChange={setIsEditingPersonDetails}
        editingPersonDetails={editingPersonDetails}
        onPersonDetailChange={handlePersonDetailChange}
        onSave={handleSavePersonDetails}
        currentEditingCartItemId={currentEditingCartItemId}
        isSaving={isSavingPersonDetails}
      />
    </main>
  )
}
