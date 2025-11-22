import React from "react"
import { Menu, MenuItem, MealCategory, DayOfWeek, Meal, MenuItemWithPopulatedMeal, MenuWithPopulatedMeals } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"
import { Check, Eye } from "lucide-react"

interface MenuGridProps {
  menus: MenuWithPopulatedMeals[];
  selectedMenu: MenuWithPopulatedMeals | null;
  onMenuSelect: (menu: MenuWithPopulatedMeals) => void;
}

const DAYS_ORDER: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_CATEGORIES: MealCategory[] = ["Breakfast", "Lunch", "Dinner"];

export function MenuGrid({ menus, selectedMenu, onMenuSelect }: MenuGridProps) {
  const getMealsByDay = (menu: MenuWithPopulatedMeals) => {
    const mealsByDay: Record<DayOfWeek, Record<MealCategory, MenuItemWithPopulatedMeal | null>> = {} as any;
    
    DAYS_ORDER.forEach(day => {
      mealsByDay[day] = { Breakfast: null, Lunch: null, Dinner: null };
    });

    menu.menuItems.forEach((item) => {
      if (mealsByDay[item.day]) {
        mealsByDay[item.day][item.category] = item;
      }
    });

    return mealsByDay;
  };

  const getTotalDays = (menu: MenuWithPopulatedMeals) => {
    const uniqueDays = new Set(menu.menuItems.map(item => item.day));
    return uniqueDays.size;
  };

  const getMealIcon = (category: MealCategory) => {
    switch(category) {
      case "Breakfast": return "☀️";
      case "Lunch": return "🌤️";
      case "Dinner": return "🌙";
      default: return "🍽️";
    }
  };

  const getMealName = (meal: MenuItemWithPopulatedMeal['meal'] | string): string => {
    if (typeof meal === 'string') return 'Meal Item';
    return (meal as Meal)?.name || 'Meal Item';
  };

  const getMealDescription = (meal: MenuItemWithPopulatedMeal['meal'] | string): string | undefined => {
    if (typeof meal === 'object' && (meal as Meal)?.description) {
      return (meal as Meal).description;
    }
    return undefined;
  };

  const getMealImage = (meal: MenuItemWithPopulatedMeal['meal'] | string): string => {
    if (typeof meal === 'object' && (meal as Meal)?.image) {
      return (meal as Meal).image;
    }
    return '/public/defaults/default-meal.jpg';
  };

  return (
    <div className="w-full py-4 md:py-6">
      {/* Minimal Header - Reduced sizes */}
      <div className="text-center mb-6 md:mb-8 px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">Select Your Menu</h2>
        <p className="text-xs md:text-sm text-gray-500">Choose your weekly meal plan</p>
      </div>

      {menus.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 md:py-16 text-gray-400">
          <span className="text-3xl md:text-4xl mb-2">📋</span>
          <p className="text-xs md:text-sm">No menus available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 px-4">
          {menus.map((menu) => {
            const isSelected = selectedMenu?._id === menu._id;
            const totalDays = getTotalDays(menu);
            
            return (
              <Dialog key={menu._id}>
                {/* Floating Card Container - Reduced scale */}
                <div
                  className={`
                    relative cursor-pointer group
                    transition-all duration-500 ease-out
                    ${isSelected ? 'scale-[1.03]' : 'hover:scale-[1.01]'}
                  `}
                  onClick={() => onMenuSelect(menu)}
                >
                  {/* Glow Effect Background - Smaller blur */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full blur-2xl opacity-60 animate-pulse" />
                  )}

                  {/* Floating Content */}
                  <div className="relative flex flex-col items-center">
                    
                    {/* Floating Image - Reduced sizes */}
                    <div className="relative mb-3 md:mb-4">
                      {menu.coverImage && (
                        <div className="relative w-40 h-40">
                          <Image
                            src={menu.coverImage}
                            alt={menu.name}
                            fill
                            className={`
                              object-contain rounded-full
                              transition-all duration-700 ease-out
                              filter
                              ${
                                isSelected 
                                  ? 'drop-shadow-2xl scale-110 rotate-6' 
                                  : 'drop-shadow-xl group-hover:drop-shadow-2xl group-hover:scale-105 group-hover:-rotate-3'
                              }
                            `}
                          />
                        </div>
                      )}

                      {/* Price Badge - Smaller on mobile */}
                      <div className="absolute bottom-1 md:bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1.5 md:px-4 md:py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg md:shadow-xl">
                        <span className="text-xs sm:text-sm md:text-base font-bold text-gray-900">
                          ₹{menu.perDayPrice}
                          <span className="text-[10px] sm:text-xs font-normal text-gray-600">/day</span>
                        </span>
                      </div>

                      {/* Selected Badge - Smaller */}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 z-20">
                          <div className="relative">
                            <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-60 animate-pulse" />
                            <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full p-1.5 md:p-2 shadow-xl">
                              <Check className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Text Content - Reduced sizes */}
                    <div className="text-center space-y-1 md:space-y-2 px-2 md:px-4 w-full">
                      {/* Title - Smaller font sizes */}
                      <h3
                        className={`
                          font-bold text-base sm:text-lg md:text-xl lg:text-2xl
                          transition-all duration-300
                          ${
                            isSelected
                              ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700'
                              : 'text-gray-800 group-hover:text-gray-900'
                          }
                        `}
                      >
                        {menu.name}
                      </h3>

                      {/* Meta Info - Smaller */}
                      <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs md:text-sm text-gray-500 pt-1">
                        <span>{totalDays} Days</span>
                        <span>•</span>
                        <span>{menu.menuItems.length} Meals</span>
                      </div>

                      {/* Action Buttons - Reduced padding and text */}
                      <div className="pt-2 md:pt-3 flex flex-col xs:flex-row gap-2 justify-center">
                        <button
                          onClick={() => onMenuSelect(menu)}
                          className={`
                            px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold
                            transition-all duration-300
                            ${
                              isSelected
                                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white shadow-md md:shadow-lg shadow-emerald-200'
                                : 'bg-transparent border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                            }
                          `}
                        >
                          {isSelected ? 'Selected ✓' : 'Select'}
                        </button>
                        
                        <DialogTrigger asChild>
                          <button className="px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all border-2 border-transparent hover:border-blue-200">
                            View
                          </button>
                        </DialogTrigger>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dialog */}
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                  <div className="sticky top-0 bg-white border-b p-3 md:p-4 lg:p-6 z-10">
                    <DialogHeader>
                      <DialogTitle className="text-base md:text-lg lg:text-xl font-bold">{menu.name}</DialogTitle>
                      <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2 text-[10px] md:text-xs lg:text-sm text-gray-600">
                        <span>₹{menu.perDayPrice}/day</span>
                        <span>•</span>
                        <span>{totalDays} days</span>
                        <span>•</span>
                        <span>{menu.menuItems.length} meals</span>
                      </div>
                    </DialogHeader>
                  </div>

                  <WeeklyCalendarView 
                    menu={menu} 
                    mealsByDay={getMealsByDay(menu)} 
                    getMealIcon={getMealIcon}
                    getMealName={getMealName}
                    getMealDescription={getMealDescription}
                    getMealImage={getMealImage}
                  />
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WeeklyCalendarView({ 
  menu, 
  mealsByDay, 
  getMealIcon,
  getMealName,
  getMealDescription,
  getMealImage
}: { 
  menu: MenuWithPopulatedMeals;
  mealsByDay: Record<DayOfWeek, Record<MealCategory, MenuItemWithPopulatedMeal | null>>;
  getMealIcon: (category: MealCategory) => string;
  getMealName: (meal: MenuItemWithPopulatedMeal['meal'] | string) => string;
  getMealDescription: (meal: MenuItemWithPopulatedMeal['meal'] | string) => string | undefined;
  getMealImage: (meal: MenuItemWithPopulatedMeal['meal'] | string) => string;
}) {
  const activeDays = DAYS_ORDER.filter(day => 
    Object.values(mealsByDay[day]).some(meal => meal !== null)
  );

  return (
    <div className="p-3 md:p-4 lg:p-6 space-y-3 md:space-y-4">
      {activeDays.map((day) => {
        const dayMeals = mealsByDay[day];
        const hasMeals = Object.values(dayMeals).some(meal => meal !== null);
        
        if (!hasMeals) return null;

        return (
          <div key={day} className="border rounded-lg overflow-hidden">
            {/* Day Header - Smaller */}
            <div className="bg-gray-50 px-3 md:px-4 py-2 border-b">
              <h4 className="font-semibold text-xs md:text-sm lg:text-base text-gray-900">{day}</h4>
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x">
              {MEAL_CATEGORIES.map((category) => {
                const mealItem = dayMeals[category];
                const mealName = mealItem ? getMealName(mealItem.meal) : null;
                const mealDesc = mealItem ? getMealDescription(mealItem.meal) : null;
                const mealImage = mealItem ? getMealImage(mealItem.meal) : null;
                
                return (
                  <div key={category} className="p-2.5 md:p-3 lg:p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-lg md:text-xl lg:text-2xl flex-shrink-0">{getMealIcon(category)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] md:text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 md:mb-2">
                          {category}
                        </p>
                        {mealItem ? (
                          <>
                            {mealImage && (
                              <div className="relative w-full h-16 md:h-20 lg:h-24 mb-1.5 md:mb-2 rounded-md overflow-hidden bg-gray-100">
                                <Image
                                  src={mealImage}
                                  alt={mealName || 'Meal'}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                              </div>
                            )}
                            <p className="text-[10px] md:text-xs lg:text-sm font-semibold text-gray-900 mb-0.5 md:mb-1 line-clamp-1">
                              {mealName}
                            </p>
                            {mealDesc && (
                              <p className="text-[9px] md:text-[10px] lg:text-xs text-gray-600 line-clamp-2">
                                {mealDesc}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-[10px] md:text-xs text-gray-400">Not scheduled</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
