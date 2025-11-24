"use client"

import { useState } from "react"
import { IoChevronDown, IoRefresh, IoColorPalette } from "react-icons/io5"
import { HiSparkles, HiQuestionMarkCircle } from "react-icons/hi2"
import { MdHelp, MdDeliveryDining, MdPause } from "react-icons/md"
import { GiMeal } from "react-icons/gi"
import { BiLeaf } from "react-icons/bi"
import { FaQuestionCircle } from "react-icons/fa"
import { BsChatDots } from "react-icons/bs"
import { FaqItem } from "@/lib/types"
import { useRouter } from "next/navigation"

const faqs: FaqItem[] = [
  {
    id: 1,
    question: "How does the subscription work?",
    answer:
      "Choose your preferred plan (daily, weekly, or monthly), select your delivery location, pick your meal slots (breakfast, lunch, dinner), and browse our fixed menu. Your meals are prepared fresh and delivered to your doorstep.",
    icon: "subscription",
    gradient: "from-[#3CB371] to-[#2FA05E]"
  },
  {
    id: 2,
    question: "Can I customize my meals?",
    answer:
      "Our menu is carefully curated by our chefs to ensure quality and variety. You can choose which meals to include in your subscription from our available options.",
    icon: "customize",
    gradient: "from-[#3CB371] to-[#2FA05E]"
  },
  {
    id: 3,
    question: "What areas do you deliver to?",
    answer:
      "We currently deliver to multiple locations across the city. You can check available delivery areas during the location selection step.",
    icon: "delivery",
    gradient: "from-[#3CB371] to-[#2FA05E]"
  },
  {
    id: 4,
    question: "How fresh are the meals?",
    answer:
      "All meals are prepared fresh daily by our home chefs using locally-sourced ingredients. Meals are delivered within hours of preparation.",
    icon: "fresh",
    gradient: "from-[#3CB371] to-[#2FA05E]"
  },
  {
    id: 5,
    question: "Can I pause or cancel my subscription?",
    answer: "Yes, you can pause or cancel your subscription anytime from your account settings without any penalties.",
    icon: "pause",
    gradient: "from-[#3CB371] to-[#2FA05E]"
  },
  {
    id: 6,
    question: "Do you offer dietary preferences?",
    answer:
      "We offer various dietary options including vegetarian, vegan, and protein-rich meals. You can select your preferences during signup.",
    icon: "diet",
    gradient: "from-[#3CB371] to-[#2FA05E]"
  },
]

const getIconComponent = (iconType: string) => {
  const iconMap = {
    subscription: IoRefresh,
    customize: IoColorPalette,
    delivery: MdDeliveryDining,
    fresh: BiLeaf,
    pause: MdPause,
    diet: GiMeal
  }
  return iconMap[iconType as keyof typeof iconMap] || FaQuestionCircle
}

export function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(null)
  const router = useRouter();

  return (
    <section className="py-20 my-16 animate-fade-in-up relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#3CB371] opacity-5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#3CB371] opacity-5 rounded-full filter blur-3xl"></div>
      </div>

      {/* Decorative Pattern Background */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle, rgba(60, 179, 113, 0.6) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 mb-6 border-2 border-gray-200 shadow-lg">
            <HiQuestionMarkCircle className="w-5 h-5 text-[#3CB371] animate-bounce" />
            <span className="text-sm font-bold text-black">Got Questions?</span>
            <HiSparkles className="w-5 h-5 text-[#3CB371] animate-pulse" />
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Frequently Asked
            <span className="block mt-2 text-[#3CB371]">
              Questions
            </span>
          </h2>

          {/* Underline Decoration */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-[#3CB371] rounded-full"></div>
            <HiQuestionMarkCircle className="w-6 h-6 text-[#3CB371]" />
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-[#3CB371] rounded-full"></div>
          </div>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Aharraa and our meal delivery service
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const IconComponent = getIconComponent(faq.icon)
            return (
              <div
                key={faq.id}
                className="group relative animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Border Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${faq.gradient} rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-500`}></div>
                
                {/* Card Content */}
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform group-hover:-translate-y-1 border-2 border-gray-100">
                  {/* Top Decorative Wave */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${faq.gradient}`}></div>

                  {/* Question Button */}
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-all duration-300 group"
                  >
                    {/* Question with Icon */}
                    <div className="flex items-center gap-4">
                      {/* Icon Container */}
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${faq.gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Question Text */}
                      <h3 className="font-bold text-lg text-black text-left group-hover:text-gray-700 transition-colors duration-300">
                        {faq.question}
                      </h3>
                    </div>

                    {/* Chevron with Indicator */}
                    <div className="flex items-center gap-2">
                      {openId === faq.id && (
                        <div className="w-2 h-2 bg-[#3CB371] rounded-full animate-pulse"></div>
                      )}
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${faq.gradient} flex items-center justify-center shadow-md transform transition-all duration-300 ${openId === faq.id ? 'rotate-180 scale-110' : 'group-hover:scale-105'}`}>
                        <IoChevronDown className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </button>

                  {/* Answer Section */}
                  {openId === faq.id && (
                    <div className="animate-fade-in-up">
                      {/* Divider with Gradient */}
                      <div className={`h-0.5 bg-gradient-to-r ${faq.gradient} opacity-20`}></div>
                      
                      {/* Answer Content */}
                      <div className="px-6 py-6 bg-gray-50">
                        <div className="flex items-start gap-4">
                          {/* Quote Icon */}
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${faq.gradient} flex items-center justify-center flex-shrink-0 mt-1 opacity-80`}>
                            <MdHelp className="w-4 h-4 text-white" />
                          </div>
                          
                          {/* Answer Text */}
                          <p className="text-gray-700 leading-relaxed font-medium">
                            {faq.answer}
                          </p>
                        </div>

                        {/* Bottom Decorative Element */}
                        <div className="mt-4 flex justify-end">
                          <div className={`w-16 h-1 bg-gradient-to-r ${faq.gradient} rounded-full opacity-30`}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle, rgba(60, 179, 113, 0.8) 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}></div>

            {/* Content */}
            <div className="relative z-10">
              <BsChatDots className="w-12 h-12 text-[#3CB371] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-black mb-3">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Can't find the answer you're looking for? Our support team is here to help!
              </p>
              
              {/* Contact Button */}
              <button onClick={() => {
                router.push("/contact")
              }} className="inline-flex items-center gap-2 bg-[#3CB371] hover:bg-[#2FA05E] text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                <HiSparkles className="w-5 h-5" />
                Contact Support
                <IoChevronDown className="w-5 h-5 -rotate-90" />
              </button>
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#3CB371] opacity-5 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#3CB371] opacity-5 rounded-tr-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
