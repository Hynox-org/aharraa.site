"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/auth-context";
import { useEffect, useState } from "react";
import { HiSparkles, HiArrowRight } from "react-icons/hi";
import { IoRestaurant, IoFastFood, IoNutrition } from "react-icons/io5";
import { Spinner } from "@/components/ui/spinner";
import { useStore } from "@/lib/store";
import LottieAnimation from "@/components/lottie-animation";
import ItayCheffAnimation from "../public/lottie/ItayCheff.json";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FoodShowcase } from "@/components/food-showcase";
import { ReviewsSection } from "@/components/reviews-section";
import { FaqSection } from "@/components/faq-section";

export default function Home() {
  const router = useRouter();
  const { login, loading: authLoading } = useAuth();
  const [isLoadingHashToken, setIsLoadingHashToken] = useState(true);

  const [cards, setCards] = useState<{ id: number; image: string; title: string; desc: string; instanceId?: number }[]>([
    {
      id: 1,
      image: "/defaults/hero1.jpeg",
      title: "Veg Briyani",
      desc: "Veg briyani with curd raita & one egg"
    },
    {
      id: 2,
      image: "/defaults/hero2.png",
      title: "Chapati",
      desc: "Chapati with gravy"
    },
    {
      id: 3,
      image: "/defaults/hero3.jpeg",
      title: "Mini Idly",
      desc: "mini idly with coconut chutney & kalla chutney"
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards((prev) => {
        const newCards = [...prev];
        const first = newCards.shift();
        if (first) {
          newCards.push({ ...first, instanceId: Date.now() });
        }
        return newCards;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

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

      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#fafafa]">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#3CB371]/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-400/20 rounded-full blur-[100px]" />
        </div>

        {/* Large "Behind" Typography */}
        <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[12vw] md:text-[15vw] font-black text-gray-200/60 select-none pointer-events-none tracking-tighter z-0 leading-none text-center">
          TASTE<br />MAGIC
        </h1>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center h-full">

          {/* Left Content - Floating Glass Panel */}
          <div className="order-1 lg:order-1 relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}

              className="space-y-8 max-w-xl mx-auto lg:mx-0 relative z-20"
            >
              <div className="flex items-center justify-center gap-2 py-2">
                <Badge variant="secondary" className="bg-[#3CB371]/10 text-right text-[#3CB371] hover:bg-[#3CB371]/20 px-4 py-1.5 text-sm font-semibold border-none">
                  {/* <HiSparkles className="mr-2 h-4 w-4" /> #1 Home Cooked Meals */}
                  <HiSparkles className="mr-2 h-4 w-4" /> Home Cooked Meals
                </Badge>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                Not Just Food,<br />
                It's an <span className="text-[#3CB371] inline-block relative">
                  Emotion.
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#3CB371]/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 font-medium">
                Experience the nostalgia of pure, home-cooked flavors delivered right to your doorstep. No preservatives, just love.
              </p>

              <div className="flex flex-col justify-center sm:flex-row gap-4 py-5">
                <Button onClick={() => router.push('/pricing')} size="lg" className="hidden md:flex bg-[#3CB371] hover:bg-[#2e8b57] text-white rounded-full px-8 h-12 text-lg shadow-lg hover:shadow-[#3CB371]/30 transition-all">
                  Order Now <HiArrowRight className="ml-2" />
                </Button>
                <Button onClick={() => router.push('/contact')} size="lg" variant="ghost" className="rounded-full px-8 h-12 text-lg bg-white/80 border border-gray-200 shadow-sm md:bg-transparent md:border-transparent md:shadow-none hover:bg-white/90 md:hover:bg-white/50">
                  Contact Us
                </Button>
              </div>

              {/* <div className="flex items-center justify-center gap-6 py-6">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-white/60 flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-900">500+</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Daily Orders</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-900">4.9</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">Rating</span>
                  </div>
                </div>
              </div> */}
            </motion.div>
          </div>

          {/* Right - Interactive Card Stack */}
          <div className="order-2 lg:order-2 flex justify-center items-center relative h-[500px] lg:h-[600px]">
            <div className="relative w-72 h-[420px] md:w-80 md:h-[480px] perspective-1000">
              <AnimatePresence mode="popLayout">
                {cards.map((card, index) => (
                  <motion.div
                    key={card.instanceId || card.id}
                    layout // Enable layout animations for smooth position changes
                    initial={{ scale: 0.8, y: 150, opacity: 0 }}
                    animate={{
                      zIndex: cards.length - index,
                      scale: index === 0 ? 1 : index === 1 ? 0.95 : 0.9,
                      y: index === 0 ? 0 : index === 1 ? -25 : -50,
                      x: index === 0 ? 0 : index === 1 ? 20 : 40,
                      rotate: index === 0 ? 0 : index === 1 ? 5 : 10,
                      opacity: index > 2 ? 0 : 1,
                      filter: index === 0 ? "blur(0px)" : "blur(2px)",
                    }}
                    exit={{
                      x: 400,
                      y: -300,
                      rotate: 45,
                      opacity: 0,
                      scale: 0.5,
                      transition: { duration: 0.5, ease: "easeIn" }
                    }}
                    transition={{ type: "spring", stiffness: 180, damping: 20 }}
                    className="absolute inset-0 bg-white rounded-[2rem] shadow-2xl overflow-hidden border-4 border-white"
                    style={{
                      transformOrigin: "center center",
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }}
                  >
                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />

                    {/* Glassmorphism Overlay on Card */}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-white text-2xl font-bold tracking-tight">{card.title}</h3>
                        <p className="text-white/90 text-sm font-medium mt-1 flex items-center gap-2">
                          <IoRestaurant className="text-[#3CB371]" /> {card.desc}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Visual orbit element behind cards */}
            <div className="absolute md:-right-00 -z-10 animate-spin-slow">
              <svg width="600" height="600" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-100">
                <circle cx="300" cy="300" r="299.5" stroke="#3CB371" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="10 10" />
                <circle cx="300" cy="300" r="239.5" stroke="#FBBF24" strokeOpacity="0.8" strokeWidth="3" strokeDasharray="20 20" />
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section - Cleaned Up */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Aharraa?</h2>
            <p className="text-gray-600 text-lg">We bring the best of both worlds: Health and Taste.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: IoNutrition, title: "Healthy Eating", desc: "Balanced macros in every meal." },
              { icon: IoFastFood, title: "Super Tasty", desc: "No compromise on flavors." },
              { icon: IoRestaurant, title: "Chef Special", desc: "Curated by top home chefs." }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-10 h-10 text-[#3CB371]" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Re-integrate other sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FoodShowcase />
        <FaqSection />
      </div>

      <Footer />

      {/* Custom Animation Styles */}
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
      <div className="fixed bottom-6 left-0 right-0 px-6 z-50 md:hidden pb-safe">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button onClick={() => router.push('/pricing')} size="lg" className="w-full bg-black hover:bg-[#2e8b57] text-white rounded-full h-14 text-xl shadow-2xl shadow-[#3CB371]/40 transition-transform active:scale-95">
            Order Now <HiArrowRight className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
