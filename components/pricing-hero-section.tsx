"use client"

import { HiArrowTrendingUp } from "react-icons/hi2"
import { MdDeliveryDining } from "react-icons/md"
import { IoLeaf } from "react-icons/io5"

export function PricingHeroSection() {
  return (
    <section className="relative py-16 bg-gradient-to-b from-[#f9fafb] to-white overflow-hidden">
      <div className="max-w-3xl mx-auto text-center px-4">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-[#283618]">
          Perfect Meal. Delivered.
        </h1>
        <p className="text-lg text-[#606C38] mb-8">Daily-fresh, locally sourced food at your door.</p>
        
        {/* Core Stat */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="flex items-center gap-2 bg-[#FEFAE0] px-4 py-2 rounded-full text-[#BC6C25] font-medium shadow">
            <HiArrowTrendingUp className="w-5 h-5" />
            10,000+ Meals Delivered
          </span>
        </div>

        {/* Features Row */}
        <div className="flex justify-center gap-4 flex-wrap">
          <Feature icon={<MdDeliveryDining className="w-5 h-5 text-[#BC6C25]" />} label="2-Hour Delivery" />
          <Feature icon={<IoLeaf className="w-5 h-5 text-[#606C38]" />} label="Organic" />
        </div>
      </div>
    </section>
  )
}

function Feature({ icon, label } : any) {
  return (
    <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#ede7ce] shadow text-sm text-[#283618]">
      {icon}
      {label}
    </span>
  )
}
