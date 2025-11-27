import { PopulatedCartItem, MealCategory } from "./types";

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
  return subtotal + deliveryCost + platformCost + gstCost;
}

export function calculateDeliveryCost(
  cartItems: PopulatedCartItem[],
  deliveryCostPerMealPerDay: number
): number {
  let totalDeliveryCost = 0;

  for (const item of cartItems) {
    if (item.plan && item.menu) {
      const planDays = item.plan.durationDays;
      const numberOfSelectedMealTimes = item.selectedMealTimes ? item.selectedMealTimes.length : 0;
      const quantity = item.quantity;

      // Only add delivery cost if meal times are selected
      if (numberOfSelectedMealTimes > 0) {
        totalDeliveryCost += planDays * numberOfSelectedMealTimes * deliveryCostPerMealPerDay;
      }
    }
  }

  return totalDeliveryCost;
}

export function calculatePlatformCost(subtotal: number): number {
  return subtotal * 0.1;
}

export function calculateGstCost(subtotal: number): number {
  return subtotal * 0.05;
}
