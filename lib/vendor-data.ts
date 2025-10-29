import { Vendor } from "./types";

export const VENDORS: Vendor[] = [
  {
    id: "v1",
    name: "Spice Garden Kitchen",
    description: "Authentic North Indian cuisine with a modern twist. Specializing in vegetarian and non-vegetarian dishes.",
    image: "/defaults/default-meal.jpg",
    rating: 4.5,
    specialties: ["North Indian", "Mughlai", "Punjabi"],
    location: "Sector 18, Noida",
    deliveryAreas: ["Noida", "Greater Noida", "Delhi"],
    contactInfo: {
      phone: "+91 98765 43210",
      email: "contact@spicegarden.com"
    }
  },
  {
    id: "v2",
    name: "South India Delights",
    description: "Traditional South Indian vegetarian meals prepared with authentic recipes and fresh ingredients.",
    image: "/defaults/default-meal.jpg",
    rating: 4.3,
    specialties: ["South Indian", "Kerala", "Tamil"],
    location: "Indirapuram, Ghaziabad",
    deliveryAreas: ["Ghaziabad", "Noida", "Delhi"],
    contactInfo: {
      phone: "+91 98765 43211",
      email: "info@southindiadelights.com"
    }
  },
  {
    id: "v3",
    name: "Royal Kitchen",
    description: "Premium non-vegetarian cuisine specializing in Mughlai and North Indian delicacies.",
    image: "/defaults/default-meal.jpg",
    rating: 4.7,
    specialties: ["Mughlai", "Awadhi", "North Indian"],
    location: "Sector 63, Noida",
    deliveryAreas: ["Noida", "Greater Noida", "Ghaziabad"],
    contactInfo: {
      phone: "+91 98765 43212",
      email: "contact@royalkitchen.com"
    }
  }
];
