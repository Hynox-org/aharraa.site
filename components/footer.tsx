"use client"

import { HiMail, HiPhone, HiLocationMarker, HiHeart } from "react-icons/hi"
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-b from-[#283618] to-[#1a2410] text-[#FEFAE0] mt-20 overflow-hidden">
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="#FEFAE0"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#DDA15E] to-[#BC6C25] rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-[#283618]">A</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FEFAE0] to-[#DDA15E] bg-clip-text text-transparent">
                  Aharraa
                </h3>
              </div>
            </div>
            <p className="text-[#FEFAE0] text-opacity-80 leading-relaxed">
              Fresh, home-cooked meals delivered to your door with love and care.
            </p>
            {/* Social Media */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="#" 
                className="w-10 h-10 bg-[#606C38] bg-opacity-30 hover:bg-[#DDA15E] rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-6 group"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4 text-[#FEFAE0] group-hover:text-[#283618]" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#606C38] bg-opacity-30 hover:bg-[#DDA15E] rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-6 group"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4 text-[#FEFAE0] group-hover:text-[#283618]" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#606C38] bg-opacity-30 hover:bg-[#DDA15E] rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-6 group"
                aria-label="Twitter"
              >
                <FaTwitter className="w-4 h-4 text-[#FEFAE0] group-hover:text-[#283618]" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-[#606C38] bg-opacity-30 hover:bg-[#DDA15E] rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-6 group"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="w-4 h-4 text-[#FEFAE0] group-hover:text-[#283618]" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-[#DDA15E] mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-[#BC6C25] to-transparent"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Plans & Pricing", href: "/#pricing" },
                { label: "Menu", href: "/#menu" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-[#FEFAE0] text-opacity-80 hover:text-[#DDA15E] hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[#BC6C25] transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold text-[#DDA15E] mb-6 relative inline-block">
              Support
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-[#BC6C25] to-transparent"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { label: "FAQ", href: "/#faq" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms & Conditions", href: "/terms-and-conditions" },
                { label: "Refund Policy", href: "/cancellation-and-refund-policy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-[#FEFAE0] text-opacity-80 hover:text-[#DDA15E] hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[#BC6C25] transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-bold text-[#DDA15E] mb-6 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-[#BC6C25] to-transparent"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-[#606C38] bg-opacity-30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#DDA15E] transition-all duration-300">
                  <HiPhone className="w-5 h-5 text-[#DDA15E] group-hover:text-[#283618]" />
                </div>
                <div>
                  <p className="text-xs text-[#FEFAE0] text-opacity-60 mb-0.5">Phone</p>
                  <a href="tel:+919876543210" className="text-[#FEFAE0] hover:text-[#DDA15E] transition-colors">
                    +91 8870524355
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-[#606C38] bg-opacity-30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#DDA15E] transition-all duration-300">
                  <HiMail className="w-5 h-5 text-[#DDA15E] group-hover:text-[#283618]" />
                </div>
                <div>
                  <p className="text-xs text-[#FEFAE0] text-opacity-60 mb-0.5">Email</p>
                  <a href="mailto:info.aharraa@gmail.com" className="text-[#FEFAE0] hover:text-[#DDA15E] transition-colors break-all">
                    info.aharraa@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-[#606C38] bg-opacity-30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-[#DDA15E] transition-all duration-300">
                  <HiLocationMarker className="w-5 h-5 text-[#DDA15E] group-hover:text-[#283618]" />
                </div>
                <div>
                  <p className="text-xs text-[#FEFAE0] text-opacity-60 mb-0.5">Location</p>
                  <span className="text-[#FEFAE0]">Tamil Nadu, India</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider with Gradient */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#606C38] border-opacity-30"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-gradient-to-r from-transparent via-[#283618] to-transparent">
              <HiHeart className="w-5 h-5 text-[#BC6C25]" />
            </span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-[#FEFAE0] text-opacity-70">
            © {currentYear} <span className="font-semibold text-[#DDA15E]">Aharraa</span>. All rights reserved.
          </p>
          <p className="text-[#FEFAE0] text-opacity-70 flex items-center gap-2">
            Crafted with 
            <HiHeart className="w-4 h-4 text-[#BC6C25] animate-pulse" /> 
            by <span className="font-semibold text-[#DDA15E]">Hynox</span>
          </p>
        </div>
      </div>

      {/* Decorative Bottom Pattern */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#606C38] via-[#DDA15E] to-[#BC6C25]"></div>
    </footer>
  )
}