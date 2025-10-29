'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Leaf } from 'lucide-react';
import { MenuSelectionProps } from '@/lib/types';


export function MenuSelectionTimeline({ weeklyMenu }: MenuSelectionProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [activeMeal, setActiveMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');

  const sortedDays = Object.entries(weeklyMenu).sort(
    ([, a], [, b]) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const toggleDay = (dayKey: string) => {
    setExpandedDay(expandedDay === dayKey ? null : dayKey);
  };

  return (
    <div className="w-full rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-6 text-gray-900">Weekly Menu</h2>
      
      {/* Timeline Container */}
      <div className="space-y-3">
        {sortedDays.map(([dayKey, dayData], index) => {
          const isExpanded = expandedDay === dayKey;
          const dayDate = new Date(dayData.date);
          const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' });
          const dateStr = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <div key={dayKey} className="relative">
              {/* Timeline Line */}
              {index !== sortedDays.length - 1 && (
                <div className="absolute left-6 top-14 w-0.5 h-full bg-gray-200 -z-10" />
              )}

              {/* Day Card */}
              <div
                className={`border rounded-lg transition-all duration-300 ${
                  isExpanded
                    ? 'border-indigo-400 bg-indigo-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {/* Day Header */}
                <button
                  onClick={() => toggleDay(dayKey)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <div className="flex items-center space-x-4">
                    {/* Timeline Dot */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                        isExpanded
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {dayDate.getDate()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{dayName}</p>
                      <p className="text-sm text-gray-500">{dateStr}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-indigo-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2">
                    {/* Meal Tabs */}
                    <div className="flex space-x-2 mb-4 bg-white rounded-lg p-1 border border-gray-200">
                      {(['breakfast', 'lunch', 'dinner'] as const).map((meal) => (
                        <button
                          key={meal}
                          onClick={() => setActiveMeal(meal)}
                          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all capitalize ${
                            activeMeal === meal
                              ? 'bg-indigo-500 text-white shadow-sm'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {meal}
                        </button>
                      ))}
                    </div>

                    {/* Meal Items */}
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="space-y-2">
                        {(dayData.meals[activeMeal] ?? []).map((meal) => (
                          <div
                            key={meal.id}
                            className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-gray-800">{meal.name}</span>
                            {meal.isVegetarian && (
                              <div className="flex items-center space-x-1 text-green-600">
                                <Leaf className="w-4 h-4" />
                                <span className="text-xs font-medium">Veg</span>
                              </div>
                            )}
                          </div>
                        ))}
                        {(dayData.meals[activeMeal] ?? []).length === 0 && (
                          <p className="text-gray-400 text-sm text-center py-2">No items</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
