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
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-black to-gray-900">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/auth-bg.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12 xl:p-16 text-white">
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
      <div className="flex-1 flex justify-center items-center p-4 sm:p-8 bg-white">
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
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              AHARRAA
            </h1>
          </div>

          {/* Card */}
          <div className="rounded-2xl p-6 sm:p-8 shadow-xl bg-white border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[#3CB371]">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-black">
                Forgot Password?
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-bold mb-2 text-black">
                  Email Address <span className="text-[#3CB371]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-12 pl-10 pr-4 rounded-lg text-sm sm:text-base transition-all border-2 border-gray-300 text-black bg-white focus:border-[#3CB371] focus:outline-none"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg flex items-start gap-3 bg-red-50 border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {message && (
                <div className="p-4 rounded-lg flex items-start gap-3 bg-green-50 border border-green-200">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#3CB371]" />
                  <p className="text-sm text-green-700">
                    {message}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-lg font-bold text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-[#3CB371] hover:bg-[#2FA05E] text-white"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin">
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
                className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold transition-colors text-gray-700 hover:text-[#3CB371]"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-xs sm:text-sm text-center text-gray-600">
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
