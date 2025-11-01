"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ReviewsSection } from "@/components/reviews-section";
import { FaqSection } from "@/components/faq-section";
import { FoodShowcase } from "@/components/food-showcase";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/auth-context";
import { useEffect } from "react";
import Link from "next/link";
import { HiSparkles, HiClock, HiShieldCheck, HiHeart } from "react-icons/hi";
import { IoRestaurant } from "react-icons/io5";
import { MdDeliveryDining } from "react-icons/md";

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1)); // Remove '#'
        const accessToken = params.get("access_token");

        if (accessToken) {
          await login(accessToken);
          // Clean up the URL hash
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
          router.push("/");
        }
      }
    };

    handleOAuthRedirect();
  }, [router, login]);

  return (
    <main className="min-h-screen bg-[#FEFAE0]">
      <Header />

      {/* Hero Section with Modern Design */}
      <section className="relative bg-gradient-to-br from-[#606C38] via-[#283618] to-[#283618] py-20 md:py-28 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#DDA15E] rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#BC6C25] rounded-full filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#DDA15E] bg-opacity-20 backdrop-blur-sm border border-[#DDA15E] border-opacity-30 rounded-full px-4 py-2">
                <HiSparkles className="w-5 h-5 text-[#283618]" />
                <span className="text-sm font-medium text-[#FEFAE0]">Premium Home-Cooked Experience</span>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#FEFAE0] mb-4 leading-tight">
                  Fresh, Home-Cooked
                  <span className="block bg-gradient-to-r from-[#DDA15E] to-[#BC6C25] bg-clip-text text-transparent">
                    Meals Delivered
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-[#FEFAE0] text-opacity-90 leading-relaxed max-w-xl">
                  Experience the warmth of home-style cooking with meals prepared by talented chefs using locally-sourced ingredients. Delivered fresh to your doorstep.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/pricing" passHref>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-[#DDA15E] to-[#BC6C25] hover:from-[#BC6C25] hover:to-[#DDA15E] text-[#283618] font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
                  >
                    <IoRestaurant className="w-5 h-5 mr-2" />
                    Explore Our Meals
                  </Button>
                </Link>
                <Link href="/about" passHref>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-[#FEFAE0] border-opacity-30 text-[#283618] hover:bg-[#FEFAE0] hover:text-[#283618] backdrop-blur-sm bg-white bg-opacity-10 font-semibold transform hover:scale-105 transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-[#DDA15E]">500+</p>
                  <p className="text-sm text-[#FEFAE0] text-opacity-80">Happy Customers</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-[#DDA15E]">50+</p>
                  <p className="text-sm text-[#FEFAE0] text-opacity-80">Menu Items</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-[#DDA15E]">4.9★</p>
                  <p className="text-sm text-[#FEFAE0] text-opacity-80">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Right Content - Image Card */}
            <div className="relative animate-slide-in-right">
              <div className="relative group">
                {/* Main Card */}
                <div className="relative w-full h-96 rounded-3xl shadow-2xl overflow-hidden transform group-hover:scale-105 transition-all duration-500">
                  {/* Decorative Pattern Overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle, rgba(254, 250, 224, 0.3) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}></div>
                  </div>
                  
                  {/* Home Page Cover Image */}
                  <div className="absolute inset-0">
                    <img 
                      src="/home_page_cover.png" 
                      alt="Delicious home-cooked meal" 
                      className="w-full h-full object-contain rounded-3xl"
                    />
                  </div>

                  {/* Floating Feature Cards */}
                  <div className="absolute top-6 right-6 bg-[#FEFAE0] rounded-2xl p-4 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center gap-2">
                      <HiClock className="w-5 h-5 text-[#BC6C25]" />
                      <span className="text-sm font-semibold text-[#283618]">30 Min Delivery</span>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 bg-[#FEFAE0] rounded-2xl p-4 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center gap-2">
                      <HiShieldCheck className="w-5 h-5 text-[#606C38]" />
                      <span className="text-sm font-semibold text-[#283618]">100% Fresh</span>
                    </div>
                  </div>
                </div>

                {/* Decorative Dots */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 grid grid-cols-3 gap-2 opacity-50">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-[#DDA15E] rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              fill="#FEFAE0"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#FEFAE0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-[#606C38] border-opacity-10 hover:border-opacity-30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#606C38] to-[#283618] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <IoRestaurant className="w-8 h-8 text-[#FEFAE0]" />
              </div>
              <h3 className="text-xl font-bold text-[#283618] mb-3">Fresh Ingredients</h3>
              <p className="text-[#606C38] leading-relaxed">
                We use only the freshest, locally-sourced ingredients to ensure every meal is packed with flavor and nutrition.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-[#DDA15E] border-opacity-10 hover:border-opacity-30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#DDA15E] to-[#BC6C25] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <MdDeliveryDining className="w-8 h-8 text-[#FEFAE0]" />
              </div>
              <h3 className="text-xl font-bold text-[#283618] mb-3">Fast Delivery</h3>
              <p className="text-[#606C38] leading-relaxed">
                Hot meals delivered to your door within 30 minutes. Enjoy restaurant-quality food in the comfort of your home.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-[#BC6C25] border-opacity-10 hover:border-opacity-30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#BC6C25] to-[#DDA15E] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <HiHeart className="w-8 h-8 text-[#FEFAE0]" />
              </div>
              <h3 className="text-xl font-bold text-[#283618] mb-3">Made with Love</h3>
              <p className="text-[#606C38] leading-relaxed">
                Every dish is prepared by skilled home chefs who pour their heart into creating delicious, home-style meals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FoodShowcase />
        <ReviewsSection />
        <FaqSection />
      </div>

      <Footer />

      {/* Custom Animation Styles */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </main>
  );
}
