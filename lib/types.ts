// lib/types.ts
import React from 'react';

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

export interface DeliveryLocation {
  street: string;
  state: string;
  pincode: string;
  lat: number;
  lon: number;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  supabaseId: string;
  fullName: string;
  phoneNumber: string;
  breakfastDeliveryLocation?: DeliveryLocation;
  lunchDeliveryLocation?: DeliveryLocation;
  dinnerDeliveryLocation?: DeliveryLocation;
  createdAt: string;
  updatedAt: string;
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
  token: string | null;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  icon: string;
  gradient: string;
}

export interface Highlight {
  icon: string;
  title: string;
  description: string;
  iconComponent: React.ElementType;
  gradient: string;
}

export interface Review {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  gradient: string;
}

export interface PersonDetails {
  name: string;
  phoneNumber: string;
}

// New Schema for Meals, Vendors, Plans, and Orders

export type DietPreference = "All" | "Veg" | "Non-Veg" | "Vegan" | "Custom";
export type MealCategory = "Breakfast" | "Lunch" | "Dinner";

export interface Meal {
  _id: string;
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
  image: string; // Changed from imageUrl to image
  vendorId: string; // Reference to the vendor who created this meal
  createdAt: string;
  updatedAt: string;
  __v: number;
  specialties?: string[];
  location?: string;
  deliveryAreas?: string[];
  contactInfo?: ContactInfo;
}

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface Vendor {
  _id: string; // Changed from id to _id
  name: string;
  description?: string; // Optional description for the vendor
  image?: string; // Optional image for the vendor
  rating?: number; // Optional rating for the vendor
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Plan {
  _id: string; // Changed from id to _id
  name: string; // e.g., "3-Day Plan", "5-Day Plan", "7-Day Plan"
  durationDays: number; // 3, 5, or 7
  price: number; // Total price for the plan
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Order {
  _id: string; // Changed from id to _id
  userId: string;
  items: OrderItem[];
  deliveryAddresses: Record<string, DeliveryAddress>; // Changed to Record<string, DeliveryAddress>
  paymentMethod: string;
  totalAmount: number;
  paymentSessionId: string;
  currency: string; // e.g., "INR"
  orderDate: string; // ISO date string (timestamp of order creation)
  status: "pending" | "completed" | "cancelled" | "processing" | "confirmed" | "delivered"; // Order status
  skippedDates?: string[]; // Array of ISO date strings (YYYY-MM-DD) for skipped deliveries
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderItem {
  id: string; // Changed from id to _id
  meal: {
    _id: Meal;
    name: string;
  };
  plan: {
    _id: Plan;
    name: string;
  };
  vendor: {
    _id: Vendor;
    name: string;
  };
  quantity: number;
  personDetails: PersonDetails[];
  startDate: string;
  endDate: string;
  itemTotalPrice: number;
  skippedDates?: string[]; // Array of ISO date strings (YYYY-MM-DD) for skipped deliveries for this item
}

export interface CreatePaymentPayload {
  userId: string; // The ID of the user making the order
  checkoutData: CheckoutData; // The complete checkout data
  paymentMethod: "COD" | "CC" | "UPI"; // Must be one of: "COD", "CC", "UPI"
  totalAmount: number; // Number, minimum 0 (This should typically match checkoutData.totalPrice)
  currency: string; // e.g., "INR"
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
  vendor: Vendor; // Added to include vendor details directly
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
  lat?: number;
  lon?: number;
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
  meal: {id: string, name: string, image?: string}; // Made image property optional
  plan: {id: string, name: string , durationDays?: number};
  quantity: number;
  personDetails?: PersonDetails[]; // Optional array of person details
  startDate: string;
  endDate: string;
  itemTotalPrice: number;
  vendor: {id: string, name: string}; // Include vendor details directly
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
