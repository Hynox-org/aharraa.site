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

// New Schema for Meals, Vendors, Plans, and Orders

export type DietPreference = "Veg" | "Non-Veg" | "Vegan" | "Custom";
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
  userId: string;
  selectedMeal: Meal;
  vendor: Vendor;
  plan: Plan;
  startDate: string; // ISO date string (e.g., "YYYY-MM-DD")
  endDate: string; // ISO date string (e.g., "YYYY-MM-DD")
  totalPrice: number;
  orderDate: string; // ISO date string (timestamp of order creation)
}
