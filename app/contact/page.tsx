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
      details: "9952213571",
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
      details: "8/1765,PONNAMMAL NAGAR MAIN ROAD,PANDIAN NAGAR, TIRUPPUR, TAMIL NADU, PIN: 641602",
      description: "Merchant Legal entity name: THE BLACK CREST",
    },
    {
      icon: IoLocation,
      title: "Operational Address",
      details: "8/1765,PONNAMMAL NAGAR MAIN ROAD,PANDIAN NAGAR, TIRUPPUR, TAMIL NADU, PIN: 641602",
      description: "Visit our kitchen and meet the team",
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
            Contact Us
          </h1>
          <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto" 
            style={{ color: "rgba(254, 250, 224, 0.9)" }}>
            Last updated on 15-11-2025 19:49:01
          </p>
          <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto" 
            style={{ color: "rgba(254, 250, 224, 0.9)" }}>
            You may contact us using the information below:
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: "rgba(221, 161, 94, 0.05)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <div
                  key={index}
                  className="p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 text-center"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <Icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" style={{ color: "#606C38" }} />
                  <h3 className="text-base sm:text-lg font-bold mb-2" style={{ color: "#283618" }}>
                    {info.title}
                  </h3>
                  <p className="font-semibold mb-1 text-sm sm:text-base" style={{ color: "#283618" }}>
                    {info.details}
                  </p>
                  <p className="text-xs sm:text-sm" style={{ color: "#606C38" }}>
                    {info.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8" style={{ color: "#283618" }}>
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: "#283618" }}>
                    Full Name <span style={{ color: "#BC6C25" }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all"
                    placeholder="Your name"
                    style={{
                      border: "2px solid #DDA15E",
                      color: "#283618",
                      backgroundColor: "#FEFAE0"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#606C38"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#DDA15E"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: "#283618" }}>
                    Email Address <span style={{ color: "#BC6C25" }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all"
                    placeholder="your@email.com"
                    style={{
                      border: "2px solid #DDA15E",
                      color: "#283618",
                      backgroundColor: "#FEFAE0"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#606C38"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#DDA15E"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: "#283618" }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all"
                    placeholder="+91 98765 43210"
                    style={{
                      border: "2px solid #DDA15E",
                      color: "#283618",
                      backgroundColor: "#FEFAE0"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#606C38"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#DDA15E"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: "#283618" }}>
                    Subject <span style={{ color: "#BC6C25" }}>*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all"
                    style={{
                      border: "2px solid #DDA15E",
                      color: "#283618",
                      backgroundColor: "#FEFAE0"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#606C38"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#DDA15E"}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                    <option value="support">Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: "#283618" }}>
                    Message <span style={{ color: "#BC6C25" }}>*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all resize-none"
                    placeholder="Your message here..."
                    style={{
                      border: "2px solid #DDA15E",
                      color: "#283618",
                      backgroundColor: "#FEFAE0"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#606C38"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#DDA15E"}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 sm:py-3.5 rounded-lg font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
                >
                  <IoSend className="w-5 h-5" />
                  Send Message
                </button>

                {submitted && (
                  <div className="p-4 rounded-lg text-center flex items-center justify-center gap-2"
                    style={{ backgroundColor: "rgba(96, 108, 56, 0.1)", color: "#606C38" }}>
                    <IoCheckmarkCircle className="w-5 h-5" />
                    <span className="text-sm sm:text-base">
                      Thank you! Your message has been sent successfully.
                    </span>
                  </div>
                )}
              </form>
            </div>

            <div>
              <div className="rounded-2xl p-6 sm:p-8 shadow-lg"
                style={{ 
                  background: "linear-gradient(135deg, rgba(221, 161, 94, 0.1) 0%, #ffffff 100%)",
                  border: "1px solid rgba(221, 161, 94, 0.2)"
                }}>
                <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: "#283618" }}>
                  Why Contact Us?
                </h3>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <li className="flex gap-3">
                    <span className="font-bold flex-shrink-0" style={{ color: "#606C38" }}>✓</span>
                    <span className="text-sm sm:text-base" style={{ color: "#606C38" }}>
                      <strong>Feedback:</strong> Help us improve your experience
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold flex-shrink-0" style={{ color: "#606C38" }}>✓</span>
                    <span className="text-sm sm:text-base" style={{ color: "#606C38" }}>
                      <strong>Support:</strong> Get help with your orders
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold flex-shrink-0" style={{ color: "#606C38" }}>✓</span>
                    <span className="text-sm sm:text-base" style={{ color: "#606C38" }}>
                      <strong>Partnerships:</strong> Collaborate with us
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold flex-shrink-0" style={{ color: "#606C38" }}>✓</span>
                    <span className="text-sm sm:text-base" style={{ color: "#606C38" }}>
                      <strong>Inquiries:</strong> Ask anything about Aharraa
                    </span>
                  </li>
                </ul>

                <div className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: "#606C38" }}>
                  <p className="font-bold mb-2 text-sm sm:text-base" style={{ color: "#FEFAE0" }}>
                    Quick Response Time
                  </p>
                  <p className="text-xs sm:text-sm" style={{ color: "rgba(254, 250, 224, 0.9)" }}>
                    We typically respond to all inquiries within 24 hours during business hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <Footer />
    </main>
  )
}
