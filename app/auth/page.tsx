"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { IoMail, IoLockClosed } from "react-icons/io5"
import Image from "next/image"
import Link from "next/link" // Import Link
import { useAuth } from "@/app/context/auth-context"
import { toast } from "sonner"
import { apiRequest, oauthLogin } from "@/lib/api"
import { AuthApiResponse } from "@/lib/types"
import { useStore } from "@/lib/store"
import { Spinner } from "@/components/ui/spinner"

function AuthPageContent() {
  const [isSignInLoading, setIsSignInLoading] = useState(false)
  const [isSignUpLoading, setIsSignUpLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")
  const [signInEmail, setSignInEmail] = useState("parameswaran8803@gmail.com")
  const [signInPassword, setSignInPassword] = useState("Prem8803@@")
  const [signUpEmail, setSignUpEmail] = useState("parameswaran8803@gmail.com")
  const [signUpPassword, setSignUpPassword] = useState("Prem8803@@")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, loading, login } = useAuth()
  const { returnUrl: storedReturnUrl, setReturnUrl } = useStore()

  useEffect(() => {
    const urlReturnUrl = searchParams.get("returnUrl")
    if (urlReturnUrl && urlReturnUrl !== storedReturnUrl) {
      setReturnUrl(urlReturnUrl)
    }
  }, [searchParams, setReturnUrl, storedReturnUrl])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#FEFAE0" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "#606C38", borderTopColor: "transparent" }}>
          </div>
          <p className="text-lg font-medium" style={{ color: "#283618" }}>
            Loading...
          </p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null
  }

  const handleLogin = async () => {
    setIsSignInLoading(true)
    try {
      const data = await apiRequest<AuthApiResponse>("/auth/signin", "POST", {
        email: signInEmail,
        password: signInPassword,
      })
      if (data.accessToken) {
        await login(data.accessToken, storedReturnUrl)
      }
      toast.success("Sign in successful!")
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign up.")
    } finally {
      setIsSignInLoading(false)
    }
  }

  const handleSignup = async () => {
    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions")
      return
    }
    
    setIsSignUpLoading(true)
    try {
      const data = await apiRequest<AuthApiResponse>("/auth/signup", "POST", {
        email: signUpEmail,
        password: signUpPassword,
      })

      if (data.accessToken) {
        await login(data.accessToken, storedReturnUrl)
      }

      toast.success("Signup successful!")
    } catch (error: any) {
      toast.error(error.message || "An error occurred during sign up.")
    } finally {
      setIsSignUpLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      const data = await oauthLogin("google")
      router.push(data.url)
    } catch (err: unknown) {
      console.error("Google login error:", err)
      toast.error((err as Error).message || "Google login failed")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen h-screen overflow-hidden">
      {/* Left Side - Branding & Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FEFAE0 0%, #606C38 50%, #283618 100%)" }}>
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('/auth-bg.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12 xl:p-16" style={{ color: "#FEFAE0" }}>
          <Link href="/" className="flex items-center gap-3 mb-6">
            <Image
              src="/logo.png"
              alt="Aharraa"
              width={60}
              height={60}
              className="rounded-2xl"
            />
            <h1 className="text-4xl font-bold">AHARRAA</h1>
          </Link>
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Delicious home-cooked
            <br />
            meals delivered to
            <br />
            your doorstep
          </h2>
          <p className="text-lg xl:text-xl max-w-md opacity-90">
            Connect with local home chefs and enjoy authentic, homemade food
            from your community.
          </p>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex justify-center p-4 sm:p-8 overflow-y-auto"
        style={{ background: "linear-gradient(135deg, #FEFAE0 0%, #ffffff 100%)" }}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden flex items-center justify-center gap-2 mb-6 sm:mb-8">
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
          </Link>

          {/* Tab Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-6 sm:mb-8 p-1 rounded-xl"
            style={{ backgroundColor: "rgba(96, 108, 56, 0.1)" }}>
            <button
              onClick={() => setActiveTab("signin")}
              className="py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all"
              style={{
                backgroundColor: activeTab === "signin" ? "#ffffff" : "transparent",
                color: activeTab === "signin" ? "#283618" : "#606C38",
                boxShadow: activeTab === "signin" ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none"
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className="py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all"
              style={{
                backgroundColor: activeTab === "signup" ? "#ffffff" : "transparent",
                color: activeTab === "signup" ? "#283618" : "#606C38",
                boxShadow: activeTab === "signup" ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none"
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Form */}
          {activeTab === "signin" && (
            <div className="rounded-2xl p-6 sm:p-8 shadow-xl" style={{ backgroundColor: "#ffffff" }}>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: "#283618" }}>
                  Welcome back!
                </h2>
                <p className="text-sm sm:text-base" style={{ color: "#606C38" }}>
                  Sign in to continue your culinary journey
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#283618" }}>
                    Email
                  </label>
                  <div className="relative">
                    <IoMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#606C38" }} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-lg text-sm sm:text-base transition-all"
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

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold" style={{ color: "#283618" }}>
                      Password
                    </label>
                    <Link href="/auth/forgot-password" className="text-xs sm:text-sm font-semibold" style={{ color: "#BC6C25" }}>
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <IoLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#606C38" }} />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-lg text-sm sm:text-base transition-all"
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

                {/* Sign In Button */}
                <button
                  onClick={handleLogin}
                  disabled={isSignInLoading}
                  className="w-full h-11 sm:h-12 rounded-lg font-bold text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  style={{
                    backgroundColor: "#606C38",
                    color: "#FEFAE0"
                  }}
                >
                  {isSignInLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner className="size-4" style={{ color: "#FEFAE0" }} /> Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-5 sm:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px" style={{ backgroundColor: "#DDA15E" }} />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 text-xs uppercase" style={{ backgroundColor: "#ffffff", color: "#606C38" }}>
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full h-11 sm:h-12 rounded-lg font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  style={{
                    border: "2px solid #DDA15E",
                    backgroundColor: "#ffffff",
                    color: "#283618"
                  }}
                >
                  {isGoogleLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner className="size-4" style={{ color: "#283618" }} /> Signing in...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC04"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Sign Up Form */}
          {activeTab === "signup" && (
            <div className="rounded-2xl p-6 sm:p-8 shadow-xl" style={{ backgroundColor: "#ffffff" }}>
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: "#283618" }}>
                  Create an account
                </h2>
                <p className="text-sm sm:text-base" style={{ color: "#606C38" }}>
                  Join us and discover amazing home-cooked meals
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#283618" }}>
                    Email
                  </label>
                  <div className="relative">
                    <IoMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#606C38" }} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-lg text-sm sm:text-base transition-all"
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

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "#283618" }}>
                    Password
                  </label>
                  <div className="relative">
                    <IoLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "#606C38" }} />
                    <input
                      type="password"
                      placeholder="Create a strong password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-lg text-sm sm:text-base transition-all"
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

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded"
                    style={{ accentColor: "#606C38" }}
                  />
                  <label htmlFor="terms" className="text-xs sm:text-sm" style={{ color: "#606C38" }}>
                    I agree to the{" "}
                    <a href="#" className="font-semibold" style={{ color: "#BC6C25" }}>
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="font-semibold" style={{ color: "#BC6C25" }}>
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Sign Up Button */}
                <button
                  onClick={handleSignup}
                  disabled={isSignUpLoading}
                  className="w-full h-11 sm:h-12 rounded-lg font-bold text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  style={{
                    backgroundColor: "#606C38",
                    color: "#FEFAE0"
                  }}
                >
                  {isSignUpLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner className="size-4" style={{ color: "#FEFAE0" }} /> Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-5 sm:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px" style={{ backgroundColor: "#DDA15E" }} />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 text-xs uppercase" style={{ backgroundColor: "#ffffff", color: "#606C38" }}>
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full h-11 sm:h-12 rounded-lg font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2"
                  style={{
                    border: "2px solid #DDA15E",
                    backgroundColor: "#ffffff",
                    color: "#283618"
                  }}
                >
                  {isGoogleLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner className="size-4" style={{ color: "#283618" }} /> Signing up...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC04"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign up with Google
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#FEFAE0" }}>
        <p className="text-lg font-medium" style={{ color: "#283618" }}>
          Loading authentication...
        </p>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  )
}
