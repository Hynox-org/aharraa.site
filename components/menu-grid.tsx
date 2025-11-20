import React, { useState } from "react"
import { Menu, MenuItem, MealCategory, DayOfWeek, Meal, MenuItemWithPopulatedMeal, MenuWithPopulatedMeals } from "@/lib/types" // Updated imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Check, Calendar, UtensilsCrossed } from "lucide-react"

interface MenuGridProps {
  menus: MenuWithPopulatedMeals[];
  selectedMenu: MenuWithPopulatedMeals | null;
  onMenuSelect: (menu: MenuWithPopulatedMeals) => void;
}

const DAYS_ORDER: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_CATEGORIES: MealCategory[] = ["Breakfast", "Lunch", "Dinner"];

export function MenuGrid({ menus, selectedMenu, onMenuSelect }: MenuGridProps) {
  const getMealsByDay = (menu: MenuWithPopulatedMeals) => { // Changed type to MenuWithPopulatedMeals
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

  const getTotalDays = (menu: MenuWithPopulatedMeals) => { // Changed type to MenuWithPopulatedMeals
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

  // Helper to get meal name from either string ID or populated object
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
    return '/public/defaults/default-meal.jpg'; // Default image path
  };

  return (
    <Card className="w-full border-none shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">Select a Menu Plan</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a weekly menu that fits your preferences
        </p>
      </CardHeader>
      <CardContent>
        {menus.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-center text-gray-500 text-sm">
              No menus available for this vendor.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {menus.map((menu) => {
              const isSelected = selectedMenu?._id === menu._id;
              const totalDays = getTotalDays(menu);
              
              return (
                <Dialog key={menu._id}>
                  <div
                    className={`
                      relative group rounded-lg border-2 overflow-hidden
                      transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
                      ${isSelected 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10">
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>
                    )}

                    {menu.coverImage && (
                      <div className="relative w-full h-36 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        <Image
                          src={menu.coverImage}
                          alt={menu.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-white rounded-full shadow-md">
                          <span className="text-sm font-bold text-gray-900">₹{menu.perDayPrice}/day</span>
                        </div>
                      </div>
                    )}

                    <div className="p-4">
                      <div className="mb-3">
                        <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-1">
                          {menu.name}
                        </h3>
                        {menu.description && (
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {menu.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge variant="secondary" className="text-xs font-normal">
                          <Calendar className="w-3 h-3 mr-1" />
                          {totalDays} Days
                        </Badge>
                        <Badge variant="secondary" className="text-xs font-normal">
                          <UtensilsCrossed className="w-3 h-3 mr-1" />
                          {menu.menuItems.length} Meals
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onMenuSelect(menu)}
                          className={`
                            flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
                            ${isSelected 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            }
                          `}
                        >
                          {isSelected ? 'Selected' : 'Select Menu'}
                        </button>
                        
                        <DialogTrigger asChild>
                          <button className="px-3 py-2 rounded-md text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span className="hidden sm:inline">View</span>
                          </button>
                        </DialogTrigger>
                      </div>
                    </div>

                    <div className={`
                      absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 
                      group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
                      ${isSelected ? 'opacity-100' : ''}
                    `} />
                  </div>

                  <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        {menu.name} - Weekly Meal Plan
                      </DialogTitle>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className="text-xs">
                          ₹{menu.perDayPrice} per day
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {totalDays} days • {menu.menuItems.length} meals
                        </Badge>
                      </div>
                    </DialogHeader>

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
      </CardContent>
    </Card>
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
  menu: MenuWithPopulatedMeals; // Changed type to MenuWithPopulatedMeals
  mealsByDay: Record<DayOfWeek, Record<MealCategory, MenuItemWithPopulatedMeal | null>>;
  getMealIcon: (category: MealCategory) => string;
  getMealName: (meal: MenuItemWithPopulatedMeal['meal'] | string) => string; // Changed type
  getMealDescription: (meal: MenuItemWithPopulatedMeal['meal'] | string) => string | undefined; // Changed type
  getMealImage: (meal: MenuItemWithPopulatedMeal['meal'] | string) => string; // Changed type
}) {
  const activeDays = DAYS_ORDER.filter(day => 
    Object.values(mealsByDay[day]).some(meal => meal !== null)
  );

  return (
    <div className="mt-4">
      <div className="space-y-3">
        {activeDays.map((day) => {
          const dayMeals = mealsByDay[day];
          const hasMeals = Object.values(dayMeals).some(meal => meal !== null);
          
          if (!hasMeals) return null;

          return (
            <div key={day} className="border rounded-lg overflow-hidden bg-white">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2.5 border-b">
                <h4 className="font-semibold text-sm text-gray-900">{day}</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                {MEAL_CATEGORIES.map((category) => {
                  const mealItem = dayMeals[category];
                  const mealName = mealItem ? getMealName(mealItem.meal) : null;
                  const mealDesc = mealItem ? getMealDescription(mealItem.meal) : null;
                  const mealImage = mealItem ? getMealImage(mealItem.meal) : null;
                  
                  return (
                    <div key={category} className="p-4 hover:bg-gray-50 transition-colors min-h-[100px]">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{getMealIcon(category)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            {category}
                          </p>
                          {mealItem ? (
                            <>
                              {mealImage && (
                                <div className="relative w-full h-24 mb-2 overflow-hidden rounded-md">
                                  <Image
                                    src={mealImage}
                                    alt={mealName || 'Meal image'}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                </div>
                              )}
                              <p className="text-sm text-gray-900 font-semibold mb-1">
                                {mealName}
                              </p>
                              {mealDesc && (
                                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                  {mealDesc}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-xs text-gray-400 italic">Not scheduled</p>
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

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <UtensilsCrossed className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-semibold text-gray-900 mb-1">Weekly Plan Summary</h5>
            <p className="text-xs text-gray-600 leading-relaxed">
              This menu includes {menu.menuItems.length} carefully planned meals across {activeDays.length} days. 
              Daily cost: <span className="font-semibold">₹{menu.perDayPrice}</span> • 
              Weekly total: <span className="font-semibold">₹{menu.perDayPrice * activeDays.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
