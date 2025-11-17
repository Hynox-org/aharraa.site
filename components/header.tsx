"use client"

import Image from "next/image"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { HiShoppingCart, HiMenu, HiX, HiUser, HiLogout, HiHome, HiInformationCircle, HiMail } from "react-icons/hi"
import { useState, useEffect } from "react"
import { useAuth } from "@/app/context/auth-context"
import { getCartTotalQuantity } from "@/lib/api" // Import the new API function

export function Header() {
  const { isAuthenticated, user, logout, token } = useAuth() // Get token from useAuth
  const [cartCount, setCartCount] = useState(0) // Initialize cartCount with useState
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchCartQuantity = async () => {
      if (isAuthenticated && user?.id && token) {
        try {
          const response = await getCartTotalQuantity(user.id, token)
          setCartCount(response.totalItems)
        } catch (error) {
          console.error("Failed to fetch cart total quantity:", error)
          setCartCount(0) // Reset cart count on error
        }
      } else {
        setCartCount(0) // Reset cart count if not authenticated
      }
    }

    fetchCartQuantity()
  }, [isAuthenticated, user?.id, token]) // Re-run when auth status, user ID, or token changes

  const navLinks = [
    { href: "/", label: "Home", icon: HiHome },
    { href: "/about", label: "About Us", icon: HiInformationCircle },
    { href: "/contact", label: "Contact", icon: HiMail },
  ]

  const authLinks = [
    { href: "/profile", label: "Profile", icon: HiUser },
  ]

  return (
    <header className="sticky top-0 z-50 shadow-md backdrop-blur-sm" 
      style={{ 
        backgroundColor: "rgba(254, 250, 224, 0.95)",
        borderBottom: "2px solid #DDA15E"
      }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg sm:rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" 
                style={{ backgroundColor: "#606C38" }} />
              <div className="relative rounded-lg sm:rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                style={{ background: "linear-gradient(135deg, #606C38, #283618)" }}>
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
            <div className="hidden xs:block">
              <span className="text-lg sm:text-2xl font-bold"
                style={{
                  background: "linear-gradient(to right, #283618, #606C38, #283618)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                Aharraa
              </span>
              <p className="text-[10px] sm:text-xs font-medium tracking-wide hidden sm:block" 
                style={{ color: "#BC6C25" }}>
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
                  className="flex items-center gap-2 px-3 xl:px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                  style={{
                    color: "#283618"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#FEFAE0"
                    e.currentTarget.style.backgroundColor = "#606C38"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#283618"
                    e.currentTarget.style.backgroundColor = "transparent"
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              )
            })}
            
            {isAuthenticated ? (
              <>
                {authLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 px-3 xl:px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                      style={{
                        color: "#283618"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#FEFAE0"
                        e.currentTarget.style.backgroundColor = "#606C38"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#283618"
                        e.currentTarget.style.backgroundColor = "transparent"
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  )
                })}
                <div className="flex items-center gap-2 ml-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: "rgba(40, 54, 24, 0.1)",
                      border: "1px solid rgba(96, 108, 56, 0.2)"
                    }}>
                    <HiUser className="w-5 h-5" style={{ color: "#606C38" }} />
                    <span className="text-sm font-medium max-w-[80px] xl:max-w-[100px] truncate" 
                      style={{ color: "#283618" }}>
                      {user?.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 xl:px-4 py-2.5 text-sm font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    style={{
                      color: "#FEFAE0",
                      background: "linear-gradient(to right, #BC6C25, #DDA15E)"
                    }}
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
                  className="px-3 xl:px-4 py-2.5 text-sm font-semibold transition-colors duration-300"
                  style={{ color: "#283618" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#606C38"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#283618"}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  className="px-4 xl:px-5 py-2.5 text-sm font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  style={{
                    color: "#FEFAE0",
                    background: "linear-gradient(to right, #DDA15E, #BC6C25)"
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative ml-2 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 group"
              style={{
                color: "#283618",
                backgroundColor: "rgba(96, 108, 56, 0.1)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#FEFAE0"
                e.currentTarget.style.backgroundColor = "#606C38"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#283618"
                e.currentTarget.style.backgroundColor = "rgba(96, 108, 56, 0.1)"
              }}
            >
              <HiShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse"
                  style={{
                    background: "linear-gradient(to right, #BC6C25, #DDA15E)",
                    color: "#FEFAE0"
                  }}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile/Tablet Actions */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-3">
            {isAuthenticated && (
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
                style={{ backgroundColor: "rgba(40, 54, 24, 0.1)" }}>
                <HiUser className="w-4 h-4" style={{ color: "#606C38" }} />
                <span className="text-xs font-medium hidden xs:inline max-w-[60px] truncate" 
                  style={{ color: "#283618" }}>
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
            )}
            <Link
              href="/cart"
              className="relative p-2 sm:p-2.5 rounded-xl transition-all duration-300"
              style={{
                color: "#283618",
                backgroundColor: "rgba(96, 108, 56, 0.1)"
              }}
            >
              <HiShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-lg"
                  style={{
                    background: "linear-gradient(to right, #BC6C25, #DDA15E)",
                    color: "#FEFAE0"
                  }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 rounded-xl transition-all duration-300"
              style={{
                color: "#283618",
                backgroundColor: "rgba(96, 108, 56, 0.1)"
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <HiX className="w-5 h-5 sm:w-6 sm:h-6" /> : <HiMenu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Navigation Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="shadow-inner"
          style={{
            background: "linear-gradient(to bottom, #FEFAE0, #FEFAE0)",
            borderTop: "2px solid #DDA15E"
          }}>
          <nav className="flex flex-col gap-1 px-3 sm:px-4 py-3 sm:py-4">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 text-sm font-semibold rounded-xl border shadow-sm transition-all duration-300 transform hover:translate-x-1"
                  style={{
                    color: "#283618",
                    backgroundColor: "#ffffff",
                    borderColor: "rgba(221, 161, 94, 0.2)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#FEFAE0"
                    e.currentTarget.style.background = "linear-gradient(to right, #606C38, #283618)"
                    e.currentTarget.style.borderColor = "transparent"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#283618"
                    e.currentTarget.style.backgroundColor = "#ffffff"
                    e.currentTarget.style.borderColor = "rgba(221, 161, 94, 0.2)"
                  }}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              )
            })}
            <div className="h-px my-2" 
              style={{ background: "linear-gradient(to right, transparent, #DDA15E, transparent)" }} />
            
            {isAuthenticated ? (
              <>
                {authLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 text-sm font-semibold rounded-xl border shadow-sm transition-all duration-300 transform hover:translate-x-1"
                      style={{
                        color: "#283618",
                        backgroundColor: "#ffffff",
                        borderColor: "rgba(221, 161, 94, 0.2)"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#FEFAE0"
                        e.currentTarget.style.background = "linear-gradient(to right, #606C38, #283618)"
                        e.currentTarget.style.borderColor = "transparent"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#283618"
                        e.currentTarget.style.backgroundColor = "#ffffff"
                        e.currentTarget.style.borderColor = "rgba(221, 161, 94, 0.2)"
                      }}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  )
                })}
                <div className="flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl border mb-2"
                  style={{
                    backgroundColor: "rgba(40, 54, 24, 0.05)",
                    borderColor: "rgba(96, 108, 56, 0.2)"
                  }}>
                  <HiUser className="w-5 h-5" style={{ color: "#606C38" }} />
                  <span className="text-sm font-medium truncate" style={{ color: "#283618" }}>
                    {user?.email || 'User'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-center gap-2 w-full px-3 sm:px-4 py-3 sm:py-3.5 text-sm font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                  style={{
                    color: "#FEFAE0",
                    background: "linear-gradient(to right, #BC6C25, #DDA15E)"
                  }}
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
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-3.5 text-sm font-semibold rounded-xl border-2 shadow-sm hover:shadow-md transform hover:scale-[1.02] transition-all duration-300"
                  style={{
                    color: "#283618",
                    backgroundColor: "#ffffff",
                    borderColor: "#606C38"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#FEFAE0"
                    e.currentTarget.style.backgroundColor = "#606C38"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#283618"
                    e.currentTarget.style.backgroundColor = "#ffffff"
                  }}
                >
                  <HiUser className="w-5 h-5" />
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-3 sm:py-3.5 text-sm font-bold rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                  style={{
                    color: "#FEFAE0",
                    background: "linear-gradient(to right, #DDA15E, #BC6C25)"
                  }}
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
