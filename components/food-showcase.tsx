"use client"

interface Highlight {
  icon: string
  title: string
  description: string
}

const highlights: Highlight[] = [
  {
    icon: "🥗",
    title: "Fresh Ingredients",
    description: "Locally-sourced, organic ingredients prepared daily",
  },
  {
    icon: "👨‍🍳",
    title: "Expert Chefs",
    description: "Home chefs with years of culinary experience",
  },
  {
    icon: "🚚",
    title: "Quick Delivery",
    description: "Hot meals delivered within 2 hours of preparation",
  },
  {
    icon: "⭐",
    title: "Quality Assured",
    description: "Every meal meets our strict quality standards",
  },
]

export function FoodShowcase() {
  return (
    <section className="py-20 my-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className="flex justify-center animate-slide-in-left">
            <div className="relative w-full max-w-md">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-8 shadow-xl">
                <div className="aspect-square bg-orange-200 rounded-xl flex items-center justify-center text-9xl animate-pulse">
                  🍽️
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg animate-bounce">
                Fresh Daily
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg animate-pulse-glow">
                100% Homemade
              </div>
            </div>
          </div>

          {/* Highlights Section */}
          <div className="animate-slide-in-right">
            <h2 className="text-4xl font-bold text-neutral-900 mb-8">Why Choose Aharraa?</h2>

            <div className="space-y-6">
              {highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-lg bg-neutral-50 hover:bg-orange-50 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl flex-shrink-0">{highlight.icon}</div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">{highlight.title}</h3>
                    <p className="text-neutral-600">{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
