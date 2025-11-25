"use client"

import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { IoMail, IoCall, IoLocation, IoTime, IoCheckmarkCircle, IoSend } from "react-icons/io5"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  const contactInfo = [
    {
      icon: IoCall,
      title: "Telephone No",
      details: "8807001442",
      description: "Available 9 AM - 9 PM, 7 days a week",
    },
    {
      icon: IoMail,
      title: "E-Mail ID",
      details: "info.aharraa@gmail.com",
      description: "We'll respond within 24 hours",
    },
    {
      icon: IoLocation,
      title: "Registered Address",
      details: "Vivekananda street, PN pudhur post, Coimbatore-641041.",
      description: "Merchant Legal entity name: THE BLACK CREST",
    },
    {
      icon: IoLocation,
      title: "Operational Address",
      details: "Vivekananda street, PN pudhur post, Coimbatore-641041.",
      description: "Visit our kitchen and meet the team",
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto text-gray-300">
            Last updated on 15-11-2025 19:49:01
          </p>
          <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto text-gray-300">
            You may contact us using the information below:
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <div
                  key={index}
                  className="p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 text-center transform hover:-translate-y-1 bg-white border border-gray-100"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#3CB371] rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-2 text-black">
                    {info.title}
                  </h3>
                  <p className="font-semibold mb-1 text-sm sm:text-base text-black">
                    {info.details}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {info.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
