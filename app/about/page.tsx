"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Heart, Leaf, Award } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Quality First",
      description: "We use only the freshest, locally-sourced ingredients in every meal we prepare.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Committed to eco-friendly practices and reducing our environmental footprint.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Supporting local farmers and building a strong community around healthy eating.",
    },
    {
      icon: Award,
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
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">About Aharraa</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Bringing the warmth of home-cooked meals to your table with love, care, and the finest ingredients.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">Our Story</h2>
              <p className="text-neutral-600 mb-4 leading-relaxed">
                Aharraa was born from a simple belief: everyone deserves access to delicious, nutritious, home-cooked
                meals without the hassle of cooking. Founded in 2020, we started with a small kitchen and a big dream.
              </p>
              <p className="text-neutral-600 mb-4 leading-relaxed">
                Today, we serve thousands of happy customers across multiple cities, delivering fresh meals prepared by
                our talented team of home chefs. Each meal is crafted with the same love and care you'd put into cooking
                for your own family.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                Our mission is simple: to make healthy, delicious eating convenient and accessible to everyone.
              </p>
            </div>
            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-8 shadow-lg">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Home-Cooked Excellence</h3>
                <p className="text-neutral-600">
                  Every meal prepared with the warmth and care of a home kitchen, delivered fresh to your door.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Our Values</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">These core values guide everything we do at Aharraa.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="w-12 h-12 text-orange-500 mb-4" />
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">{value.title}</h3>
                  <p className="text-neutral-600">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Meet Our Team</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to bringing you the best meal experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in-up border border-orange-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-orange-500 rounded-full mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">{member.name}</h3>
                <p className="text-orange-600 font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-neutral-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience Aharraa?</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers enjoying fresh, delicious home-cooked meals.
          </p>
          <Link href="/">
            <Button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-6 text-lg">
              Order Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
