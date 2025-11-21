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
    if (item.plan && item.menu && (item.menu as any).menuItems && (item.menu as any).menuItems.length > 0) {
      const planDays = item.plan.durationDays;
      
      // Get the first day from the menu items to count meals per day
      const firstDay = (item.menu as any).menuItems[0].day;
      const mealsPerDay = new Set(
        (item.menu as any).menuItems
          .filter((menuItem: any) => menuItem.day === firstDay)
          .map((menuItem: any) => menuItem.category)
      ).size;

      totalDeliveryCost += planDays * mealsPerDay * deliveryCostPerMealPerDay;
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
