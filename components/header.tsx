"use client"

import Image from "next/image"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { ShoppingCart, Menu, X, UserCircle } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/app/context/auth-context"

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const cart = useStore((state) => state.cart)
  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <Image src="/logo.png" alt="Aharraa" width={45} height={45} className="rounded" unoptimized />
          <div className="hidden sm:block">
            <span className="text-2xl font-bold text-green-900">Aharraa</span>
            <p className="text-xs text-neutral-600">Fresh Home-Cooked Meals</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-700 hover:text-orange-500 transition"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-orange-500 transition"
              >
                <UserCircle size={20} />
                {user?.name || "Profile"}
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-sm font-medium text-neutral-700 hover:text-orange-500 transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="text-sm font-medium text-white bg-orange-500 px-4 py-2 rounded-md hover:bg-orange-600 transition"
              >
                Sign Up
              </Link>
            </>
          )}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-orange-500 transition"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Menu Button and Cart */}
        <div className="md:hidden flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-orange-500 transition"
            >
              <UserCircle size={20} />
            </Link>
          ) : (
            <Link
              href="/auth"
              className="text-sm font-medium text-neutral-700 hover:text-orange-500 transition"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-orange-500 transition"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-neutral-700 hover:text-orange-500 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-0 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-orange-50 hover:text-orange-500 transition rounded-lg"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition rounded-lg"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-orange-50 hover:text-orange-500 transition rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
