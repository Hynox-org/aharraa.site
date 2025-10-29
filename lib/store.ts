import { create } from "zustand"
import { MenuItem, SubscriptionPlan, CartItem, DateRange, Accompaniment, Store, DeliveryAddress, MealType } from "./types";

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
  setSelectedPlan: (plan: SubscriptionPlan) => set({ selectedPlan: plan }),

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

  dietFilter: "veg",
  setDietFilter: (filter: "veg" | "non-veg") => set({ dietFilter: filter }),

  cart: [],
  addToCart: (item: MenuItem, day: string, quantity: number) =>
    set((state) => {
      const existing = state.cart.find((c) => c.menuItem.id === item.id && c.day === day)
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.menuItem.id === item.id && c.day === day
              ? { ...c, quantity: c.quantity + quantity }
              : c,
          ),
        }
      }
      return { cart: [...state.cart, { menuItem: item, day, quantity }] }
    }),
  removeFromCart: (id: string, day: string) =>
    set((state) => ({
      cart: state.cart.filter((c) => !(c.menuItem.id === id && c.day === day)),
    })),
  updateQuantity: (id: string, day: string, quantity: number) =>
    set((state) => ({
      cart: state.cart.map((c) => (c.menuItem.id === id && c.day === day ? { ...c, quantity } : c)),
    })),
  clearCart: () => set({ cart: [] }),
  getTotalPrice: () => {
    const state = get()
    return state.cart.reduce((total, item) => total + (item.menuItem.price || 0) * item.quantity, 0)
  },
}))
