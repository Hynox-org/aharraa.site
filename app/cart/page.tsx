"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/app/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback, useMemo } from "react" // Added useCallback, useMemo
import { PersonDetails, CartItem, PopulatedCartItem, MenuWithPopulatedMeals, Plan, MealCategory, Cart } from "@/lib/types" // Added Cart
import LottieAnimation from "@/components/lottie-animation"
import ItayCheffAnimation from "@/public/lottie/ItayCheff.json"
import { useToast } from "@/components/ui/use-toast"

import { CartEmptyState } from "@/components/cart-empty-state"
import { CartItemCard } from "@/components/cart-item-card"
import { CartSummaryCard } from "@/components/cart-summary-card"
import { EditPersonDetailsDialog } from "@/components/edit-person-details-dialog"
import { getCartItems, removeFromCart, updateCartItemQuantity, updateCartItemPersonDetails, addToCartApi, getPlans, getAllMenus } from "@/lib/api" // Added addToCartApi, getPlans, getAllMenus
import { getLocalCartItems, addLocalCartItem, updateLocalCartItem, removeLocalCartItem, clearLocalCart, LocalCartItem } from "@/lib/localCart" // Import local cart functions

export default function CartPage() {
  const { isAuthenticated, loading: authLoading, user } = useAuth() // Renamed loading to authLoading
  const router = useRouter()
  const { toast } = useToast()

  const [isEditingPersonDetails, setIsEditingPersonDetails] = useState(false)
  const [currentEditingCartItemId, setCurrentEditingCartItemId] = useState<string | null>(null)
  const [editingPersonDetails, setEditingPersonDetails] = useState<PersonDetails[]>([])
  const [pendingNewQuantity, setPendingNewQuantity] = useState<number | null>(null)
  
  const [dbCart, setDbCart] = useState<PopulatedCartItem[] | null>(null) // Changed from fetchedCart to dbCart
  const [localCartItems, setLocalCartItems] = useState<LocalCartItem[]>([]); // New state for local cart
  const [isCartLoading, setIsCartLoading] = useState(true)
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false)
  const [isRemovingItem, setIsRemovingItem] = useState(false)
  const [isSavingPersonDetails, setIsSavingPersonDetails] = useState(false)
  const [allMenus, setAllMenus] = useState<MenuWithPopulatedMeals[]>([]); // To provide to localCart updates
  const [allPlans, setAllPlans] = useState<Plan[]>([]); // To provide to localCart updates

  const currentUser = user; // Renamed to avoid conflict with interface

  // Combined cart items for rendering
  const combinedCartItems = useMemo(() => {
    // Convert LocalCartItem to PopulatedCartItem like structure for consistent display
    const transformedLocalItems: PopulatedCartItem[] = localCartItems.map(item => ({
      _id: item._id,
      user: currentUser?.id || '', // User ID will be empty for local items
      menu: item.menu as MenuWithPopulatedMeals, // Assume menu is populated in localCartItem
      plan: item.plan as Plan, // Assume plan is populated in localCartItem
      quantity: item.quantity,
      personDetails: item.personDetails,
      startDate: item.startDate,
      endDate: item.endDate,
      itemTotalPrice: item.itemTotalPrice,
      selectedMealTimes: item.selectedMealTimes,
      addedDate: item.addedDate,
      vendor: item.menu.vendor, // Use item.menu.vendor as vendorId is removed from LocalCartItem
    }));
    
    // Filter out potential duplicate items if merging happened (backend cart is source of truth)
    const dbItems = dbCart ? dbCart : [];
    const uniqueCombinedItems = dbItems; // Backend cart is the source of truth if logged in

    if (!isAuthenticated) {
      return transformedLocalItems;
    }
    return uniqueCombinedItems;
  }, [localCartItems, dbCart, isAuthenticated, currentUser?.id]);


  // Effect to fetch initial data (menus, plans) and local cart
  useEffect(() => {
    async function fetchInitialData() {
      setIsCartLoading(true);
      try {
        const [fetchedPlans, fetchedMenus] = await Promise.all([
          getPlans(),
          getAllMenus(),
        ]);
        setAllPlans(fetchedPlans);
        setAllMenus(fetchedMenus);
        setLocalCartItems(getLocalCartItems());
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        toast({ title: "Error", description: "Failed to load menus and plans." });
      } finally {
        setIsCartLoading(false);
      }
    }
    fetchInitialData();
  }, [toast]);

  // Effect to handle authenticated user: fetch DB cart and merge local cart
  useEffect(() => {
    if (!authLoading && isAuthenticated && currentUser?.id) {
      const token = localStorage.getItem("aharraa-u-token");
      if (!token) {
        console.error("No auth token found — user must log in first");
        router.push("/auth?returnUrl=/cart"); // Redirect to login if token is missing
        return;
      }

      const fetchDbCartAndSyncLocal = async () => {
        setIsCartLoading(true);
        try {
          // Sync local cart items to DB
          if (localCartItems.length > 0) {
            console.log("Syncing local cart with database...");
            for (const localItem of localCartItems) {
              const cartItemPayload = {
                menuId: localItem.menuId,
                planId: localItem.planId,
                quantity: localItem.quantity,
                startDate: localItem.startDate,
                personDetails: localItem.personDetails,
                selectedMealTimes: localItem.selectedMealTimes,
                // vendorId is not allowed by backend, so it's removed from payload
                // The backend should infer vendorId from menuId
              };
              await addToCartApi(currentUser.id!, cartItemPayload, token);
            } // Close the for loop block
            clearLocalCart();
            setLocalCartItems([]); // Clear local cart state after syncing
            toast({ title: "Local cart synced!", description: "Your items have been added to your account." });
          } // Close the if block

          // Fetch the updated DB cart
          const cartData: Cart = await getCartItems(currentUser.id!, token); // Explicitly type cartData as Cart
          setDbCart(cartData.items as PopulatedCartItem[]); // Cast cartData.items to PopulatedCartItem[]
        } catch (error) {
          console.error("Failed to fetch or sync cart items:", error);
          toast({ title: "Error", description: "Failed to fetch or sync cart items." });
        } finally {
          setIsCartLoading(false);
        }
      };
      fetchDbCartAndSyncLocal();
    } else if (!authLoading && !isAuthenticated) {
      // If not authenticated, ensure DB cart is null and local cart is loaded (handled by initialData fetch)
      setDbCart(null);
      setIsCartLoading(false); // Stop cart loading if not authenticated
    }
  }, [isAuthenticated, authLoading, currentUser?.id, localCartItems.length, toast, router]); // Dependency on localCartItems.length to trigger sync

  const handleEditPersonDetails = useCallback((itemId: string, details: PersonDetails[] | undefined, quantityToEdit: number) => {
    setCurrentEditingCartItemId(itemId);
    
    const initialDetails = Array.from({ length: quantityToEdit }, (_, i) => {
      return details?.[i] || { name: "", phoneNumber: "" };
    });
    setEditingPersonDetails(initialDetails);
    setIsEditingPersonDetails(true);
  }, []);

  const handleSavePersonDetails = async () => {
    if (isSavingPersonDetails) return;
    setIsSavingPersonDetails(true);

    const isLocalItem = localCartItems.some(item => item._id === currentEditingCartItemId);

    if (currentEditingCartItemId) {
      if (isLocalItem) {
        // Handle local cart item update
        const updatedLocalItems = updateLocalCartItem(
          currentEditingCartItemId,
          { personDetails: editingPersonDetails },
          allMenus,
          allPlans
        );
        setLocalCartItems(updatedLocalItems);
        toast({ title: "Person details updated successfully in local cart!" });

        // If a pending quantity change triggered this, apply it now
        if (pendingNewQuantity !== null) {
          const updatedLocalItemsWithQuantity = updateLocalCartItem(
            currentEditingCartItemId,
            { quantity: pendingNewQuantity, personDetails: editingPersonDetails }, // Pass updated person details as well
            allMenus,
            allPlans
          );
          setLocalCartItems(updatedLocalItemsWithQuantity);
          toast({ title: "Quantity updated successfully in local cart!" });
          setPendingNewQuantity(null);
        }
      } else {
        // Handle database cart item update
        const token = localStorage.getItem("aharraa-u-token");
        if (!token || !currentUser?.id) {
          router.push("/auth?returnUrl=/cart");
          setIsSavingPersonDetails(false);
          return;
        }
        try {
          await updateCartItemPersonDetails(currentUser.id, currentEditingCartItemId, editingPersonDetails, token); // No need to store returned Cart
          toast({ title: "Person details updated successfully!" });
  
          if (pendingNewQuantity !== null) {
            await updateCartItemQuantity(currentUser.id, currentEditingCartItemId, pendingNewQuantity, token); // No need to store returned Cart
            setPendingNewQuantity(null);
          }
          // Refetch cart after successful updates
          const updatedCartData: Cart = await getCartItems(currentUser.id!, token);
          setDbCart(updatedCartData.items as PopulatedCartItem[]);
        } catch (error) {
          console.error("Failed to update person details:", error);
          toast({ title: "Error", description: "Failed to save person details." });
        }
      }
      setIsEditingPersonDetails(false);
      setCurrentEditingCartItemId(null);
      setEditingPersonDetails([]);
    } else {
      console.error("currentEditingCartItemId is null");
    }
    setIsSavingPersonDetails(false);
  };

  const handlePersonDetailChange = useCallback((index: number, field: keyof PersonDetails, value: string) => {
    const updatedDetails = [...editingPersonDetails];
    if (!updatedDetails[index]) {
      updatedDetails[index] = { name: "", phoneNumber: "" };
    }
    updatedDetails[index][field] = value;
    setEditingPersonDetails(updatedDetails);
  }, [editingPersonDetails]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (isUpdatingQuantity) return;
    setIsUpdatingQuantity(true);

    const isLocalItem = localCartItems.some(item => item._id === itemId);

    if (isLocalItem) {
      const currentItem = localCartItems.find(item => item._id === itemId);
      if (!currentItem) {
        setIsUpdatingQuantity(false);
        return;
      }
      if (newQuantity > currentItem.quantity) {
        setPendingNewQuantity(newQuantity);
        handleEditPersonDetails(itemId, currentItem.personDetails, newQuantity);
        setIsUpdatingQuantity(false); // Do not set to false yet if opening dialog
        return;
      } else if (newQuantity < currentItem.quantity) {
        const updatedDetails = currentItem.personDetails?.slice(0, newQuantity) || [];
        const updatedLocalItems = updateLocalCartItem(
          itemId,
          { quantity: newQuantity, personDetails: updatedDetails },
          allMenus,
          allPlans
        );
        setLocalCartItems(updatedLocalItems);
        toast({ title: "Quantity updated in local cart!" });
      } else {
        // Quantity is the same, just update other fields if necessary
        const updatedLocalItems = updateLocalCartItem(
          itemId,
          { quantity: newQuantity },
          allMenus,
          allPlans
        );
        setLocalCartItems(updatedLocalItems);
        toast({ title: "Quantity updated in local cart!" });
      }
    } else {
      // Database cart item update
      const currentItem = (dbCart || []).find((item: any) => item._id === itemId);
      if (!currentItem || !currentUser?.id) {
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
          setIsUpdatingQuantity(false); // Do not set to false yet if opening dialog
          return;
        } else if (newQuantity < currentItem.quantity) {
          const updatedDetails = currentItem.personDetails?.slice(0, newQuantity) || [];
          await updateCartItemPersonDetails(currentUser.id, itemId, updatedDetails, token);
          toast({ title: "Person details updated!" });
        }

        await updateCartItemQuantity(currentUser.id, itemId, newQuantity, token); // No need to store returned Cart
        toast({ title: "Quantity updated successfully!" });

        // Refetch cart after successful update
        const updatedCartData: Cart = await getCartItems(currentUser.id!, token);
        setDbCart(updatedCartData.items as PopulatedCartItem[]);
      } catch (error) {
        console.error("Failed to update quantity:", error);
        toast({ title: "Failed to update quantity", variant: "destructive" });
      }
    }
    setIsUpdatingQuantity(false);
  };

  const handleRemoveItem = async (itemId: string) => {
    if (isRemovingItem) return;
    setIsRemovingItem(true);

    const isLocalItem = localCartItems.some(item => item._id === itemId);

    if (isLocalItem) {
      const updatedLocalItems = removeLocalCartItem(itemId);
      setLocalCartItems(updatedLocalItems);
      toast({ title: "Item removed from local cart successfully!" });
    } else {
      // Database cart item remove
      const token = localStorage.getItem("aharraa-u-token");
      if (!token) {
        router.push("/auth?returnUrl=/cart");
        setIsRemovingItem(false);
        return;
      }
      if (!currentUser?.id) {
        setIsRemovingItem(false);
        return;
      }

      try {
        await removeFromCart(currentUser.id, itemId, token); // No need to store returned Cart
        toast({ title: "Item removed successfully!" });

        // Refetch cart after successful removal
        const updatedCartData: Cart = await getCartItems(currentUser.id!, token);
        setDbCart(updatedCartData.items as PopulatedCartItem[]);
      } catch (error) {
        console.error("Failed to remove item:", error);
        toast({ title: "Error", description: "Failed to remove item from cart." });
      }
    }
    setIsRemovingItem(false);
  };

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      router.push("/auth?returnUrl=/cart"); // Redirect to login, then back to cart for merging
    } else {
      router.push("/checkout");
    }
  };


  if (authLoading || isCartLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LottieAnimation animationData={ItayCheffAnimation} style={{ width: 200, height: 200 }} />
      </div>
    )
  }

  const totalItems = combinedCartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)
  const totalPrice = combinedCartItems.reduce((sum: number, item: any) => sum + item.itemTotalPrice, 0)

  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        {combinedCartItems.length === 0 ? (
          <CartEmptyState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items - Mobile: Full width, Desktop: 2 columns */}
            <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
              {combinedCartItems.map((item: any) => (
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
              <div className="lg:sticky lg:top-20">
                <CartSummaryCard
                  totalItems={totalItems}
                  totalPrice={totalPrice}
                  isUpdatingCart={isUpdatingQuantity || isRemovingItem || isSavingPersonDetails}
                  onCheckout={handleCheckoutClick} // Added checkout handler
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
