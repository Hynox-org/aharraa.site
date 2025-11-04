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

    if (strength <= 2) return { strength: 1, label: "Weak", color: "#BC6C25" }
    if (strength <= 3) return { strength: 2, label: "Fair", color: "#DDA15E" }
    if (strength <= 4) return { strength: 3, label: "Good", color: "#606C38" }
    return { strength: 4, label: "Strong", color: "#283618" }
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
                <Key className="w-8 h-8" style={{ color: "#FEFAE0" }} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#283618" }}>
                Reset Password
              </h2>
              <p className="text-sm sm:text-base" style={{ color: "#606C38" }}>
                Create a strong new password for your account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* New Password */}
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: "#283618" }}>
                  New Password <span style={{ color: "#BC6C25" }}>*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10" style={{ color: "#606C38" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full h-12 pl-10 pr-12 rounded-lg text-sm sm:text-base transition-all"
                    style={{
                      border: "2px solid #DDA15E",
                      color: "#283618",
                      backgroundColor: "#FEFAE0"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#606C38"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#DDA15E"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" style={{ color: "#606C38" }} />
                    ) : (
                      <Eye className="w-5 h-5" style={{ color: "#606C38" }} />
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
                            backgroundColor: level <= passwordStrength.strength ? passwordStrength.color : "rgba(221, 161, 94, 0.2)"
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
                <label className="block text-sm font-bold mb-2" style={{ color: "#283618" }}>
                  Confirm Password <span style={{ color: "#BC6C25" }}>*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10" style={{ color: "#606C38" }} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full h-12 pl-10 pr-12 rounded-lg text-sm sm:text-base transition-all"
                    style={{
                      border: "2px solid #DDA15E",
                      color: "#283618",
                      backgroundColor: "#FEFAE0"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#606C38"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "#DDA15E"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" style={{ color: "#606C38" }} />
                    ) : (
                      <Eye className="w-5 h-5" style={{ color: "#606C38" }} />
                    )}
                  </button>
                </div>
                
                {/* Match Indicator */}
                {confirmPassword && (
                  <div className="flex items-center gap-2 mt-2">
                    {newPassword === confirmPassword ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" style={{ color: "#606C38" }} />
                        <p className="text-xs" style={{ color: "#606C38" }}>Passwords match</p>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" style={{ color: "#BC6C25" }} />
                        <p className="text-xs" style={{ color: "#BC6C25" }}>Passwords don't match</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg flex items-start gap-3"
                  style={{ backgroundColor: "rgba(188, 108, 37, 0.1)", border: "1px solid #BC6C25" }}>
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#BC6C25" }} />
                  <div>
                    <p className="text-sm" style={{ color: "#BC6C25" }}>
                      {error}
                    </p>
                    {!isTokenValid && (
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm font-semibold underline mt-2 block"
                        style={{ color: "#BC6C25" }}
                      >
                        Request a new reset link
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Success Message */}
              {message && (
                <div className="p-4 rounded-lg flex items-start gap-3"
                  style={{ backgroundColor: "rgba(96, 108, 56, 0.1)", border: "1px solid #606C38" }}>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#606C38" }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#606C38" }}>
                      {message}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#606C38" }}>
                      Redirecting to login...
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isTokenValid}
                className="w-full h-12 rounded-lg font-bold text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: "#FEFAE0", borderTopColor: "transparent" }}>
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
                className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold transition-colors"
                style={{ color: "#606C38" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#BC6C25"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#606C38"}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>

            {/* Password Requirements */}
            <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}>
              <p className="text-xs font-bold mb-2" style={{ color: "#283618" }}>
                Password Requirements:
              </p>
              <ul className="text-xs space-y-1" style={{ color: "#606C38" }}>
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
