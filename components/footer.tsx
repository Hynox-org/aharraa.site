"use client"

import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-white mt-20 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-orange-500 mb-4">Aharraa</h3>
            <p className="text-neutral-400">Fresh, home-cooked meals delivered to your door.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Plans & Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Menu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="hover:text-orange-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-and-conditions" className="hover:text-orange-500 transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-neutral-400">
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-orange-500" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-orange-500" />
                <span>hello@aharraa.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-orange-500 mt-1" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400">© 2025 Aharraa. All rights reserved.</p>
            <p className="text-neutral-400">
              Powered by <span className="text-orange-500 font-semibold">Hynox</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
