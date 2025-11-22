"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ReviewsSection } from "@/components/reviews-section";
import { FaqSection } from "@/components/faq-section";
import { FoodShowcase } from "@/components/food-showcase";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/auth-context";
import { useEffect, useState } from "react";
import Link from "next/link";
import { HiSparkles, HiClock, HiShieldCheck, HiHeart } from "react-icons/hi";
import { IoRestaurant, IoArrowForward } from "react-icons/io5";
import { MdDeliveryDining } from "react-icons/md";
import { Spinner } from "@/components/ui/spinner";
import { useStore } from "@/lib/store";
import LottieAnimation from "@/components/lottie-animation";
import ItayCheffAnimation from "../public/lottie/ItayCheff.json";

export default function Home() {
  const router = useRouter();
  const { login, loading: authLoading } = useAuth();
  const [isLoadingHashToken, setIsLoadingHashToken] = useState(true);

  const { returnUrl: storedReturnUrl, setReturnUrl } = useStore();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");

        if (accessToken) {
          await login(accessToken);
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
          router.push("/");
        }
      }
      setIsLoadingHashToken(false);
    };

    handleOAuthRedirect();

    if (!authLoading && !isLoadingHashToken && storedReturnUrl) {
      router.push(storedReturnUrl);
      setReturnUrl(null);
    }

  }, [router, login, authLoading, isLoadingHashToken, storedReturnUrl, setReturnUrl]);

  if (authLoading || isLoadingHashToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LottieAnimation animationData={ItayCheffAnimation} style={{ width: 200, height: 200 }} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Modern Minimal */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#3CB371] rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3CB371] rounded-full filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 shadow-sm">
                <HiSparkles className="w-5 h-5 text-[#3CB371]" />
                <span className="text-sm font-semibold text-black">Premium Home-Cooked Experience</span>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 leading-tight">
                  Fresh, Home-Cooked
                  <span className="block text-[#3CB371]">
                    Meals Delivered
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                  Experience the warmth of home-style cooking with meals prepared by talented chefs using locally-sourced ingredients. Delivered fresh to your doorstep.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/pricing" passHref>
                  <Button 
                    size="lg" 
                    className="bg-[#3CB371] hover:bg-[#2FA05E] text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0"
                  >
                    <IoRestaurant className="w-5 h-5 mr-2" />
                    Explore Our Meals
                  </Button>
                </Link>
                <Link href="/about" passHref>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-2 border-gray-300 text-black hover:bg-gray-50 hover:border-gray-400 font-semibold transform hover:scale-105 transition-all duration-300"
                  >
                    Learn More
                    <IoArrowForward className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-8 pt-6">
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-black text-black">500+</p>
                  <p className="text-sm text-gray-500">Happy Customers</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-black text-black">50+</p>
                  <p className="text-sm text-gray-500">Menu Items</p>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl md:text-4xl font-black text-black">4.9★</p>
                  <p className="text-sm text-gray-500">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Right Content - Image Card */}
            <div className="relative animate-slide-in-right">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-[#3CB371] rounded-3xl blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                
                {/* Main Card */}
                <div className="relative w-full h-96 md:h-[28rem] rounded-3xl overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-500 bg-white">
                  {/* Image */}
                  <div className="absolute inset-0">
                    <img 
                      src="/home_page_cover.png" 
                      alt="Delicious home-cooked meal" 
                      className="w-full h-full object-contain rounded-3xl"
                    />
                  </div>

                  {/* Floating Feature Cards */}
                  <div className="absolute top-6 right-6 bg-white rounded-2xl p-3 md:p-4 shadow-xl border border-gray-100 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#3CB371] flex items-center justify-center">
                        <HiClock className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-black">30 Min Delivery</span>
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 bg-white rounded-2xl p-3 md:p-4 shadow-xl border border-gray-100 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#3CB371] flex items-center justify-center">
                        <HiShieldCheck className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-black">100% Fresh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Floating Cards */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="group bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#3CB371] rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <IoRestaurant className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-black mb-3">Fresh Ingredients</h3>
              <p className="text-gray-600 leading-relaxed">
                We use only the freshest, locally-sourced ingredients to ensure every meal is packed with flavor and nutrition.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#3CB371] rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <MdDeliveryDining className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-black mb-3">Fast Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Hot meals delivered to your door within 30 minutes. Enjoy restaurant-quality food in the comfort of your home.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-[#3CB371] rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <HiHeart className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-black mb-3">Made with Love</h3>
              <p className="text-gray-600 leading-relaxed">
                Every dish is prepared by skilled home chefs who pour their heart into creating delicious, home-style meals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <FoodShowcase />
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
