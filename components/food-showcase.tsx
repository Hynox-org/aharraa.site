"use client"

import { Highlight } from "@/lib/types"
import { GiChefToque, GiFruitBowl, GiCheckMark } from "react-icons/gi"
import { MdDeliveryDining } from "react-icons/md"
import { IoSparkles } from "react-icons/io5"

const highlights: Highlight[] = [
  {
    icon: "🥗",
    title: "Fresh Ingredients",
    description: "Locally-sourced, organic ingredients prepared daily",
    iconComponent: GiFruitBowl,
    gradient: "from-[#606C38] to-[#283618]"
  },
  {
    icon: "👨‍🍳",
    title: "Expert Chefs",
    description: "Home chefs with years of culinary experience",
    iconComponent: GiChefToque,
    gradient: "from-[#DDA15E] to-[#BC6C25]"
  },
  {
    icon: "🚚",
    title: "Quick Delivery",
    description: "Hot meals delivered within 2 hours of preparation",
    iconComponent: MdDeliveryDining,
    gradient: "from-[#BC6C25] to-[#DDA15E]"
  },
  {
    icon: "⭐",
    title: "Quality Assured",
    description: "Every meal meets our strict quality standards",
    iconComponent: GiCheckMark,
    gradient: "from-[#606C38] to-[#DDA15E]"
  },
]

export function FoodShowcase() {
  return (
    <section className="py-20 my-16 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#DDA15E] opacity-10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#606C38] opacity-10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Section */}
          <div className="flex justify-center animate-slide-in-left">
            <div className="relative w-full max-w-md">
              {/* Main Card with Gradient Border */}
              <div className="relative">
                {/* Gradient Border Effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-[#606C38] via-[#DDA15E] to-[#BC6C25] rounded-3xl opacity-75 blur-sm"></div>
                
                {/* Inner Content */}
                <div className="relative bg-gradient-to-br from-[#FEFAE0] to-white rounded-3xl p-8 shadow-2xl">
                  {/* Decorative Pattern */}
                  <div className="absolute inset-0 opacity-5 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle, rgba(96, 108, 56, 0.4) 1px, transparent 1px)`,
                      backgroundSize: '24px 24px'
                    }}></div>
                  </div>

                  {/* Food Image Container */}
                  <div className="relative aspect-square bg-gradient-to-br from-[#DDA15E] via-[#BC6C25] to-[#606C38] rounded-2xl flex items-center justify-center shadow-lg overflow-hidden group">
                    {/* Animated Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full"></div>
                    
                    {/* Food Emoji */}
                    <div className="relative z-10 text-9xl transform group-hover:scale-110 transition-transform duration-500 filter drop-shadow-2xl">
                      🍽️
                    </div>

                    {/* Decorative Corner Elements */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#FEFAE0] opacity-50 rounded-tl-lg"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#FEFAE0] opacity-50 rounded-br-lg"></div>
                  </div>
                </div>
              </div>

              {/* Floating Badge - Fresh Daily */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-[#606C38] to-[#283618] text-[#FEFAE0] px-6 py-3 rounded-2xl font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-[#FEFAE0] border-opacity-20">
                <div className="flex items-center gap-2">
                  <IoSparkles className="w-5 h-5 animate-pulse" />
                  <span>Fresh Daily</span>
                </div>
              </div>

              {/* Floating Badge - 100% Homemade */}
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-[#DDA15E] to-[#BC6C25] text-[#283618] px-6 py-3 rounded-2xl font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-[#283618] border-opacity-10">
                <div className="flex items-center gap-2">
                  <GiCheckMark className="w-5 h-5" />
                  <span>100% Homemade</span>
                </div>
              </div>

              {/* Decorative Circle Elements */}
              <div className="absolute top-1/2 -left-4 w-8 h-8 bg-[#BC6C25] rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute top-1/3 -right-4 w-6 h-6 bg-[#606C38] rounded-full opacity-20 animate-pulse delay-300"></div>
            </div>
          </div>

          {/* Highlights Section */}
          <div className="animate-slide-in-right">
            {/* Section Header */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#606C38] to-[#283618] bg-opacity-10 rounded-full px-4 py-2 mb-4">
                <IoSparkles className="w-4 h-4 text-[#BC6C25]" />
                <span className="text-sm font-semibold text-[#283618]">Our Promise</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#283618] mb-4">
                Why Choose 
                <span className="block mt-2 bg-gradient-to-r from-[#606C38] via-[#DDA15E] to-[#BC6C25] bg-clip-text text-transparent">
                  Aharraa?
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#BC6C25] to-[#DDA15E] rounded-full"></div>
            </div>

            {/* Highlights Grid */}
            <div className="space-y-5">
              {highlights.map((highlight, index) => {
                const IconComponent = highlight.iconComponent
                return (
                  <div
                    key={index}
                    className="group flex gap-5 p-6 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-[#FEFAE0] hover:to-white transition-all duration-300 border-2 border-[#606C38] border-opacity-0 hover:border-opacity-20 shadow-sm hover:shadow-xl transform hover:-translate-y-1 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    {/* Icon Container */}
                    <div className={`relative flex-shrink-0 w-16 h-16 bg-gradient-to-br ${highlight.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <IconComponent className="w-8 h-8 text-[#FEFAE0]" />
                      {/* Icon Glow Effect */}
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300"></div>
                    </div>

                    {/* Text Content */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-[#283618] mb-2 group-hover:text-[#606C38] transition-colors duration-300">
                        {highlight.title}
                      </h3>
                      <p className="text-[#606C38] leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>

                    {/* Hover Arrow Indicator */}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                      <svg className="w-5 h-5 text-[#BC6C25]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 p-6 bg-gradient-to-br from-[#606C38] to-[#283618] rounded-2xl shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#FEFAE0] font-bold text-lg mb-1">Ready to experience the difference?</p>
                  <p className="text-[#FEFAE0] text-sm opacity-90">Join hundreds of satisfied customers today</p>
                </div>
                <button className="bg-gradient-to-r from-[#DDA15E] to-[#BC6C25] text-[#283618] px-6 py-3 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 whitespace-nowrap">
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(221, 161, 94, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(188, 108, 37, 0.8);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </section>
  )
}