"use client"

import { HiSparkles, HiArrowTrendingUp } from "react-icons/hi2"
import { IoStatsChart, IoLeaf } from "react-icons/io5"
import { MdDeliveryDining } from "react-icons/md"
import { FaAward, FaUsers } from "react-icons/fa"

export function PricingHeroSection() {
  return (
    <div className="relative py-20 overflow-hidden bg-gradient-to-br from-[#283618] via-[#606C38] to-[#283618]">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#DDA15E] opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#BC6C25] opacity-15 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FEFAE0] opacity-5 rounded-full filter blur-3xl"></div>
      </div>

      {/* Decorative Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, rgba(254, 250, 224, 0.8) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Floating Shapes */}
      <div className="absolute top-16 left-16 w-4 h-4 bg-[#DDA15E] rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-32 right-20 w-6 h-6 bg-[#BC6C25] rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-20 left-1/3 w-3 h-3 bg-[#FEFAE0] rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FEFAE0] to-white rounded-full px-8 py-4 mb-8 border-2 border-[#DDA15E] border-opacity-30 shadow-xl backdrop-blur-sm">
            <FaAward className="w-6 h-6 text-[#BC6C25] animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-lg font-bold bg-gradient-to-r from-[#606C38] to-[#BC6C25] bg-clip-text text-transparent">
              Premium Meal Experience
            </span>
            <HiSparkles className="w-6 h-6 text-[#BC6C25] animate-pulse" />
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          {/* Main Heading with Gradient Effect */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="block text-[#FEFAE0] drop-shadow-2xl">
              Discover Your
            </span>
            <span className="block bg-gradient-to-r from-[#DDA15E] via-[#BC6C25] to-[#DDA15E] bg-clip-text text-transparent animate-pulse">
              Perfect Meal
            </span>
          </h1>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#DDA15E] to-transparent rounded-full"></div>
            <IoLeaf className="w-8 h-8 text-[#FEFAE0] animate-spin" style={{ animationDuration: '4s' }} />
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#DDA15E] to-transparent rounded-full"></div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-[#FEFAE0] leading-relaxed font-medium opacity-90">
            Browse by category, explore nutritional details, and customize your subscription
            <span className="block mt-2 text-lg text-[#DDA15E]">
              with locally-sourced, fresh ingredients delivered daily
            </span>
          </p>
        </div>

        {/* Stats/Features Row */}
        <div className="flex items-center justify-center gap-6 flex-wrap mb-8">
          {/* Stat 1 */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#DDA15E] to-[#BC6C25] rounded-2xl opacity-0 group-hover:opacity-75 blur transition-all duration-500"></div>
            <div className="relative flex items-center gap-3 bg-gradient-to-r from-[#FEFAE0] to-white rounded-2xl px-6 py-4 shadow-xl backdrop-blur-sm border border-[#DDA15E] border-opacity-20 transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#606C38] to-[#283618] flex items-center justify-center shadow-lg">
                <HiArrowTrendingUp className="w-6 h-6 text-[#FEFAE0] animate-bounce" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#283618]">10,000+</div>
                <div className="text-sm font-medium text-[#606C38]">Meals Delivered</div>
              </div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#606C38] to-[#DDA15E] rounded-2xl opacity-0 group-hover:opacity-75 blur transition-all duration-500"></div>
            <div className="relative flex items-center gap-3 bg-gradient-to-r from-[#FEFAE0] to-white rounded-2xl px-6 py-4 shadow-xl backdrop-blur-sm border border-[#DDA15E] border-opacity-20 transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#DDA15E] to-[#BC6C25] flex items-center justify-center shadow-lg">
                <HiSparkles className="w-6 h-6 text-[#FEFAE0] animate-pulse" />
              </div>
              <div>
                <div className="text-2xl font-black text-[#283618]">Fresh</div>
                <div className="text-sm font-medium text-[#606C38]">Daily Preparation</div>
              </div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#BC6C25] to-[#606C38] rounded-2xl opacity-0 group-hover:opacity-75 blur transition-all duration-500"></div>
            <div className="relative flex items-center gap-3 bg-gradient-to-r from-[#FEFAE0] to-white rounded-2xl px-6 py-4 shadow-xl backdrop-blur-sm border border-[#DDA15E] border-opacity-20 transform hover:scale-105 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#BC6C25] to-[#283618] flex items-center justify-center shadow-lg">
                <FaUsers className="w-6 h-6 text-[#FEFAE0] animate-bounce" style={{ animationDelay: '0.5s' }} />
              </div>
              <div>
                <div className="text-2xl font-black text-[#283618]">5000+</div>
                <div className="text-sm font-medium text-[#606C38]">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Features */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* Feature 1 */}
          <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#FEFAE0] to-white border border-[#DDA15E] border-opacity-30 shadow-lg backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <MdDeliveryDining className="w-5 h-5 text-[#BC6C25] animate-bounce" />
            <span className="text-sm font-bold text-[#283618]">2-Hour Delivery</span>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#FEFAE0] to-white border border-[#DDA15E] border-opacity-30 shadow-lg backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <IoLeaf className="w-5 h-5 text-[#606C38] animate-pulse" />
            <span className="text-sm font-bold text-[#283618]">Organic Ingredients</span>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#FEFAE0] to-white border border-[#DDA15E] border-opacity-30 shadow-lg backdrop-blur-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <IoStatsChart className="w-5 h-5 text-[#DDA15E] animate-bounce" style={{ animationDelay: '0.3s' }} />
            <span className="text-sm font-bold text-[#283618]">Nutrition Tracking</span>
          </div>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="relative block w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            fill="rgba(254, 250, 224, 0.1)"
          />
        </svg>
      </div>
    </div>
  )
}