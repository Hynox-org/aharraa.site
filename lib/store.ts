import { create } from "zustand";
import {
  Cart,
  CartItem,
  DateRange,
  Accompaniment,
  Store,
  DeliveryAddress,
  MealType,
  Plan, // Added Plan
  PersonDetails, // Added PersonDetails
} from "./types";

export const useStore = create<Store>((set, get) => ({
  selectedPlan: null,
  deliveryAddresses: {
    breakfast: null,
    lunch: null,
    dinner: null,
  },
  setDeliveryAddress: (mealType, address) =>
    set((state) => ({
      deliveryAddresses: {
        ...state.deliveryAddresses,
        [mealType]: address,
      },
    })),
  setSelectedPlan: (plan: Plan) => set({ selectedPlan: plan }),

  selectedDates: null,
  setSelectedDates: (dates: DateRange) => set({ selectedDates: dates }),

  selectedVendorId: null,
  setSelectedVendorId: (vendorId: string | null) => set({ selectedVendorId: vendorId }),

  selectedAccompaniments: [],
  toggleAccompaniment: (accompaniment: Accompaniment) =>
    set((state) => {
      const exists = state.selectedAccompaniments.some((item) => item.id === accompaniment.id);
      return {
        selectedAccompaniments: exists
          ? state.selectedAccompaniments.filter((item) => item.id !== accompaniment.id)
          : [...state.selectedAccompaniments, accompaniment],
      };
    }),

  datesConfirmed: false,
  setDatesConfirmed: (confirmed: boolean) => set({ datesConfirmed: confirmed }),

  cart: {
    id: "user-cart", // A default ID, could be dynamic based on user
    userId: "", // Will be set when adding items
    items: [],
    totalItems: 0,
    cartTotalPrice: 0,
    lastUpdated: new Date().toISOString(),
  },
  addToCart: (item: CartItem) =>
    set((state) => {
      const currentCart = state.cart || {
        id: "user-cart",
        userId: item.userId,
        items: [],
        totalItems: 0,
        cartTotalPrice: 0,
        lastUpdated: new Date().toISOString(),
      };

      const existingItemIndex = currentCart.items.findIndex(
        (cartItem) =>
          cartItem.meal.id === item.meal.id &&
          cartItem.plan.id === item.plan.id &&
          cartItem.startDate === item.startDate
      );

      let updatedItems;
      if (existingItemIndex > -1) {
        updatedItems = currentCart.items.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity, itemTotalPrice: (cartItem.quantity + item.quantity) * cartItem.meal.price * cartItem.plan.durationDays }
            : cartItem
        );
      } else {
        updatedItems = [...currentCart.items, item];
      }

      const newTotalItems = updatedItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
      const newCartTotalPrice = updatedItems.reduce((sum, cartItem) => sum + cartItem.itemTotalPrice, 0);

      return {
        cart: {
          ...currentCart,
          items: updatedItems,
          totalItems: newTotalItems,
          cartTotalPrice: newCartTotalPrice,
          lastUpdated: new Date().toISOString(),
        },
      };
    }),
  removeFromCart: (cartItemId: string) =>
    set((state) => {
      const currentCart = state.cart;
      if (!currentCart) return state;

      const updatedItems = currentCart.items.filter((item) => item.id !== cartItemId);
      const newTotalItems = updatedItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
      const newCartTotalPrice = updatedItems.reduce((sum, cartItem) => sum + cartItem.itemTotalPrice, 0);

      return {
        cart: {
          ...currentCart,
          items: updatedItems,
          totalItems: newTotalItems,
          cartTotalPrice: newCartTotalPrice,
          lastUpdated: new Date().toISOString(),
        },
      };
    }),
  updateCartItemQuantity: (cartItemId: string, quantity: number) =>
    set((state) => {
      const currentCart = state.cart;
      if (!currentCart) return state;

      const updatedItems = currentCart.items.map((item) => {
        if (item.id === cartItemId) {
          const oldQuantity = item.quantity;
          let updatedPersonDetails: PersonDetails[] | undefined = item.personDetails ? [...item.personDetails] : undefined;

          if (quantity > oldQuantity) {
            if (!updatedPersonDetails) {
              updatedPersonDetails = [];
            }
            // Add new empty person details
            for (let i = oldQuantity; i < quantity; i++) {
              updatedPersonDetails.push({ name: "", phoneNumber: "" });
            }
          } else if (quantity < oldQuantity) {
            if (updatedPersonDetails) {
              // Remove person details from the end
              updatedPersonDetails = updatedPersonDetails.slice(0, quantity);
            }
          }

          // Ensure personDetails is undefined if quantity is 0
          if (quantity === 0) {
            updatedPersonDetails = undefined;
          } else if (quantity === 1 && (!updatedPersonDetails || updatedPersonDetails.length === 0)) {
            // If quantity is 1 and no person details, initialize with one empty entry
            updatedPersonDetails = [{ name: "", phoneNumber: "" }];
          } else if (quantity > 1 && (!updatedPersonDetails || updatedPersonDetails.length === 0)) {
            // If quantity > 1 and no person details, initialize with appropriate number of empty entries
            updatedPersonDetails = Array.from({ length: quantity }, () => ({ name: "", phoneNumber: "" }));
          }


          return {
            ...item,
            quantity: quantity,
            itemTotalPrice: quantity * item.meal.price * item.plan.durationDays,
            personDetails: updatedPersonDetails,
          };
        }
        return item;
      });

      const newTotalItems = updatedItems.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
      const newCartTotalPrice = updatedItems.reduce((sum, cartItem) => sum + cartItem.itemTotalPrice, 0);

      return {
        cart: {
          ...currentCart,
          items: updatedItems,
          totalItems: newTotalItems,
          cartTotalPrice: newCartTotalPrice,
          lastUpdated: new Date().toISOString(),
        },
      };
    }),
  updateCartItemPersonDetails: (cartItemId: string, personDetails: PersonDetails[]) =>
    set((state) => {
      const currentCart = state.cart;
      if (!currentCart) return state;

      const updatedItems = currentCart.items.map((item) =>
        item.id === cartItemId
          ? { ...item, personDetails: personDetails }
          : item
      );

      return {
        cart: {
          ...currentCart,
          items: updatedItems,
          lastUpdated: new Date().toISOString(),
        },
      };
    }),
  clearCart: () =>
    set((state) => ({
      cart: {
        ...state.cart!,
        items: [],
        totalItems: 0,
        cartTotalPrice: 0,
        lastUpdated: new Date().toISOString(),
      },
    })),
  getCartTotalPrice: () => {
    const currentCart = get().cart;
    return currentCart ? currentCart.cartTotalPrice : 0;
  },
  getCartTotalItems: () => {
    const currentCart = get().cart;
    return currentCart ? currentCart.totalItems : 0;
  },

  returnUrl: "/",
  setReturnUrl: (url) => set({ returnUrl: url }),

  checkoutData: null,
  setCheckoutData: (data) => set({ checkoutData: data }),
  clearCheckoutData: () => set({ checkoutData: null }),
}));
