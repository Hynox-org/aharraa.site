"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { IoMail, IoLockClosed, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/app/context/auth-context"
import { toast } from "sonner"
import { apiRequest, oauthLogin } from "@/lib/api"
import { AuthApiResponse } from "@/lib/types"
import { useStore } from "@/lib/store"
import { Spinner } from "@/components/ui/spinner"
import LottieAnimation from "@/components/lottie-animation"
import ItayCheffAnimation from "../../public/lottie/ItayCheff.json";

function AuthPageContent() {
  const [isSignInLoading, setIsSignInLoading] = useState(false)
  const [isSignUpLoading, setIsSignUpLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin")
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")
  const [showSignInPassword, setShowSignInPassword] = useState(false)
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LottieAnimation animationData={ItayCheffAnimation} style={{ width: 200, height: 200 }} />
      </div>
    );
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
        await login(data.accessToken, storedReturnUrl ?? undefined)
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
        await login(data.accessToken, storedReturnUrl ?? undefined)
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
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-black to-gray-900">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/auth-bg.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="relative z-10 flex flex-col justify-center items-start p-12 xl:p-16 text-white">
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
      <div className="flex-1 flex justify-center p-4 sm:p-8 overflow-y-auto bg-white">
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
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              AHARRAA
            </h1>
          </Link>

          {/* Tab Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-6 sm:mb-8 p-1 rounded-xl bg-gray-100">
            <button
              onClick={() => setActiveTab("signin")}
              className="py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all"
              style={{
                backgroundColor: activeTab === "signin" ? "#ffffff" : "transparent",
                color: activeTab === "signin" ? "#000000" : "#6B7280",
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
                color: activeTab === "signup" ? "#000000" : "#6B7280",
                boxShadow: activeTab === "signup" ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none"
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Sign In Form */}
          {activeTab === "signin" && (
            <div className="rounded-2xl p-6 sm:p-8 shadow-xl bg-white border border-gray-100">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-black">
                  Welcome back!
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Sign in to continue your culinary journey
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">
                    Email
                  </label>
                  <div className="relative">
                    <IoMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-lg text-sm sm:text-base transition-all border-2 border-gray-300 text-black bg-white focus:border-[#3CB371] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-black">
                      Password
                    </label>
                    <Link href="/auth/forgot-password" className="text-xs sm:text-sm font-semibold text-[#3CB371] hover:text-[#2FA05E]">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <IoLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showSignInPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      className="w-full h-11 sm:h-12 pl-10 pr-10 rounded-lg text-sm sm:text-base transition-all border-2 border-gray-300 text-black bg-white focus:border-[#3CB371] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none text-gray-500 hover:text-gray-700"
                    >
                      {showSignInPassword ? (
                        <IoEyeOffOutline className="w-5 h-5" />
                      ) : (
                        <IoEyeOutline className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  onClick={handleLogin}
                  disabled={isSignInLoading}
                  className="w-full h-11 sm:h-12 rounded-lg font-bold text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6 bg-[#3CB371] hover:bg-[#2FA05E] text-white"
                >
                  {isSignInLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner className="size-4 text-white" /> Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-5 sm:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 text-xs uppercase bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full h-11 sm:h-12 rounded-lg font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 border-2 border-gray-300 bg-white text-black hover:bg-gray-50"
                >
                  {isGoogleLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner className="size-4 text-black" /> Signing in...
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
            <div className="rounded-2xl p-6 sm:p-8 shadow-xl bg-white border border-gray-100">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-black">
                  Create an account
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Join us and discover amazing home-cooked meals
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">
                    Email
                  </label>
                  <div className="relative">
                    <IoMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="w-full h-11 sm:h-12 pl-10 pr-4 rounded-lg text-sm sm:text-base transition-all border-2 border-gray-300 text-black bg-white focus:border-[#3CB371] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-black">
                    Password
                  </label>
                  <div className="relative">
                    <IoLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showSignUpPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      className="w-full h-11 sm:h-12 pl-10 pr-10 rounded-lg text-sm sm:text-base transition-all border-2 border-gray-300 text-black bg-white focus:border-[#3CB371] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none text-gray-500 hover:text-gray-700"
                    >
                      {showSignUpPassword ? (
                        <IoEyeOffOutline className="w-5 h-5" />
                      ) : (
                        <IoEyeOutline className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded accent-[#3CB371]"
                  />
                  <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="font-semibold text-[#3CB371] hover:text-[#2FA05E]">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="font-semibold text-[#3CB371] hover:text-[#2FA05E]">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Sign Up Button */}
                <button
                  onClick={handleSignup}
                  disabled={isSignUpLoading}
                  className="w-full h-11 sm:h-12 rounded-lg font-bold text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6 bg-[#3CB371] hover:bg-[#2FA05E] text-white"
                >
                  {isSignUpLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner className="size-4 text-white" /> Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Divider */}
                <div className="relative my-5 sm:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 text-xs uppercase bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full h-11 sm:h-12 rounded-lg font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2 border-2 border-gray-300 bg-white text-black hover:bg-gray-50"
                >
                  {isGoogleLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner className="size-4 text-black" /> Signing up...
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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-lg font-medium text-black">
          Loading authentication...
        </p>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  )
}
