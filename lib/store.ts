import { create } from "zustand"

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isVegetarian: boolean
}

export interface SubscriptionPlan {
  id: string
  name: string
  duration: "daily" | "weekly" | "monthly"
  daysCount: number
  pricePerDay: number
  totalPrice: number
}

export interface CartItem {
  menuItem: MenuItem
  day: string
  slot: string
  quantity: number
}

interface Store {
  selectedPlan: SubscriptionPlan | null
  setSelectedPlan: (plan: SubscriptionPlan) => void

  selectedLocation: string | null
  setSelectedLocation: (location: string) => void

  selectedSlot: string | null
  setSelectedSlot: (slot: string) => void

  dietFilter: "all" | "veg" | "non-veg"
  setDietFilter: (filter: "all" | "veg" | "non-veg") => void

  cart: CartItem[]
  addToCart: (item: MenuItem, day: string, slot: string, quantity: number) => void
  removeFromCart: (id: string, day: string, slot: string) => void
  updateQuantity: (id: string, day: string, slot: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
}

export const useStore = create<Store>((set, get) => ({
  selectedPlan: null,
  setSelectedPlan: (plan: SubscriptionPlan) => set({ selectedPlan: plan }),

  selectedLocation: null,
  setSelectedLocation: (location: string) => set({ selectedLocation: location }),

  selectedSlot: null,
  setSelectedSlot: (slot: string) => set({ selectedSlot: slot }),

  dietFilter: "all",
  setDietFilter: (filter: "all" | "veg" | "non-veg") => set({ dietFilter: filter }),

  cart: [],
  addToCart: (item: MenuItem, day: string, slot: string, quantity: number) =>
    set((state) => {
      const existing = state.cart.find((c) => c.menuItem.id === item.id && c.day === day && c.slot === slot)
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.menuItem.id === item.id && c.day === day && c.slot === slot
              ? { ...c, quantity: c.quantity + quantity }
              : c,
          ),
        }
      }
      return { cart: [...state.cart, { menuItem: item, day, slot, quantity }] }
    }),
  removeFromCart: (id: string, day: string, slot: string) =>
    set((state) => ({
      cart: state.cart.filter((c) => !(c.menuItem.id === id && c.day === day && c.slot === slot)),
    })),
  updateQuantity: (id: string, day: string, slot: string, quantity: number) =>
    set((state) => ({
      cart: state.cart.map((c) => (c.menuItem.id === id && c.day === day && c.slot === slot ? { ...c, quantity } : c)),
    })),
  clearCart: () => set({ cart: [] }),
  getTotalPrice: () => {
    const state = get()
    return state.cart.reduce((total, item) => total + item.menuItem.price * item.quantity, 0)
  },
}))
