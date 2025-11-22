"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { IoHeart, IoLeaf, IoPeople, IoTrophy, IoArrowForward } from "react-icons/io5"
import { HiHome } from "react-icons/hi"

export default function AboutPage() {
  const values = [
    {
      icon: IoHeart,
      title: "Quality First",
      description: "We use only the freshest, locally-sourced ingredients in every meal we prepare.",
    },
    {
      icon: IoLeaf,
      title: "Sustainability",
      description: "Committed to eco-friendly practices and reducing our environmental footprint.",
    },
    {
      icon: IoPeople,
      title: "Community",
      description: "Supporting local farmers and building a strong community around healthy eating.",
    },
    {
      icon: IoTrophy,
      title: "Excellence",
      description: "Award-winning chefs dedicated to delivering exceptional culinary experiences.",
    },
  ]

  const team = [
    {
      name: "Priya Sharma",
      role: "Founder & Head Chef",
      bio: "15+ years of culinary experience with a passion for home-cooked meals.",
    },
    {
      name: "Rajesh Kumar",
      role: "Operations Manager",
      bio: "Ensuring every meal reaches you fresh and on time, every single day.",
    },
    {
      name: "Ananya Patel",
      role: "Nutrition Consultant",
      bio: "Creating balanced, delicious menus that nourish your body and soul.",
    },
    {
      name: "Vikram Singh",
      role: "Customer Experience Lead",
      bio: "Dedicated to making your Aharraa experience exceptional from start to finish.",
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
            About Aharraa
          </h1>
          <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto text-gray-300">
            Bringing the warmth of home-cooked meals to your table with love, care, and the finest ingredients.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-black">
                Our Story
              </h2>
              <div className="space-y-4 text-sm sm:text-base text-gray-700">
                <p className="leading-relaxed">
                  Aharraa was born from a simple belief: everyone deserves access to delicious, nutritious, home-cooked
                  meals without the hassle of cooking. Founded in 2020, we started with a small kitchen and a big dream.
                </p>
                <p className="leading-relaxed">
                  Today, we serve thousands of happy customers across multiple cities, delivering fresh meals prepared by
                  our talented team of home chefs. Each meal is crafted with the same love and care you'd put into cooking
                  for your own family.
                </p>
                <p className="leading-relaxed">
                  Our mission is simple: to make healthy, delicious eating convenient and accessible to everyone.
                </p>
              </div>
            </div>
            <div>
              <div className="rounded-2xl p-6 sm:p-8 shadow-lg bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                <HiHome className="w-16 h-16 sm:w-20 sm:h-20 mb-4 text-[#3CB371]" />
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-black">
                  Home-Cooked Excellence
                </h3>
                <p className="text-sm sm:text-base text-gray-700">
                  Every meal prepared with the warmth and care of a home kitchen, delivered fresh to your door.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-black">
              Our Values
            </h2>
            <p className="text-sm sm:text-base max-w-2xl mx-auto text-gray-600">
              These core values guide everything we do at Aharraa.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-100"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#3CB371] rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 text-black">
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white">
            Ready to Experience Aharraa?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-gray-300">
            Join thousands of satisfied customers enjoying fresh, delicious home-cooked meals.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl transition-all hover:shadow-xl transform hover:scale-105 bg-[#3CB371] hover:bg-[#2FA05E] text-white"
          >
            Order Now
            <IoArrowForward className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
