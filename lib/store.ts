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
  quantity: number
}

interface DateRange {
  startDate: Date
  endDate: Date
}

interface Accompaniment {
  id: string
  name: string
  price: number
}

interface Store {
  selectedPlan: SubscriptionPlan | null
  setSelectedPlan: (plan: SubscriptionPlan) => void

  selectedDates: DateRange | null
  setSelectedDates: (dates: DateRange) => void

  selectedAccompaniments: Accompaniment[]
  toggleAccompaniment: (accompaniment: Accompaniment) => void
  
  datesConfirmed: boolean
  setDatesConfirmed: (confirmed: boolean) => void

  dietFilter: "all" | "veg" | "non-veg"
  setDietFilter: (filter: "all" | "veg" | "non-veg") => void

  cart: CartItem[]
  addToCart: (item: MenuItem, day: string, quantity: number) => void
  removeFromCart: (id: string, day: string) => void
  updateQuantity: (id: string, day: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
}

export const useStore = create<Store>((set, get) => ({
  selectedPlan: null,
  setSelectedPlan: (plan: SubscriptionPlan) => set({ selectedPlan: plan }),

  selectedDates: null,
  setSelectedDates: (dates: DateRange) => set({ selectedDates: dates }),

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

  dietFilter: "all",
  setDietFilter: (filter: "all" | "veg" | "non-veg") => set({ dietFilter: filter }),

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
    return state.cart.reduce((total, item) => total + item.menuItem.price * item.quantity, 0)
  },
}))
