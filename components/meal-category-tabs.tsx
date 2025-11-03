"use client"

import { cn } from "@/lib/utils"
import { MealCategory } from "@/lib/types"
import { HiSparkles, HiChevronRight } from "react-icons/hi2"
import { IoRestaurant, IoLeaf, IoFastFood } from "react-icons/io5"
import { MdFastfood, MdBakeryDining, MdLocalDining } from "react-icons/md"
import { GiMeal, GiCoffeeBeans } from "react-icons/gi"
import { IoCheckmarkCircle } from "react-icons/io5"

interface MealCategoryTabsProps {
  categories: MealCategory[]
  selectedCategory: MealCategory
  onSelectCategory: (category: MealCategory) => void
}

// Icon mapping for categories
const getCategoryIcon = (category: MealCategory) => {
  const iconMap: Record<string, any> = {
    'Breakfast': GiCoffeeBeans,
    'Lunch': MdLocalDining,
    'Dinner': IoRestaurant,
    'Snacks': MdFastfood,
    'Desserts': MdBakeryDining,
    'Beverages': GiCoffeeBeans,
    'Healthy': IoLeaf,
    'All': GiMeal
  }
  return iconMap[category] || IoRestaurant
}

export function MealCategoryTabs({ categories, selectedCategory, onSelectCategory }: MealCategoryTabsProps) {
  return (
    <div className="relative">
      {/* Background Decoration */}
      <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-[#DDA15E] to-[#BC6C25] opacity-10 rounded-full filter blur-2xl"></div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#606C38] to-[#283618] opacity-10 rounded-full filter blur-xl"></div>

      {/* Header Section */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#606C38] to-[#283618] flex items-center justify-center shadow-lg">
            <IoRestaurant className="w-6 h-6 text-[#FEFAE0] animate-bounce" />
          </div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FEFAE0] to-white rounded-full px-4 py-2 border border-[#DDA15E] border-opacity-30 shadow-md">
            <HiSparkles className="w-4 h-4 text-[#BC6C25] animate-pulse" />
            <span className="text-sm font-bold text-[#283618]">Curated Menu</span>
          </div>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          <span className="bg-gradient-to-r from-[#283618] via-[#606C38] to-[#283618] bg-clip-text text-transparent">
            Browse Our
          </span>
          <span className="block bg-gradient-to-r from-[#DDA15E] to-[#BC6C25] bg-clip-text text-transparent">
            Delicious Menu
          </span>
        </h2>

        {/* Decorative Line */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-1 bg-gradient-to-r from-[#DDA15E] to-[#BC6C25] rounded-full"></div>
          <IoLeaf className="w-6 h-6 text-[#606C38] animate-spin" style={{ animationDuration: '3s' }} />
          <div className="w-16 h-1 bg-gradient-to-r from-[#BC6C25] to-[#DDA15E] rounded-full"></div>
        </div>

        <p className="text-lg text-[#606C38] font-medium max-w-2xl">
          Discover freshly prepared meals crafted by our expert home chefs
        </p>
      </div>
{/* Category Tabs */}
      <div className="flex gap-3 overflow-x-auto p-2 scrollbar-hide">
        {categories.map((category) => {
          const isSelected = selectedCategory === category
          
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all flex-shrink-0",
                isSelected && "scale-105"
              )}
              style={{
                backgroundColor: isSelected ? "#606C38" : "#FEFAE0",
                color: isSelected ? "#FEFAE0" : "#283618",
                border: `2px solid ${isSelected ? "#606C38" : "#DDA15E"}`
              }}
            >
              {isSelected && (
                <IoCheckmarkCircle className="w-4 h-4" />
              )}
              <span>{category}</span>
            </button>
          )
        })}
      </div>

        {/* Selected Category Indicator */}
        <div className="flex items-center justify-center pt-10">
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#FEFAE0] to-white rounded-full px-4 py-2 border border-[#DDA15E] border-opacity-30 shadow-md">
            <span className="text-sm text-[#283618] font-medium">Showing:</span>
            <span className="text-sm font-bold bg-gradient-to-r from-[#606C38] to-[#BC6C25] bg-clip-text text-transparent">
              {selectedCategory}
            </span>
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#DDA15E] to-[#BC6C25] animate-pulse"></div>
          </div>
        </div>

      {/* Bottom Decorative Wave
      // <div className="absolute bottom-0 left-0 w-full overflow-hidden opacity-30 pt-10">
      //   <svg className="relative block w-full h-8 mt-10" viewBox="0 0 1200 120" preserveAspectRatio="none">
      //     <path 
      //       d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
      //       fill="url(#waveGradient)"
      //     />
      //     <defs>
      //       <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      //         <stop offset="0%" stopColor="#DDA15E" />
      //         <stop offset="50%" stopColor="#BC6C25" />
      //         <stop offset="100%" stopColor="#DDA15E" />
      //       </linearGradient>
      //     </defs>
      //   </svg>
      // </div> */}
    </div>
  )
}