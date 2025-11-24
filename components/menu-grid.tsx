import React from "react"
import { Menu, MenuItem, MealCategory, DayOfWeek, Meal, MenuItemWithPopulatedMeal, MenuWithPopulatedMeals } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import Image from "next/image"
import { Check, Eye, X } from "lucide-react"
import { IoSunnyOutline, IoPartlySunnyOutline, IoMoonOutline, IoRestaurantOutline } from "react-icons/io5"

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
      case "Breakfast": return IoSunnyOutline;
      case "Lunch": return IoPartlySunnyOutline;
      case "Dinner": return IoMoonOutline;
      default: return IoRestaurantOutline;
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
    <div className="w-full py-3 md:py-6">
      <div className="text-center mb-4 md:mb-8 px-2 md:px-4">
        <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-black mb-1">Select Your Menu</h2>
        <p className="text-xs md:text-sm text-gray-500">Choose your weekly meal plan</p>
      </div>

      {menus.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 md:py-16 text-gray-400">
          <IoRestaurantOutline className="w-12 h-12 md:w-16 md:h-16 mb-2" />
          <p className="text-xs md:text-sm">No menus available</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 lg:gap-10 px-2 md:px-4">
          {menus.map((menu) => {
            const isSelected = selectedMenu?._id === menu._id;
            const totalDays = getTotalDays(menu);
            
            return (
              <Dialog key={menu._id}>
                <div
                  className={`
                    relative cursor-pointer group
                    transition-all duration-500 ease-out
                    ${isSelected ? 'scale-[1.02] md:scale-[1.03]' : 'hover:scale-[1.01]'}
                  `}
                  onClick={() => onMenuSelect(menu)}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#3CB371] opacity-20 rounded-full blur-xl md:blur-2xl animate-pulse" />
                  )}

                  <div className="relative flex flex-col items-center">
                    <div className="relative mb-2 md:mb-4">
                      {menu.coverImage && (
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40">
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
                                  ? 'drop-shadow-xl md:drop-shadow-2xl scale-105 md:scale-110 rotate-3 md:rotate-6' 
                                  : 'drop-shadow-lg md:drop-shadow-xl group-hover:drop-shadow-xl md:group-hover:drop-shadow-2xl group-hover:scale-105 group-hover:-rotate-2 md:group-hover:-rotate-3'
                              }
                            `}
                          />
                        </div>
                      )}

                      <div className="absolute bottom-0 md:bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 md:px-4 md:py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-md md:shadow-xl">
                        <span className="text-[10px] sm:text-xs md:text-base font-bold text-black">
                          ₹{menu.perDayPrice}
                          <span className="text-[8px] sm:text-[10px] md:text-xs font-normal text-gray-600">/day</span>
                        </span>
                      </div>

                      {isSelected && (
                        <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 z-20">
                          <div className="relative">
                            <div className="absolute inset-0 bg-[#3CB371] rounded-full blur-sm md:blur-md opacity-60 animate-pulse" />
                            <div className="relative bg-[#3CB371] text-white rounded-full p-1 md:p-2 shadow-lg md:shadow-xl">
                              <Check className="w-3 h-3 md:w-5 md:h-5" strokeWidth={3} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-center space-y-0.5 md:space-y-2 px-1 md:px-4 w-full">
                      <h3
                        className={`
                          font-bold text-xs sm:text-sm md:text-xl lg:text-2xl
                          transition-all duration-300
                          ${
                            isSelected
                              ? 'text-[#3CB371]'
                              : 'text-gray-800 group-hover:text-black'
                          }
                        `}
                      >
                        {menu.name}
                      </h3>

                      <div className="flex items-center justify-center gap-1 md:gap-2 text-[8px] sm:text-[9px] md:text-sm text-gray-500">
                        <span>{totalDays} Days</span>
                        <span>•</span>
                        <span>{menu.menuItems.length} Meals</span>
                      </div>

                      <div className="pt-1 md:pt-3 flex flex-col gap-1 md:gap-2 justify-center">
                       <button
                          onClick={() => onMenuSelect(menu)}
                          className={`
                            px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold
                            transition-all duration-300
                            ${
                              isSelected
                                ? 'bg-[#3CB371] text-white shadow-md md:shadow-lg'
                                : 'bg-transparent border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                            }
                          `}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                        <DialogTrigger asChild>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 sm:px-3 md:px-6 py-1 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold bg-gray-100 text-black hover:bg-gray-200 transition-all border border-transparent hover:border-gray-300 md:border-2"
                          >
                            View
                          </button>
                        </DialogTrigger>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Redesigned Dialog with Floating Close Button */}
                <DialogContent className="w-full max-h-[90vh] overflow-hidden p-0 bg-white">
                  {/* Floating Close Button - Top Right Outside Header */}
                  <DialogClose className="absolute top-3 right-3 md:top-4 md:right-4 z-50 p-1.5 md:p-2.5 rounded-full bg-white shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 group">
                    <X className="w-4 h-4 md:w-6 md:h-6 text-gray-600 group-hover:text-black group-hover:rotate-90 transition-all duration-200" />
                    <span className="sr-only">Close</span>
                  </DialogClose>

                  {/* Sticky Header */}
                  <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b p-3 md:p-6 pr-12 md:pr-20 z-10 shadow-sm">
                    <DialogHeader>
                      <DialogTitle className="text-base md:text-2xl font-bold text-black">{menu.name}</DialogTitle>
                      <div className="flex items-center gap-1.5 md:gap-3 mt-2 flex-wrap">
                        <span className="px-2 md:px-3 py-0.5 md:py-1 bg-green-100 text-green-700 rounded-full text-[10px] md:text-sm font-semibold">
                          ₹{menu.perDayPrice}/day
                        </span>
                        <span className="px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] md:text-sm font-semibold">
                          {totalDays} days
                        </span>
                        <span className="px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 text-gray-700 rounded-full text-[10px] md:text-sm font-semibold">
                          {menu.menuItems.length} meals
                        </span>
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
  getMealIcon: (category: MealCategory) => React.ComponentType<any>;
  getMealName: (meal: MenuItemWithPopulatedMeal['meal'] | string) => string;
  getMealDescription: (meal: MenuItemWithPopulatedMeal['meal'] | string) => string | undefined;
  getMealImage: (meal: MenuItemWithPopulatedMeal['meal'] | string) => string;
}) {
  const activeDays = DAYS_ORDER.filter(day => 
    Object.values(mealsByDay[day]).some(meal => meal !== null)
  );

  return (
    <div className="overflow-y-auto max-h-[calc(90vh-100px)] md:max-h-[calc(90vh-120px)] p-3 md:p-6 w-full">
      <div className="space-y-3 md:space-y-6">
        {activeDays.map((day) => {
          const dayMeals = mealsByDay[day];
          const hasMeals = Object.values(dayMeals).some(meal => meal !== null);
          
          if (!hasMeals) return null;

          return (
            <div key={day} className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {/* Day Header */}
              <div className="relative bg-gray-50 px-3 md:px-6 py-2 md:py-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-[#3CB371] flex items-center justify-center shadow-md">
                    <span className="text-[10px] md:text-sm font-bold text-white">
                      {day.slice(0, 3)}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm md:text-lg text-black">{day}</h4>
                </div>
              </div>

              {/* Meals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 p-3 md:p-6">
                {MEAL_CATEGORIES.map((category) => {
                  const mealItem = dayMeals[category];
                  const mealName = mealItem ? getMealName(mealItem.meal) : null;
                  const mealDesc = mealItem ? getMealDescription(mealItem.meal) : null;
                  const mealImage = mealItem ? getMealImage(mealItem.meal) : null;
                  const MealIconComponent = getMealIcon(category);
                  
                  return (
                    <div key={category} className="relative group">
                      {mealItem ? (
                        <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-300">
                          {/* Meal Icon Badge */}
                          <div className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-8 h-8 md:w-12 md:h-12 rounded-full bg-white shadow-lg border-2 border-gray-100 flex items-center justify-center">
                            <MealIconComponent className="w-4 h-4 md:w-6 md:h-6 text-[#3CB371]" />
                          </div>

                          {/* Category */}
                          <p className="text-[9px] md:text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 md:mb-3">
                            {category}
                          </p>

                          {/* Meal Image */}
                          {mealImage && (
                            <div className="relative w-full h-24 md:h-40 mb-2 md:mb-3 rounded-md md:rounded-lg overflow-hidden bg-gray-100">
                              <Image
                                src={mealImage}
                                alt={mealName || 'Meal'}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              />
                            </div>
                          )}

                          {/* Meal Name */}
                          <h5 className="text-xs md:text-base font-bold text-black mb-1.5 md:mb-2 line-clamp-2">
                            {mealName}
                          </h5>

                          {/* Sub Products */}
                          {typeof mealItem.meal === 'object' && mealItem.meal.subProducts && mealItem.meal.subProducts.length > 0 && (
                            <div className="mt-1.5 md:mt-2 mb-2 md:mb-3">
                              <p className="text-[8px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 md:mb-1.5">Includes</p>
                              <div className="flex flex-wrap gap-1 md:gap-2">
                                {mealItem.meal.subProducts.map((subProduct, index) => (
                                  <span key={index} className="px-1.5 py-0.5 md:px-2 bg-gray-100 text-gray-700 rounded-full text-[8px] md:text-[10px] font-medium">
                                    {subProduct}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Nutritional Info */}
                          {typeof mealItem.meal === 'object' && mealItem.meal.nutritionalDetails && (
                            <div className="flex gap-1 md:gap-2 flex-wrap">
                              <span className="px-1.5 py-0.5 md:px-2 bg-green-50 text-green-700 rounded-full text-[8px] md:text-[10px] font-semibold">
                                {mealItem.meal.nutritionalDetails.protein}g P
                              </span>
                              <span className="px-1.5 py-0.5 md:px-2 bg-blue-50 text-blue-700 rounded-full text-[8px] md:text-[10px] font-semibold">
                                {mealItem.meal.nutritionalDetails.carbs}g C
                              </span>
                              <span className="px-1.5 py-0.5 md:px-2 bg-amber-50 text-amber-700 rounded-full text-[8px] md:text-[10px] font-semibold">
                                {mealItem.meal.nutritionalDetails.fats}g F
                              </span>
                              <span className="px-1.5 py-0.5 md:px-2 bg-purple-50 text-purple-700 rounded-full text-[8px] md:text-[10px] font-semibold">
                                {mealItem.meal.nutritionalDetails.calories} cal
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 border-dashed h-full flex flex-col items-center justify-center min-h-[140px] md:min-h-[240px]">
                          <MealIconComponent className="w-8 h-8 md:w-16 md:h-16 opacity-30 mb-1 md:mb-2 text-gray-400" />
                          <p className="text-[10px] md:text-sm text-gray-400 font-medium">{category}</p>
                          <p className="text-[8px] md:text-xs text-gray-400 mt-0.5 md:mt-1">Not scheduled</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
