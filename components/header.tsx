"use client"

import Image from "next/image"
import Link from "next/link"
import { HiShoppingCart, HiMenu, HiX, HiUser, HiLogout, HiHome, HiInformationCircle, HiMail, HiTag } from "react-icons/hi"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/auth-context"
import { getCartTotalQuantity } from "@/lib/api"

export function Header() {
  const { isAuthenticated, user, logout, token } = useAuth()
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchCartQuantity = async () => {
      if (isAuthenticated && user?.id && token) {
        try {
          const response = await getCartTotalQuantity(user.id, token)
          setCartCount(response.totalItems)
        } catch (error) {
          console.error("Failed to fetch cart total quantity:", error)
          setCartCount(0)
        }
      } else {
        setCartCount(0)
      }
    }

    fetchCartQuantity()
  }, [isAuthenticated, user?.id, token])

  const navLinks = [
    { href: "/", label: "Home", icon: HiHome },
    { href: "/about", label: "About Us", icon: HiInformationCircle },
    { href: "/pricing", label: "Pricing", icon: HiTag },
    { href: "/contact", label: "Contact", icon: HiMail },
  ]

  return (
    <header className="sticky top-0 z-50 shadow-md backdrop-blur-sm bg-white border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg sm:rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity bg-[#3CB371]" />
              <div className="relative rounded-lg sm:rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300 bg-[#3CB371]">
                <Image
                  src="/logo.png"
                  alt="Aharraa"
                  width={40}
                  height={40}
                  className="rounded-lg sm:w-[50px] sm:h-[50px]"
                  unoptimized
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter text-black leading-tight">
                AHARRAA
              </span>
              <p className="text-[10px] sm:text-xs font-medium tracking-wide hidden sm:block text-[#3CB371]">
                Fresh Home-Cooked Meals
              </p>
            </div>
          </Link>

          {/* Desktop Navigation - Hidden on Mobile/Tablet */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3 xl:px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 text-black hover:text-white hover:bg-[#3CB371]"
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 ml-2">
                  <Link href="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 border border-gray-200">
                    <HiUser className="w-5 h-5 text-[#3CB371]" />
                    <span className="text-sm font-medium max-w-[80px] xl:max-w-[100px] truncate text-black">
                      {user?.email?.split('@')[0] || 'User'}
                    </span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 xl:px-4 py-2.5 text-sm font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white bg-[#3CB371] hover:bg-[#2FA05E]"
                  >
                    <HiLogout className="w-4 h-4" />
                    <span className="hidden xl:inline">Sign Out</span>
                    <span className="xl:hidden">Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  href="/auth"
                  className="px-3 xl:px-4 py-2.5 text-sm font-semibold transition-colors duration-300 text-black hover:text-[#3CB371]"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  className="px-4 xl:px-5 py-2.5 text-sm font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white bg-[#3CB371] hover:bg-[#2FA05E]"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative ml-2 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 group text-black bg-gray-100 hover:text-white hover:bg-[#3CB371]"
            >
              <HiShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse bg-[#3CB371] text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile/Tablet Actions */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-3">
            {isAuthenticated && (
              <Link href="/profile" className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-gray-100">
                <HiUser className="w-4 h-4 text-[#3CB371]" />
                <span className="text-xs font-medium hidden xs:inline max-w-[60px] truncate text-black">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </Link>
            )}
            <Link
              href="/cart"
              className="relative p-2 sm:p-2.5 rounded-xl transition-all duration-300 text-black bg-gray-100"
            >
              <HiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-lg bg-[#3CB371] text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-xl transition-all duration-300 text-black bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <HiX className="w-5 h-5 sm:w-6 sm:h-6" /> : <HiMenu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Navigation Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="shadow-inner bg-white border-t-2 border-gray-200">
          <nav className="flex flex-col gap-1 px-3 sm:px-4 py-3 sm:py-4">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 text-sm font-semibold rounded-xl border shadow-sm transition-all duration-300 transform hover:translate-x-1 text-black bg-white border-gray-200 hover:text-white hover:bg-[#3CB371] hover:border-transparent"
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              )
            })}
            <div className="h-px my-2 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl border mb-2 bg-gray-50 border-gray-200"
                >
                  <HiUser className="w-5 h-5 text-[#3CB371]" />
                  <span className="text-sm font-medium truncate text-black">
                    {user?.email || 'User'}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-center gap-2 w-full px-3 sm:px-4 py-3 sm:py-3.5 text-sm font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 text-white bg-[#3CB371] hover:bg-[#2FA05E]"
                >
                  <HiLogout className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-3.5 text-sm font-semibold rounded-xl border-2 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-300 text-black bg-white border-[#3CB371] hover:text-white hover:bg-[#3CB371]"
                >
                  <HiUser className="w-5 h-5" />
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-3.5 text-sm font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 text-white bg-[#3CB371] hover:bg-[#2FA05E]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
