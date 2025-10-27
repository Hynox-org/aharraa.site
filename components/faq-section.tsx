"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface FaqItem {
  id: number
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    id: 1,
    question: "How does the subscription work?",
    answer:
      "Choose your preferred plan (daily, weekly, or monthly), select your delivery location, pick your meal slots (breakfast, lunch, dinner), and browse our fixed menu. Your meals are prepared fresh and delivered to your doorstep.",
  },
  {
    id: 2,
    question: "Can I customize my meals?",
    answer:
      "Our menu is carefully curated by our chefs to ensure quality and variety. You can choose which meals to include in your subscription from our available options.",
  },
  {
    id: 3,
    question: "What areas do you deliver to?",
    answer:
      "We currently deliver to multiple locations across the city. You can check available delivery areas during the location selection step.",
  },
  {
    id: 4,
    question: "How fresh are the meals?",
    answer:
      "All meals are prepared fresh daily by our home chefs using locally-sourced ingredients. Meals are delivered within hours of preparation.",
  },
  {
    id: 5,
    question: "Can I pause or cancel my subscription?",
    answer: "Yes, you can pause or cancel your subscription anytime from your account settings without any penalties.",
  },
  {
    id: 6,
    question: "Do you offer dietary preferences?",
    answer:
      "We offer various dietary options including vegetarian, vegan, and protein-rich meals. You can select your preferences during signup.",
  },
]

export function FaqSection() {
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <section className="py-20 my-16 animate-fade-in-up">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-neutral-600">Find answers to common questions about Aharraa</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="border border-neutral-200 rounded-lg overflow-hidden animate-slide-in-left"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-neutral-50 transition-colors"
              >
                <h3 className="font-semibold text-neutral-900 text-left">{faq.question}</h3>
                <ChevronDown
                  size={20}
                  className={`text-orange-600 flex-shrink-0 transition-transform ${
                    openId === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openId === faq.id && (
                <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 animate-fade-in-up">
                  <p className="text-neutral-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
