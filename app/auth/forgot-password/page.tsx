"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { forgotPassword } from "@/lib/api"
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react"

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")

    if (!email) {
      setError("Email is required.")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }

    setLoading(true)
    try {
      const response = await forgotPassword(email)
      setMessage(response.message || "Reset link sent to your email.")
      setEmail("")
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FEFAE0 0%, #606C38 50%, #283618 100%)" }}>
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}></div>
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/auth-bg.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12 xl:p-16" style={{ color: "#FEFAE0" }}>
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/logo.png"
              alt="Aharraa"
              width={60}
              height={60}
              className="rounded-2xl"
            />
            <h1 className="text-4xl font-bold">AHARRAA</h1>
          </div>
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Forgot Your
            <br />
            Password?
          </h2>
          <p className="text-lg xl:text-xl max-w-md opacity-90">
            No worries! Enter your email and we'll send you a reset link to get you back on track.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex justify-center items-center p-4 sm:p-8"
        style={{ background: "linear-gradient(135deg, #FEFAE0 0%, #ffffff 100%)" }}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Image
              src="/logo.png"
              alt="Aharraa"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#283618" }}>
              AHARRAA
            </h1>
          </div>

          {/* Card */}
          <div className="rounded-2xl p-6 sm:p-8 shadow-xl" style={{ backgroundColor: "#ffffff" }}>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #606C38, #283618)" }}>
                <Mail className="w-8 h-8" style={{ color: "#FEFAE0" }} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#283618" }}>
                Forgot Password?
              </h2>
              <p className="text-sm sm:text-base" style={{ color: "#606C38" }}>
                Enter your email and we'll send you a reset link
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "#283618" }}>
                  Email Address <span style={{ color: "#BC6C25" }}>*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#606C38" }} />
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 pl-10 pr-4 rounded-lg text-sm sm:text-base transition-all"
                    style={{
                      border: "2px solid #DDA15E",
                      color: "#283618",
                      backgroundColor: "#FEFAE0"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#606C38"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#DDA15E"}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg flex items-start gap-3"
                  style={{ backgroundColor: "rgba(188, 108, 37, 0.1)", border: "1px solid #BC6C25" }}>
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#BC6C25" }} />
                  <p className="text-sm" style={{ color: "#BC6C25" }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {message && (
                <div className="p-4 rounded-lg flex items-start gap-3"
                  style={{ backgroundColor: "rgba(96, 108, 56, 0.1)", border: "1px solid #606C38" }}>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#606C38" }} />
                  <p className="text-sm" style={{ color: "#606C38" }}>
                    {message}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-lg font-bold text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: "#FEFAE0", borderTopColor: "transparent" }}>
                    </div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold transition-colors"
                style={{ color: "#606C38" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#BC6C25"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#606C38"}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}>
              <p className="text-xs sm:text-sm text-center" style={{ color: "#606C38" }}>
                <strong>Note:</strong> The reset link will be valid for 1 hour. Check your spam folder if you don't see the email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
