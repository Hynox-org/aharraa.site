"use client"

import { Review } from "@/lib/types"
import { Star } from "lucide-react"

const reviews: Review[] = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Working Professional",
    content:
      "Aharraa has completely transformed my daily routine. Fresh, delicious meals delivered right to my door. Highly recommended!",
    rating: 5,
    avatar: "👩‍💼",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Fitness Enthusiast",
    content:
      "The nutritional balance and taste are exceptional. I've been using Aharraa for 3 months and never looked back.",
    rating: 5,
    avatar: "👨‍🏫",
  },
  {
    id: 3,
    name: "Anjali Patel",
    role: "Busy Mom",
    content:
      "Finally, a service that understands quality and convenience. My family loves the variety and freshness of meals.",
    rating: 5,
    avatar: "👩‍🍳",
  },
]

export function ReviewsSection() {
  return (
    <section className="py-20 bg-neutral-50 rounded-2xl my-16 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-neutral-600">
            Join thousands of satisfied customers enjoying fresh, home-cooked meals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{review.avatar}</div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{review.name}</h3>
                  <p className="text-sm text-neutral-600">{review.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-orange-500 text-orange-500" />
                ))}
              </div>

              <p className="text-neutral-700 leading-relaxed">{review.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
