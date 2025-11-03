"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { useAuth } from "@/app/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PersonDetails } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast" // Import useToast

import { CartEmptyState } from "@/components/cart-empty-state"
import { CartItemCard } from "@/components/cart-item-card"
import { CartSummaryCard } from "@/components/cart-summary-card"
import { EditPersonDetailsDialog } from "@/components/edit-person-details-dialog"

export default function CartPage() {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()
  const cart = useStore((state) => state.cart)
  const removeFromCart = useStore((state) => state.removeFromCart)
  const updateCartItemQuantityInStore = useStore((state) => state.updateCartItemQuantity) // Rename to avoid conflict
  const updateCartItemPersonDetails = useStore((state) => state.updateCartItemPersonDetails)
  const { toast } = useToast() // Initialize useToast

  const [isEditingPersonDetails, setIsEditingPersonDetails] = useState(false)
  const [currentEditingCartItemId, setCurrentEditingCartItemId] = useState<string | null>(null)
  const [editingPersonDetails, setEditingPersonDetails] = useState<PersonDetails[]>([])
  const [pendingNewQuantity, setPendingNewQuantity] = useState<number | null>(null) // New state for pending quantity

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

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth?returnUrl=/cart")
    }
  }, [isAuthenticated, loading, router])

  const handleEditPersonDetails = (itemId: string, details: PersonDetails[] | undefined, quantityToEdit: number) => {
    setCurrentEditingCartItemId(itemId);
    
    // Initialize editingPersonDetails with existing details or empty objects up to quantityToEdit
    const initialDetails = Array.from({ length: quantityToEdit }, (_, i) => {
      return details?.[i] || { name: "", phoneNumber: "" };
    });
    setEditingPersonDetails(initialDetails);
    setIsEditingPersonDetails(true);
  };

  const handleSavePersonDetails = () => {
    if (currentEditingCartItemId) {
      // Validation is handled within EditPersonDetailsDialog before onSave is called
      updateCartItemPersonDetails(currentEditingCartItemId, editingPersonDetails);

      // If there's a pending new quantity, update the quantity in the store
      if (pendingNewQuantity !== null && currentEditingCartItemId) {
        updateCartItemQuantityInStore(currentEditingCartItemId, pendingNewQuantity);
        setPendingNewQuantity(null); // Reset pending quantity
      }

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

  // New handler for updating quantity
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    const currentItem = cart?.items.find(item => item.id === itemId);
    if (!currentItem) return;

    if (newQuantity > currentItem.quantity) { // Quantity is increasing
      setPendingNewQuantity(newQuantity);
      handleEditPersonDetails(itemId, currentItem.personDetails, newQuantity);
      return; // Quantity will be updated after person details are saved
    } else if (newQuantity < currentItem.quantity) { // Quantity is decreasing
      // If quantity is decreasing, we can directly update it.
      // We might need to truncate person details if they exceed the new quantity.
      const updatedDetails = currentItem.personDetails?.slice(0, newQuantity) || [];
      updateCartItemPersonDetails(itemId, updatedDetails);
      updateCartItemQuantityInStore(itemId, newQuantity);
    } else { // Quantity is staying the same (shouldn't happen via UI, but for completeness)
      updateCartItemQuantityInStore(itemId, newQuantity);
    }
  };


  if (loading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#606C38", borderTopColor: "transparent" }}>
            </div>
            <p className="text-lg font-medium" style={{ color: "#283618" }}>
              Loading your cart...
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const userCartItems = cart?.items.filter(item => item.userId === user.id) || []
  const totalItems = userCartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = userCartItems.reduce((sum, item) => sum + item.itemTotalPrice, 0)

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
              {userCartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity} // Use the new handler
                  onRemoveItem={removeFromCart}
                  onEditPersonDetails={handleEditPersonDetails}
                />
              ))}
            </div>

            {/* Cart Summary - Mobile: Full width, Desktop: 1 column */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-6">
                <CartSummaryCard
                  totalItems={totalItems}
                  totalPrice={totalPrice}
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
      />
    </main>
  )
}
