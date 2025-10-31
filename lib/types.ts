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

export interface AuthApiResponse {
  accessToken?: string;
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, returnUrl?: string) => void;
  logout: () => void;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface Highlight {
  icon: string;
  title: string;
  description: string;
}

export interface Review {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface PersonDetails {
  name: string;
  phoneNumber: string;
}

// New Schema for Meals, Vendors, Plans, and Orders

export type DietPreference = "All" | "Veg" | "Non-Veg" | "Vegan" | "Custom";
export type MealCategory = "Breakfast" | "Lunch" | "Dinner";

export interface Meal {
  id: string;
  name: string;
  description: string;
  dietPreference: DietPreference;
  category: MealCategory;
  subProducts: string[]; // e.g., ["Rice", "Curry", "Salad"]
  nutritionalDetails: {
    protein: number; // in grams
    carbs: number; // in grams
    fats: number; // in grams
    calories: number; // in kcal
  };
  price: number;
  image: string;
  vendorId: string; // Reference to the vendor who created this meal
}

export interface Vendor {
  id: string;
  name: string;
  description?: string; // Optional description for the vendor
  image?: string; // Optional image for the vendor
  rating?: number; // Optional rating for the vendor
}

export interface Plan {
  id: string;
  name: string; // e.g., "3-Day Plan", "5-Day Plan", "7-Day Plan"
  durationDays: number; // 3, 5, or 7
  price: number; // Total price for the plan
}

export interface Order {
  id: string;
  _id?: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: DeliveryAddress;
  billingAddress: DeliveryAddress; // Assuming billing address is same as shipping for now, or can be separate
  deliveryAddresses: { // Added to store multiple delivery addresses per category
    Breakfast?: DeliveryAddress;
    Lunch?: DeliveryAddress;
    Dinner?: DeliveryAddress;
  };
  paymentMethod: string;
  totalAmount: number;
  paymentSessionId: string;
  currency: string; // e.g., "INR"
  orderDate: string; // ISO date string (timestamp of order creation)
  status: "pending" | "completed" | "cancelled" | "processing"; // Order status
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  mealName: string; // Added for display purposes
  planName: string; // Added for display purposes
  vendorName: string; // Added for display purposes
}

export interface CreateOrderPayload {
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: DeliveryAddress;
  billingAddress: DeliveryAddress;
  deliveryAddresses: { // Added to send multiple delivery addresses per category
    Breakfast?: DeliveryAddress;
    Lunch?: DeliveryAddress;
    Dinner?: DeliveryAddress;
  };
  paymentMethod: string;
  totalAmount: number;
  currency: string;
}

export interface CartItem {
  id: string; // Unique ID for the cart item
  userId: string;
  meal: Meal;
  plan: Plan;
  quantity: number;
  personDetails?: PersonDetails[]; // Optional array of person details
  startDate: string; // ISO date string (e.g., "YYYY-MM-DD")
  endDate: string; // ISO date string (e.g., "YYYY-MM-DD")
  itemTotalPrice: number; // Price for this specific cart item (meal * plan duration * quantity)
  addedDate: string; // Timestamp when item was added to cart
}

export interface Cart {
  id: string; // Unique ID for the cart (could be user ID if one cart per user)
  userId: string;
  items: CartItem[];
  totalItems: number;
  cartTotalPrice: number;
  lastUpdated: string; // Timestamp of last update
}

export type MealType = "breakfast" | "lunch" | "dinner";

export interface DeliveryAddress {
  street: string;
  city: string;
  zip: string;
  // Add other address fields as needed
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface Accompaniment {
  id: string;
  name: string;
  price: number;
}

export interface Store {
  selectedPlan: Plan | null;
  deliveryAddresses: {
    breakfast: DeliveryAddress | null;
    lunch: DeliveryAddress | null;
    dinner: DeliveryAddress | null;
  };
  setDeliveryAddress: (mealType: MealType, address: DeliveryAddress) => void;
  setSelectedPlan: (plan: Plan) => void;

  selectedDates: DateRange | null;
  setSelectedDates: (dates: DateRange) => void;

  selectedVendorId: string | null;
  setSelectedVendorId: (vendorId: string | null) => void;

  selectedAccompaniments: Accompaniment[];
  toggleAccompaniment: (accompaniment: Accompaniment) => void;

  datesConfirmed: boolean;
  setDatesConfirmed: (confirmed: boolean) => void;

  cart: Cart | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQuantity: (cartItemId: string, quantity: number) => void;
  updateCartItemPersonDetails: (cartItemId: string, personDetails: PersonDetails[]) => void;
  clearCart: () => void;
  getCartTotalPrice: () => number;
  getCartTotalItems: () => number;

  returnUrl: string;
  setReturnUrl: (url: string) => void;

  checkoutData: CheckoutData | null;
  setCheckoutData: (data: CheckoutData | null) => void;
  clearCheckoutData: () => void;
}

export interface CheckoutItem {
  id: string; // Unique ID for the checkout item (from CartItem)
  meal: Meal;
  plan: Plan;
  quantity: number;
  personDetails?: PersonDetails[]; // Optional array of person details
  startDate: string;
  endDate: string;
  itemTotalPrice: number;
  vendor: Vendor; // Include vendor details directly
}

export interface CheckoutData {
  id: string; // Unique ID for the checkout session/order
  userId: string;
  items: CheckoutItem[];
  deliveryAddresses: { // Changed to an object keyed by MealCategory
    Breakfast?: DeliveryAddress;
    Lunch?: DeliveryAddress;
    Dinner?: DeliveryAddress;
  };
  totalPrice: number;
  checkoutDate: string; // Timestamp of when checkout data was finalized
}
