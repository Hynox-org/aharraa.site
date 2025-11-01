"use client"

import { Review } from "@/lib/types"
import { IoStarSharp } from "react-icons/io5"
import { FaQuoteLeft } from "react-icons/fa"
import { HiSparkles } from "react-icons/hi2"

const reviews: Review[] = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Working Professional",
    content:
      "Aharraa has completely transformed my daily routine. Fresh, delicious meals delivered right to my door. Highly recommended!",
    rating: 5,
    avatar: "👩‍💼",
    gradient: "from-[#606C38] to-[#283618]"
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Fitness Enthusiast",
    content:
      "The nutritional balance and taste are exceptional. I've been using Aharraa for 3 months and never looked back.",
    rating: 5,
    avatar: "👨‍🏫",
    gradient: "from-[#DDA15E] to-[#BC6C25]"
  },
  {
    id: 3,
    name: "Anjali Patel",
    role: "Busy Mom",
    content:
      "Finally, a service that understands quality and convenience. My family loves the variety and freshness of meals.",
    rating: 5,
    avatar: "👩‍🍳",
    gradient: "from-[#BC6C25] to-[#606C38]"
  },
]

export function ReviewsSection() {
  return (
    <section className="py-20 my-16 animate-fade-in-up relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#606C38] opacity-5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#BC6C25] opacity-5 rounded-full filter blur-3xl"></div>
      </div>

      {/* Decorative Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle, rgba(96, 108, 56, 0.8) 1px, transparent 1px)`,
        backgroundSize: '32px 32px'
      }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FEFAE0] to-white rounded-full px-6 py-3 mb-6 border-2 border-[#DDA15E] border-opacity-20 shadow-lg">
            <HiSparkles className="w-5 h-5 text-[#BC6C25] animate-pulse" />
            <span className="text-sm font-bold text-[#283618]">Trusted by Thousands</span>
            <HiSparkles className="w-5 h-5 text-[#BC6C25] animate-pulse" />
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-[#283618] mb-6">
            What Our Customers
            <span className="block mt-2 bg-gradient-to-r from-[#606C38] via-[#DDA15E] to-[#BC6C25] bg-clip-text text-transparent">
              Say About Us
            </span>
          </h2>

          {/* Underline Decoration */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-[#BC6C25] rounded-full"></div>
            <div className="w-4 h-4 bg-gradient-to-br from-[#DDA15E] to-[#BC6C25] rounded-full"></div>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-[#BC6C25] rounded-full"></div>
          </div>

          <p className="text-lg text-[#606C38] max-w-2xl mx-auto">
            Join thousands of satisfied customers enjoying fresh, home-cooked meals delivered with love
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="group relative animate-scale-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Gradient Border Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${review.gradient} rounded-3xl opacity-0 group-hover:opacity-75 blur transition-all duration-500`}></div>
              
              {/* Card Content */}
              <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 border-2 border-[#FEFAE0] overflow-hidden">
                {/* Top Decorative Wave */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#606C38] via-[#DDA15E] to-[#BC6C25]"></div>

                {/* Quote Icon */}
                <div className={`absolute top-6 right-6 w-12 h-12 bg-gradient-to-br ${review.gradient} rounded-full flex items-center justify-center shadow-lg opacity-10 group-hover:opacity-20 transition-opacity duration-300`}>
                  <FaQuoteLeft className="w-6 h-6 text-[#FEFAE0]" />
                </div>

                {/* Avatar & Info */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  {/* Avatar with Gradient Border */}
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${review.gradient} p-0.5 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <div className="w-full h-full bg-[#FEFAE0] rounded-2xl flex items-center justify-center text-3xl">
                      {review.avatar}
                    </div>
                  </div>

                  {/* Name & Role */}
                  <div>
                    <h3 className="font-bold text-lg text-[#283618] group-hover:text-[#606C38] transition-colors duration-300">
                      {review.name}
                    </h3>
                    <p className="text-sm text-[#606C38] opacity-80">{review.role}</p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <div key={i} className="transform group-hover:scale-125 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                      <IoStarSharp className="w-5 h-5 text-[#DDA15E] drop-shadow-sm" />
                    </div>
                  ))}
                </div>

                {/* Review Content */}
                <p className="text-[#283618] leading-relaxed relative z-10">
                  "{review.content}"
                </p>

                {/* Bottom Decorative Element */}
                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                  <div className={`w-full h-full bg-gradient-to-br ${review.gradient} rounded-tl-full`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { number: "5000+", label: "Happy Customers", icon: "😊" },
            { number: "50,000+", label: "Meals Delivered", icon: "🍽️" },
            { number: "4.9/5", label: "Average Rating", icon: "⭐" }
          ].map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-[#FEFAE0] to-white rounded-2xl p-6 text-center border-2 border-[#606C38] border-opacity-10 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-[#606C38] to-[#BC6C25] bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-sm font-semibold text-[#606C38]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}