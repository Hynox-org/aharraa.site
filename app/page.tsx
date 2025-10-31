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

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1)); // Remove '#'
        const accessToken = params.get("access");

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
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-50 to-white py-16 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-4 text-balance">
                Fresh, Home-Cooked Meals
              </h1>
              <p className="text-xl text-orange-600 font-semibold mb-4">
                Delivered to Your Door
              </p>
              <p className="text-neutral-600 mb-8 text-balance">
                Our talented home chefs prepare delicious meals made with
                locally-sourced ingredients, so you can enjoy home style food
                in the comfort of your own home.
              </p>
              <Link href="/pricing" passHref>
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Explore Our Pricing & Meals
                </Button>
              </Link>
            </div>
            <div className="flex justify-center animate-slide-in-right">
              <div className="relative w-full h-80 bg-orange-100 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-6xl animate-pulse">🍲</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FoodShowcase />
        <ReviewsSection />
        <FaqSection />
      </div>

      <Footer />
    </main>
  );
}
