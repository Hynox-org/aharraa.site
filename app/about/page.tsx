"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { IoHeart, IoLeaf, IoPeople, IoTrophy, IoArrowForward } from "react-icons/io5"

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
    <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
      <Header />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24"
        style={{ background: "linear-gradient(135deg, #606C38 0%, #283618 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6" 
            style={{ color: "#FEFAE0" }}>
            About Aharraa
          </h1>
          <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto" 
            style={{ color: "rgba(254, 250, 224, 0.9)" }}>
            Bringing the warmth of home-cooked meals to your table with love, care, and the finest ingredients.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6" style={{ color: "#283618" }}>
                Our Story
              </h2>
              <div className="space-y-4 text-sm sm:text-base" style={{ color: "#606C38" }}>
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
              <div className="rounded-2xl p-6 sm:p-8 shadow-lg"
                style={{ background: "linear-gradient(135deg, rgba(221, 161, 94, 0.1) 0%, rgba(188, 108, 37, 0.05) 100%)" }}>
                <div className="text-5xl sm:text-6xl mb-4">🏠</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: "#283618" }}>
                  Home-Cooked Excellence
                </h3>
                <p className="text-sm sm:text-base" style={{ color: "#606C38" }}>
                  Every meal prepared with the warmth and care of a home kitchen, delivered fresh to your door.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: "rgba(221, 161, 94, 0.05)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4" style={{ color: "#283618" }}>
              Our Values
            </h2>
            <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "#606C38" }}>
              These core values guide everything we do at Aharraa.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <Icon className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4" style={{ color: "#606C38" }} />
                  <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: "#283618" }}>
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base" style={{ color: "#606C38" }}>
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20"
        style={{ background: "linear-gradient(135deg, #606C38 0%, #283618 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4" 
            style={{ color: "#FEFAE0" }}>
            Ready to Experience Aharraa?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto" 
            style={{ color: "rgba(254, 250, 224, 0.9)" }}>
            Join thousands of satisfied customers enjoying fresh, delicious home-cooked meals.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl transition-all hover:shadow-lg"
            style={{ backgroundColor: "#DDA15E", color: "#283618" }}
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
