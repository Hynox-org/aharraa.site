export type PlanType = "veg" | "non-veg";

export const MENU_DATA = {
  veg: {
    breakfast: [
      {
        id: "vb1",
        name: "Masala Dosa",
        description: "Crispy rice crepe served with potato curry and chutneys",
        image: "/defaults/default-meal.jpg",
        category: "breakfast",
        isVegetarian: true,
      },
      {
        id: "vb2",
        name: "Poha",
        description: "Flattened rice with peanuts, onions, and herbs",
        image: "/defaults/default-meal.jpg",
        category: "breakfast",
        isVegetarian: true,
      },
      {
        id: "vb3",
        name: "Upma",
        description: "Savory semolina porridge with vegetables",
        image: "/defaults/default-meal.jpg",
        category: "breakfast",
        isVegetarian: true,
      },
    ],
    lunch: [
      {
        id: "vl1",
        name: "Paneer Tikka Masala",
        description: "Cottage cheese in rich tomato gravy with Indian spices",
        image: "/defaults/default-meal.jpg",
        category: "lunch",
        isVegetarian: true,
      },
      {
        id: "vl2",
        name: "Dal Makhani",
        description: "Creamy black lentils simmered overnight",
        image: "/defaults/default-meal.jpg",
        category: "lunch",
        isVegetarian: true,
      },
      {
        id: "vl3",
        name: "Veg Biryani",
        description: "Fragrant rice with mixed vegetables and saffron",
        image: "/defaults/default-meal.jpg",
        category: "lunch",
        isVegetarian: true,
      },
    ],
    dinner: [
      {
        id: "vd1",
        name: "Mix Veg Curry",
        description: "Seasonal vegetables in a mild curry sauce",
        image: "/defaults/default-meal.jpg",
        category: "dinner",
        isVegetarian: true,
      },
      {
        id: "vd2",
        name: "Palak Paneer",
        description: "Cottage cheese in spinach gravy",
        image: "/defaults/default-meal.jpg",
        category: "dinner",
        isVegetarian: true,
      },
      {
        id: "vd3",
        name: "Chole Bhature",
        description: "Spiced chickpea curry with fried bread",
        image: "/defaults/default-meal.jpg",
        category: "dinner",
        isVegetarian: true,
      },
    ],
  },
  nonVeg: {
    breakfast: [
      {
        id: "nvb1",
        name: "Chicken Keema Paratha",
        description: "Flatbread stuffed with minced chicken",
        image: "/defaults/default-meal.jpg",
        category: "breakfast",
        isVegetarian: false,
      },
      {
        id: "nvb2",
        name: "Egg Bhurji",
        description: "Scrambled eggs with Indian spices",
        image: "/defaults/default-meal.jpg",
        category: "breakfast",
        isVegetarian: false,
      },
      {
        id: "nvb3",
        name: "Chicken Sandwich",
        description: "Grilled chicken with fresh vegetables",
        image: "/defaults/default-meal.jpg",
        category: "breakfast",
        isVegetarian: false,
      },
    ],
    lunch: [
      {
        id: "nvl1",
        name: "Butter Chicken",
        description: "Tender chicken in rich tomato gravy",
        image: "/defaults/default-meal.jpg",
        category: "lunch",
        isVegetarian: false,
      },
      {
        id: "nvl2",
        name: "Chicken Biryani",
        description: "Fragrant rice with tender chicken and saffron",
        image: "/defaults/default-meal.jpg",
        category: "lunch",
        isVegetarian: false,
      },
      {
        id: "nvl3",
        name: "Fish Curry",
        description: "Fresh fish in coconut curry sauce",
        image: "/defaults/default-meal.jpg",
        category: "lunch",
        isVegetarian: false,
      },
    ],
    dinner: [
      {
        id: "nvd1",
        name: "Mutton Rogan Josh",
        description: "Tender mutton in Kashmiri spices",
        image: "/defaults/default-meal.jpg",
        category: "dinner",
        isVegetarian: false,
      },
      {
        id: "nvd2",
        name: "Chicken Tikka",
        description: "Grilled marinated chicken with mint chutney",
        image: "/defaults/default-meal.jpg",
        category: "dinner",
        isVegetarian: false,
      },
      {
        id: "nvd3",
        name: "Fish Masala",
        description: "Spiced fish curry with coconut",
        image: "/defaults/default-meal.jpg",
        category: "dinner",
        isVegetarian: false,
      },
    ],
  },
  accompaniments: {
    indian: [
      { id: "acc1", name: "Jeera Rice", price: 149 },
      { id: "acc2", name: "Roti", price: 49 },
      { id: "acc3", name: "Naan", price: 69 },
      { id: "acc4", name: "Raita", price: 79 },
      { id: "acc5", name: "Papad", price: 29 },
    ],
  },
} as const

export type MealType = "breakfast" | "lunch" | "dinner"
export type DietType = "veg" | "nonVeg"

// Fixed weekly menu rotation
export const WEEKLY_MENU = {
  Monday: {
    breakfast: [0, 1], // Indexes from the menu arrays
    lunch: [0, 2],
    dinner: [1, 2],
  },
  Tuesday: {
    breakfast: [1, 2],
    lunch: [1, 0],
    dinner: [0, 1],
  },
  Wednesday: {
    breakfast: [2, 0],
    lunch: [2, 1],
    dinner: [2, 0],
  },
  Thursday: {
    breakfast: [0, 2],
    lunch: [0, 1],
    dinner: [1, 2],
  },
  Friday: {
    breakfast: [1, 0],
    lunch: [1, 2],
    dinner: [0, 1],
  },
  Saturday: {
    breakfast: [2, 1],
    lunch: [2, 0],
    dinner: [2, 1],
  },
  Sunday: {
    breakfast: [0, 1],
    lunch: [0, 2],
    dinner: [1, 0],
  },
}