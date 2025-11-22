"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { resetPassword } from "@/lib/api"
import { Lock, ArrowLeft, Key, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react"

const ResetPasswordPage = () => {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [token, setToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.substring(1))
    const accessToken = params.get("access_token")
    const type = params.get("type")

    if (accessToken && type === "recovery") {
      setToken(accessToken)
      setIsTokenValid(true)
    } else {
      setError("Invalid or missing password reset token. Please request a new one.")
      setIsTokenValid(false)
    }
  }, [])

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
    return passwordRegex.test(password)
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[@$!%*?&#]/.test(password)) strength++

    if (strength <= 2) return { strength: 1, label: "Weak", color: "#EF4444" }
    if (strength <= 3) return { strength: 2, label: "Fair", color: "#F59E0B" }
    if (strength <= 4) return { strength: 3, label: "Good", color: "#3CB371" }
    return { strength: 4, label: "Strong", color: "#2FA05E" }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setError("")

    if (!isTokenValid || !token) {
      setError("Invalid or missing password reset token. Please request a new one.")
      return
    }

    if (!newPassword) {
      setError("New password is required.")
      return
    }

    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      const response = await resetPassword(newPassword, token)
      setMessage(response.message || "Your password has been reset successfully.")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => {
        router.push("/auth")
      }, 3000)
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.")
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
            Create a New
            <br />
            Password
          </h2>
          <p className="text-lg xl:text-xl max-w-md opacity-90">
            Choose a strong password to keep your account secure and enjoy delicious meals.
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
                <Key className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-black">
                Reset Password
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Create a strong new password for your account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div>
                <label className="block text-sm font-bold mb-2 text-black">
                  New Password <span className="text-[#3CB371]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full h-12 pl-10 pr-12 rounded-lg text-sm sm:text-base transition-all border-2 border-gray-300 text-black bg-white focus:border-[#3CB371] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className="h-1 flex-1 rounded-full transition-all"
                          style={{
                            backgroundColor: level <= passwordStrength.strength ? passwordStrength.color : "#E5E7EB"
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: passwordStrength.color }}>
                      Strength: {passwordStrength.label}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-bold mb-2 text-black">
                  Confirm Password <span className="text-[#3CB371]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10 text-gray-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full h-12 pl-10 pr-12 rounded-lg text-sm sm:text-base transition-all border-2 border-gray-300 text-black bg-white focus:border-[#3CB371] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
                
                {/* Match Indicator */}
                {confirmPassword && (
                  <div className="flex items-center gap-2 mt-2">
                    {newPassword === confirmPassword ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#3CB371]" />
                        <p className="text-xs text-[#3CB371]">Passwords match</p>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <p className="text-xs text-red-600">Passwords don't match</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg flex items-start gap-3 bg-red-50 border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
                  <div>
                    <p className="text-sm text-red-700">
                      {error}
                    </p>
                    {!isTokenValid && (
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm font-semibold underline mt-2 block text-red-700 hover:text-red-800"
                      >
                        Request a new reset link
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Success Message */}
              {message && (
                <div className="p-4 rounded-lg flex items-start gap-3 bg-green-50 border border-green-200">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#3CB371]" />
                  <div>
                    <p className="text-sm font-semibold text-green-700">
                      {message}
                    </p>
                    <p className="text-xs mt-1 text-green-600">
                      Redirecting to login...
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isTokenValid}
                className="w-full h-12 rounded-lg font-bold text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-[#3CB371] hover:bg-[#2FA05E] text-white"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin">
                    </div>
                    Resetting...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    Reset Password
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

            {/* Password Requirements */}
            <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-xs font-bold mb-2 text-black">
                Password Requirements:
              </p>
              <ul className="text-xs space-y-1 text-gray-600">
                <li>• At least 8 characters long</li>
                <li>• Contains uppercase and lowercase letters</li>
                <li>• Includes at least one number</li>
                <li>• Has at least one special character (@$!%*?&#)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
