// lib/types.ts

export interface User {
  id?: string;
  name?: string;
  email?: string;
  // Add other user properties as needed
}

export interface ValidateTokenResponse {
  message: string;
  user: User;
}

export interface MenuSelectionProps {
  weeklyMenu: OrderSummary['weeklyMenu'];
}

export interface AuthApiResponse {
  accessToken?: string;
  message?: string;
}

export interface FaqItem {
  id: number
  question: string
  answer: string
}

export interface CartSummaryProps {
  summary: OrderSummary;
  onProceedToPayment: () => void;
  deliveryAddresses: {
    breakfast: DeliveryAddress | null;
    lunch: DeliveryAddress | null;
    dinner: DeliveryAddress | null;
  };
}

export interface OrderSummary {
  plan: {
    name: string;
    duration: string;
    daysCount: number;
    pricePerDay: number;
    totalPrice: number;
    dates: {
      start: string;
      end: string;
    };
  };
  vendor: {
    id: string;
    name: string;
    location: string;
    rating: number;
    contactInfo: {
      phone: string;
      email: string;
    };
  };
  dietPreference: "veg" | "non-veg";
  weeklyMenu: {
    [key: string]: {
      date: string;
      meals: {
        breakfast: Array<{ id: string; name: string; isVegetarian: boolean }>;
        lunch: Array<{ id: string; name: string; isVegetarian: boolean }>;
        dinner: Array<{ id: string; name: string; isVegetarian: boolean }>;
      };
    };
  };
  accompaniments: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  pricing: {
    planTotal: number;
    accompanimentsTotal: number;
    grandTotal: number;
  };
  deliveryAddresses: {
    breakfast: DeliveryAddress | null;
    lunch: DeliveryAddress | null;
    dinner: DeliveryAddress | null;
  };
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, returnUrl?: string) => void; // Update login function signature
  logout: () => void;
}

export interface Highlight {
  icon: string
  title: string
  description: string
}

export interface MenuItemProps {
  item: MenuItem
  selectedDay: string
}

export interface LocationSelectionProps {
  mealType: "breakfast" | "lunch" | "dinner";
}

export interface Review {
  id: number
  name: string
  role: string
  content: string
  rating: number
  avatar: string
}

export type PlanType = "veg" | "non-veg";
export type MealType = "breakfast" | "lunch" | "dinner";
export type DietType = "veg" | "nonVeg";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: MealType;
  isVegetarian: boolean;
  price?: number;
}

export interface VendorMenu {
  vendorId: string;
  veg: {
    breakfast: MenuItem[];
    lunch: MenuItem[];
    dinner: MenuItem[];
  };
  nonVeg: {
    breakfast: MenuItem[];
    lunch: MenuItem[];
    dinner: MenuItem[];
  };
  accompaniments: {
    indian: Accompaniment[];
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: "daily" | "weekly" | "monthly";
  daysCount: number;
  pricePerDay: number;
  totalPrice: number;
  planType: PlanType;
}

export interface CartItem {
  menuItem: MenuItem;
  day: string;
  quantity: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface Accompaniment {
  id: string;
  name: string;
  price: number;
}

export interface Store {
  selectedPlan: SubscriptionPlan | null;
  setSelectedPlan: (plan: SubscriptionPlan) => void;

  selectedDates: DateRange | null;
  setSelectedDates: (dates: DateRange) => void;

  selectedVendorId: string | null;
  setSelectedVendorId: (vendorId: string | null) => void;

  selectedAccompaniments: Accompaniment[];
  toggleAccompaniment: (accompaniment: Accompaniment) => void;

  dietFilter: "veg" | "non-veg";
  setDietFilter: (filter: "veg" | "non-veg") => void;

  datesConfirmed: boolean;
  setDatesConfirmed: (confirmed: boolean) => void;

  cart: CartItem[];
  addToCart: (item: MenuItem, day: string, quantity: number) => void;
  removeFromCart: (id: string, day: string) => void;
  updateQuantity: (id: string, day: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;

  deliveryAddresses: {
    breakfast: DeliveryAddress | null;
    lunch: DeliveryAddress | null;
    dinner: DeliveryAddress | null;
  };
  setDeliveryAddress: (
    mealType: "breakfast" | "lunch" | "dinner",
    address: DeliveryAddress
  ) => void;
}

export interface DeliveryAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  specialties: string[];
  location: string;
  deliveryAreas: string[];
  contactInfo: {
    phone: string;
    email: string;
  };
}
