'use client'

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { apiRequest } from "@/lib/api"
import { useAuth } from "@/app/context/auth-context"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5"

export default function ConfirmEmail() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Confirming your email...')
  const { login } = useAuth()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get token and type from URL hash (Supabase-style)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const type = hashParams.get('type')

        if (type === 'signup' && accessToken) {
          // Make a backend request to mark user as verified
          await apiRequest('/api/users/verify-email', 'GET', null, accessToken)
          setStatus('success')
          setMessage('Email confirmed! Redirecting...')
          toast.success('Email confirmed successfully!')
          localStorage.removeItem('pending-confirmation-email')
          // Optionally log the user in automatically
          await login(accessToken)
        } else {
          throw new Error("Invalid confirmation link")
        }
      } catch (error: any) {
        setStatus('error')
        setMessage('Email confirmation failed. Please try again or contact support.')
        toast.error(error?.message || 'Email confirmation failed')
        setTimeout(() => router.push('/auth'), 2300)
      }
    }
    confirmEmail()
    // If using App Router, [] dependencies are fine because router and login are stable.
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-3">
      <div className="w-full max-w-md rounded-xl bg-white border border-gray-100 shadow-xl p-8 flex flex-col items-center">
        {status === 'loading' && (
          <>
            <Spinner className="w-8 h-8 text-[#3CB371] mb-6" />
            <h2 className="text-lg font-bold mb-2 text-[#3CB371]">Confirming your email…</h2>
            <p className="text-sm text-gray-600 text-center">
              If not redirected automatically, you can log in via the login page.
            </p>
          </>
        )}
        {status === 'success' && (
          <>
            <IoCheckmarkCircle className="w-12 h-12 mb-5 text-[#3CB371]" />
            <h2 className="text-xl font-bold mb-2 text-[#3CB371]">Email Confirmed!</h2>
            <p className="text-sm text-gray-700 text-center mb-2">
              Your email was verified successfully.
            </p>
            <p className="text-xs text-gray-400 text-center">
              You are being logged in...
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <IoAlertCircle className="w-12 h-12 mb-5 text-red-400" />
            <h2 className="text-xl font-bold mb-2 text-red-600">Email Confirmation Failed</h2>
            <p className="text-sm text-gray-600 text-center">
              {message}
            </p>
            <button
              onClick={() => router.push('/auth')}
              className="mt-4 px-6 py-2 bg-[#3CB371] text-white rounded-lg shadow font-semibold"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  )
}
