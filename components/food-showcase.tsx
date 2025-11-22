"use client"

import { Highlight } from "@/lib/types"
import { GiChefToque, GiFruitBowl, GiCheckMark } from "react-icons/gi"
import { MdDeliveryDining } from "react-icons/md"
import { IoSparkles, IoArrowForward } from "react-icons/io5"

const highlights: Highlight[] = [
  {
    icon: "🥗",
    title: "Fresh Ingredients",
    description: "Locally-sourced, organic ingredients prepared daily",
    iconComponent: GiFruitBowl,
    gradient: "from-[#3CB371] to-[#2FA05E]"
  },
  {
    icon: "👨‍🍳",
    title: "Expert Chefs",
    description: "Home chefs with years of culinary experience",
    iconComponent: GiChefToque,
    gradient: "from-[#3CB371] to-[#2FA05E]"
  },
  {
    icon: "🚚",
    title: "Quick Delivery",
    description: "Hot meals delivered within 2 hours of preparation",
    iconComponent: MdDeliveryDining,
    gradient: "from-[#3CB371] to-[#2FA05E]"
  },
  {
    icon: "⭐",
    title: "Quality Assured",
    description: "Every meal meets our strict quality standards",
    iconComponent: GiCheckMark,
    gradient: "from-[#3CB371] to-[#2FA05E]"
  },
]

export function FoodShowcase() {
  return (
    <section className="py-16 md:py-20 my-12 md:my-16 relative overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#3CB371] opacity-5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#3CB371] opacity-5 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Section */}
          <div className="flex justify-center animate-slide-in-left">
            <div className="relative w-full max-w-md">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[#3CB371] rounded-3xl blur-2xl opacity-10"></div>
              
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100">
                {/* Food Image Container */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-white rounded-2xl flex items-center justify-center overflow-hidden group">
                  {/* Image */}
                  <img 
                    src="/home_page_cover2.png" 
                    alt="Delicious food showcase" 
                    className="relative z-10 w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500 rounded-2xl"
                  />
                </div>
              </div>

              {/* Floating Badge - Fresh Daily */}
              <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-[#3CB371] text-white px-4 py-2 md:px-6 md:py-3 rounded-2xl font-bold shadow-xl transform hover:scale-110 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <IoSparkles className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
                  <span className="text-sm md:text-base">Fresh Daily</span>
                </div>
              </div>

              {/* Floating Badge - 100% Homemade */}
              <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-black text-white px-4 py-2 md:px-6 md:py-3 rounded-2xl font-bold shadow-xl transform hover:scale-110 transition-all duration-300">
                <div className="flex items-center gap-2">
                  <GiCheckMark className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm md:text-base">100% Homemade</span>
                </div>
              </div>
            </div>
          </div>

          {/* Highlights Section */}
          <div className="animate-slide-in-right">
            {/* Section Header */}
            <div className="mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mb-4">
                <IoSparkles className="w-4 h-4 text-[#3CB371]" />
                <span className="text-sm font-semibold text-black">Our Promise</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-3 md:mb-4">
                Why Choose 
                <span className="block mt-2 text-[#3CB371]">
                  Aharraa?
                </span>
              </h2>
              <div className="w-16 md:w-20 h-1 bg-[#3CB371] rounded-full"></div>
            </div>

            {/* Highlights Grid */}
            <div className="space-y-4 md:space-y-5">
              {highlights.map((highlight, index) => {
                const IconComponent = highlight.iconComponent
                return (
                  <div
                    key={index}
                    className="group flex gap-4 md:gap-5 p-4 md:p-6 rounded-xl md:rounded-2xl bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {/* Icon Container */}
                    <div className={`relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${highlight.gradient} rounded-xl md:rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <IconComponent className="w-7 h-7 md:w-8 md:h-8 text-white" />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base md:text-lg text-black mb-1 md:mb-2 group-hover:text-gray-700 transition-colors duration-300">
                        {highlight.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>

                    {/* Hover Arrow Indicator */}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                      <IoArrowForward className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom CTA */}
            <div className="mt-8 md:mt-10 p-5 md:p-6 bg-[#3CB371] rounded-2xl shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-white font-bold text-base md:text-lg mb-1">Ready to experience the difference?</p>
                  <p className="text-white text-sm opacity-90">Join hundreds of satisfied customers today</p>
                </div>
                <button className="w-full sm:w-auto bg-white text-black px-5 md:px-6 py-2.5 md:py-3 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-2">
                  Order Now
                  <IoArrowForward className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
