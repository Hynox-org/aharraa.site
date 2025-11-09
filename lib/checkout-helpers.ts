import { MealCategory } from "./types";

interface CalculateGrandTotalParams {
  subtotal: number;
  deliveryCost: number;
  platformCost: number;
  gstCost: number;
  environment?: string;
}

export function calculateGrandTotal({
  subtotal,
  deliveryCost,
  platformCost,
  gstCost,
  environment,
}: CalculateGrandTotalParams): number {
  if (environment === "development") {
    return 1; // Set total to 1 Rs for development environment
  }
  return subtotal + deliveryCost + platformCost + gstCost;
}

export function calculateDeliveryCost(
  uniqueMealCategories: MealCategory[],
  totalPlanDays: number,
  deliveryCostPerCategory: number
): number {
  return uniqueMealCategories.length * deliveryCostPerCategory * totalPlanDays;
}

export function calculatePlatformCost(subtotal: number): number {
  return subtotal * 0.1;
}

export function calculateGstCost(subtotal: number): number {
  return subtotal * 0.05;
}
