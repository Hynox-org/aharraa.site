import { CartItem, MenuWithPopulatedMeals, Plan, PersonDetails, MealCategory } from "./types";
import { v4 as uuidv4 } from 'uuid';
import { format, addDays, parseISO } from "date-fns";

export interface LocalCartItem {
  _id: string; // Client-generated UUID
  menuId: string;
  planId: string;
  quantity: number;
  personDetails?: PersonDetails[];
  startDate: string; // ISO date string
  endDate: string; // ISO date string - calculated client-side
  itemTotalPrice: number; // Calculated client-side
  selectedMealTimes: MealCategory[];
  addedDate: string; // ISO date string
  // vendorId: string; // Removed as it's not allowed by backend and can be derived from menu.vendor
  menu: MenuWithPopulatedMeals; // Made mandatory for calculation
  plan: Plan; // Made mandatory for calculation
}

const LOCAL_CART_KEY = "aharraa-local-cart";

/**
 * Retrieves all items from the local cart.
 * @returns An array of LocalCartItem.
 */
export const getLocalCartItems = (): LocalCartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const cartJson = localStorage.getItem(LOCAL_CART_KEY);
  return cartJson ? JSON.parse(cartJson) : [];
};

/**
 * Saves the given cart items to local storage, overwriting existing cart.
 * @param items An array of LocalCartItem to save.
 */
export const saveLocalCartItems = (items: LocalCartItem[]) => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
};

/**
 * Adds a new item to the local cart.
 * @param newItem The LocalCartItem to add.
 * @returns The updated list of local cart items.
 */
export const addLocalCartItem = (newItem: Omit<LocalCartItem, '_id' | 'endDate' | 'itemTotalPrice' | 'addedDate' | 'menu' | 'plan' | 'menu' | 'plan'>, menu: MenuWithPopulatedMeals, plan: Plan): LocalCartItem[] => {
  const currentItems = getLocalCartItems();
  
  const startDate = parseISO(newItem.startDate);
  const endDate = format(addDays(startDate, plan.durationDays - 1), "yyyy-MM-dd");
  // Updated itemTotalPrice calculation
  const itemTotalPrice = calculateItemTotalPrice(menu, plan, newItem.quantity, newItem.selectedMealTimes);

  const itemToAdd: LocalCartItem = {
    ...newItem,
    _id: uuidv4(),
    endDate,
    itemTotalPrice,
    addedDate: new Date().toISOString(),
    // vendorId: menu._id, // Removed vendorId as it's not needed in LocalCartItem directly.
    menu, 
    plan, 
  };

  const updatedItems = [...currentItems, itemToAdd];
  saveLocalCartItems(updatedItems);
  return updatedItems;
};

/**
 * Updates an existing item in the local cart.
 * @param itemId The _id of the item to update.
 * @param updates The partial updates for the item.
 * @returns The updated list of local cart items.
 */
export const updateLocalCartItem = (itemId: string, updates: Partial<LocalCartItem>, allMenus: MenuWithPopulatedMeals[], allPlans: Plan[]): LocalCartItem[] => {
  const currentItems = getLocalCartItems();
  const updatedItems = currentItems.map((item) => {
    if (item._id === itemId) {
      const updatedItem = { ...item, ...updates };

      // Recalculate endDate and itemTotalPrice if quantity, plan, startDate or selectedMealTimes change
      if (
        updates.quantity !== undefined ||
        updates.planId !== undefined ||
        updates.startDate !== undefined ||
        updates.selectedMealTimes !== undefined
      ) {
        const menu = allMenus.find(m => m._id === updatedItem.menuId);
        const plan = allPlans.find(p => p._id === updatedItem.planId);

        if (menu && plan && updatedItem.startDate) {
          const newStartDate = parseISO(updatedItem.startDate);
          updatedItem.endDate = format(addDays(newStartDate, plan.durationDays - 1), "yyyy-MM-dd");
          // Updated itemTotalPrice calculation
          updatedItem.itemTotalPrice = calculateItemTotalPrice(
            menu, 
            plan,
            updatedItem.quantity,
            updatedItem.selectedMealTimes
          );
        }
      }
      return updatedItem;
    }
    return item;
  });
  saveLocalCartItems(updatedItems);
  return updatedItems;
};

/**
 * Removes an item from the local cart.
 * @param itemId The _id of the item to remove.
 * @returns The updated list of local cart items.
 */
export const removeLocalCartItem = (itemId: string): LocalCartItem[] => {
  const currentItems = getLocalCartItems();
  const updatedItems = currentItems.filter((item) => item._id !== itemId);
  saveLocalCartItems(updatedItems);
  return updatedItems;
};

/**
 * Clears all items from the local cart.
 */
export const clearLocalCart = () => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(LOCAL_CART_KEY);
};

/**
 * Calculates the total price for a single cart item based on backend logic.
 * @param menu The MenuWithPopulatedMeals object.
 * @param plan The Plan object.
 * @param quantity The number of persons/servings.
 * @param selectedMealTimes The array of selected meal times.
 * @returns The total price for the item.
 */
export const calculateItemTotalPrice = (
  menu: MenuWithPopulatedMeals,
  plan: Plan,
  quantity: number,
  selectedMealTimes: MealCategory[]
): number => {
  let mealTimePricesSum = 0;
  if (selectedMealTimes && selectedMealTimes.length > 0) {
    selectedMealTimes.forEach(mealTime => {
      if (menu.price && menu.price[mealTime.toLowerCase()]) {
        mealTimePricesSum += menu.price[mealTime.toLowerCase()]!;
      }
    });
  } else {
    // Fallback to perDayPrice if no meal times selected or prices not defined
    mealTimePricesSum = menu.perDayPrice;
  }
  return quantity * plan.durationDays * mealTimePricesSum;
};
