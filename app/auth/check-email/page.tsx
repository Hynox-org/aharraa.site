"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IoMail, IoCheckmarkCircle, IoArrowForward, IoRefresh } from "react-icons/io5"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { toast } from "sonner"
import { apiRequest } from "@/lib/api"

export default function CheckEmailPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    const pendingEmail = localStorage.getItem('pending-confirmation-email')
    if (pendingEmail) {
      setEmail(pendingEmail)
    } else {
      router.push('/auth')
    }
  }, [router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleResendEmail = async () => {
    if (!canResend || isResending || !email) return

    setIsResending(true)
    try {
      await apiRequest("/auth/resend-confirmation", "POST", { email })
      toast.success("Confirmation email resent! Please check your inbox.")
      setCountdown(60)
      setCanResend(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to resend email. Please try again.")
    } finally {
      setIsResending(false)
    }
  }
  const handleBackToLogin = () => {
    localStorage.removeItem('pending-confirmation-email')
    router.push("/auth")
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-xl mx-auto px-2 sm:px-4 md:px-6 py-6 sm:py-10 md:py-14">
        <div className="bg-white rounded-lg md:rounded-2xl lg:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-100">
          
          {/* Icon with Animation */}
          <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#3CB371] opacity-20 rounded-full blur-lg sm:blur-xl animate-pulse" />
              <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#3CB371] flex items-center justify-center shadow-xl">
                <IoMail className="w-7 h-7 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white border-2 sm:border-4 border-white flex items-center justify-center shadow">
                  <IoCheckmarkCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#3CB371]" />
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center text-black mb-2 sm:mb-3">
            Check Your Email
          </h1>

          {/* Description */}
          <div className="text-center space-y-2 sm:space-y-3 mb-3 sm:mb-5">
            <p className="text-xs sm:text-sm text-gray-600">
              We've sent a confirmation mail to:
            </p>
            {email && (
              <div className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-50 rounded-full border border-gray-200">
                <IoMail className="w-4 h-4 sm:w-5 sm:h-5 text-[#3CB371]" />
                <span className="text-xs sm:text-sm font-semibold text-black">
                  {email}
                </span>
              </div>
            )}
            <p className="text-[10px] sm:text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
              Open the mail and click the confirmation link to activate your account.
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-100">
            <h3 className="text-xs sm:text-sm font-bold text-black mb-2 sm:mb-3">
              What to do next:
            </h3>
            <div className="space-y-1.5 sm:space-y-2">
              {[
                "Check your inbox for an email from Aharraa",
                "Click the confirmation link in that email",
                "You’ll be done and redirected to your dashboard",
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-1 sm:gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#3CB371] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[11px] sm:text-xs font-bold text-white">{idx + 1}</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-600 flex-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Resend Email Section */}
          <div className="text-center space-y-2 sm:space-y-3 mb-3 sm:mb-5">
            <p className="text-[10px] sm:text-xs text-gray-500">
              Didn't get the mail?
            </p>
            
            <button
              onClick={handleResendEmail}
              disabled={!canResend || isResending}
              className="inline-flex items-center justify-center gap-1 px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg font-semibold text-[11px] sm:text-xs transition bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 hover:border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"/>
                  <span>Sending...</span>
                </>
              ) : canResend ? (
                <>
                  <IoRefresh className="w-4 h-4"/>
                  <span>Resend Email</span>
                </>
              ) : (
                <span>Resend in {countdown}s</span>
              )}
            </button>
            <p className="text-[9px] sm:text-[10px] text-gray-400">
              Check your spam folder if you don't see it in your inbox.
            </p>
          </div>

          {/* Back to Login Button */}
          <button
            onClick={handleBackToLogin}
            className="w-full py-2 sm:py-2.5 rounded-lg font-bold text-[11px] sm:text-sm bg-[#3CB371] hover:bg-[#2FA05E] text-white shadow transition-all duration-300 flex items-center justify-center gap-1"
          >
            <span>Back to Login</span>
            <IoArrowForward className="w-4 h-4"/>
          </button>

          {/* Additional Help */}
          <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-100 text-center">
            <p className="text-[11px] sm:text-xs text-gray-500 mb-1 sm:mb-2">
              Still having trouble?
            </p>
            <a
              href="mailto:info.aharraa@gmail.com"
              className="text-[11px] sm:text-xs font-semibold text-[#3CB371] hover:text-[#2FA05E] transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
