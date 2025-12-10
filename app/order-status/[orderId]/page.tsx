"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/app/context/auth-context";
import { getOrderDetails, verifyPayment } from "@/lib/api";
import { Order, PopulatedOrderItem } from "@/lib/types";
import LottieAnimation from "@/components/lottie-animation";
import ItayCheffAnimation from "@/public/lottie/ItayCheff.json";
import {
  IoCheckmarkCircle,
  IoHome,
  IoReceipt,
  IoCalendar,
  IoWallet,
  IoLocation,
  IoCart,
  IoRefresh,
  IoTimeOutline,
  IoAlertCircle,
  IoChevronForward,
  IoCheckmarkDone,
} from "react-icons/io5";
import { FaTruck } from "react-icons/fa";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

export default function OrderStatusPage({
  params,
}: {
  params: { orderId: string } | Promise<{ orderId: string }>;
}) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);
  const POLLING_INTERVAL = 30000;

  // Confetti animation for successful orders
  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#3CB371", "#34A166", "#2FA05E"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#3CB371", "#34A166", "#2FA05E"],
      });
    }, 250);
  };

  const fetchOrder = async (currentOrderId: string, showToast = false) => {
    try {
      if (isRefreshing) return;
      setPageLoading(true);
      setIsRefreshing(true);
      const token = localStorage.getItem("aharraa-u-token");
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        router.push("/auth?returnUrl=/order-status/" + currentOrderId);
        return;
      }
      const verificationResponse = await verifyPayment(currentOrderId, token);
      if (verificationResponse) {
        toast.success(verificationResponse.message);
      }
      const orderDetails = await getOrderDetails(currentOrderId, token);
      setOrder(orderDetails);
    } catch (err: any) {
      console.error("Error fetching order details or verifying payment:", err);
      setError(err.message || "Failed to fetch order details or verify payment.");
      toast.error(err.message || "Failed to fetch order details or verify payment.");
    } finally {
      setPageLoading(false);
      setIsRefreshing(false);
      if (showToast) {
        toast.success("Order status refreshed automatically!");
      }
    }
  };

  const handleRefresh = async () => {
    if (!orderId) {
      toast.error("Order ID not available for refresh.");
      return;
    }
    setIsRefreshing(true);
    await fetchOrder(orderId);
    setIsRefreshing(false);
    toast.success("Order status refreshed!");
  };

  useEffect(() => {
    const resolveParams = async () => {
      let currentOrderId: string | null = null;
      if (params instanceof Promise) {
        const resolved = await params;
        currentOrderId = resolved.orderId;
      } else {
        currentOrderId = params.orderId;
      }
      setOrderId(currentOrderId);

      if (!loading && !isAuthenticated) {
        router.push("/auth?returnUrl=/order-status/" + currentOrderId);
        return;
      }

      if (isAuthenticated && user && currentOrderId) {
        fetchOrder(currentOrderId);
      }
    };
    resolveParams();
  }, [isAuthenticated, loading, user, params, router]);

  // Trigger confetti for confirmed orders
  useEffect(() => {
    if (order?.status === "confirmed" && !hasTriggeredConfetti) {
      triggerConfetti();
      setHasTriggeredConfetti(true);
    }
  }, [order?.status, hasTriggeredConfetti]);

  // Polling mechanism
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAuthenticated && user && orderId) {
      interval = setInterval(() => {
        console.log("Polling for order status...");
        fetchOrder(orderId, true);
      }, POLLING_INTERVAL);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAuthenticated, user, orderId, isRefreshing]);

  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA]">
        <LottieAnimation animationData={ItayCheffAnimation} style={{ width: 200, height: 200 }} />
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F8F9FA]">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-red-50">
              <IoAlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-red-600">Something Went Wrong</h1>
            <p className="text-lg mb-8 text-[#333333]">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-xl transition-all bg-[#3CB371] hover:bg-[#34A166] text-white shadow-lg"
            >
              <IoHome className="w-5 h-5" />
              Go to Homepage
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#F8F9FA]">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-[#E5E5E5] p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-gray-100">
              <IoReceipt className="w-12 h-12 text-[#B3B3B3]" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-[#000000]">Order Not Found</h1>
            <p className="text-lg mb-8 text-[#333333]">
              The order with ID "{orderId}" could not be found.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold rounded-xl transition-all bg-[#3CB371] hover:bg-[#34A166] text-white shadow-lg"
            >
              <IoHome className="w-5 h-5" />
              Go to Homepage
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          color: "#3CB371",
          bgColor: "bg-[#3CB371]",
          lightBg: "bg-green-50",
          icon: <IoCheckmarkCircle className="w-16 h-16 sm:w-20 sm:h-20" />,
          title: "Order Confirmed!",
          subtitle: "Thank you for your purchase. Your delicious meals are on the way!",
          badge: "Success",
        };
      case "pending":
        return {
          color: "#FFA500",
          bgColor: "bg-orange-500",
          lightBg: "bg-orange-50",
          icon: <IoTimeOutline className="w-16 h-16 sm:w-20 sm:h-20" />,
          title: "Order Pending",
          subtitle: "Your order is being processed. We'll update you soon!",
          badge: "Processing",
        };
      case "readyForDelivery":
        return {
          color: "#3CB371",
          bgColor: "bg-[#3CB371]",
          lightBg: "bg-purple-50",
          icon: <FaTruck className="w-16 h-16 sm:w-20 sm:h-20" />,
          title: "Ready for Delivery!",
          subtitle: "Your order is ready and will be delivered soon.",
          badge: "Ready",
        };
      default:
        return {
          color: "#3CB371",
          bgColor: "bg-[#3CB371]",
          lightBg: "bg-gray-50",
          icon: <IoCheckmarkDone className="w-16 h-16 sm:w-20 sm:h-20" />,
          title: `Order ${status}`,
          subtitle: "Your order status has been updated.",
          badge: status,
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Success Hero Section */}
        <div
          className={`relative overflow-hidden rounded-2xl ${statusConfig.bgColor} p-8 sm:p-12 mb-6 text-white shadow-2xl`}
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

          <div className="relative z-10 text-center">
            {/* Status Icon */}
            <div className="inline-flex items-center justify-center mb-6">
              {statusConfig.icon}
            </div>

            {/* Title and Badge */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">{statusConfig.title}</h1>
              <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {statusConfig.badge}
              </span>
            </div>

            <p className="text-lg sm:text-xl mb-6 opacity-90">{statusConfig.subtitle}</p>

            {/* Order ID */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <IoReceipt className="w-5 h-5" />
              <span className="font-semibold">Order #{order._id?.substring(0, 10).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#000000] flex items-center gap-2">
                  <IoReceipt className="w-6 h-6 text-[#3CB371]" />
                  Order Summary
                </h2>
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[#3CB371] hover:bg-[#34A166] text-white disabled:bg-[#B3B3B3] transition-colors"
                >
                  <IoRefresh className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F8F9FA] rounded-lg">
                  <p className="text-xs text-[#333333] mb-1 font-medium">Order ID</p>
                  <p className="text-sm font-bold text-[#000000] break-all">{order._id}</p>
                </div>
                <div className="p-4 bg-[#F8F9FA] rounded-lg">
                  <p className="text-xs text-[#333333] mb-1 font-medium">Status</p>
                  <p
                    className="text-sm font-bold uppercase"
                    style={{ color: statusConfig.color }}
                  >
                    {order.status}
                  </p>
                </div>
                <div className="p-4 bg-[#F8F9FA] rounded-lg">
                  <p className="text-xs text-[#333333] mb-1 font-medium">Order Date</p>
                  <p className="text-sm font-bold text-[#000000] flex items-center gap-1">
                    <IoCalendar className="w-4 h-4 text-[#3CB371]" />
                    {new Date(order.orderDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="p-4 bg-[#F8F9FA] rounded-lg">
                  <p className="text-xs text-[#333333] mb-1 font-medium">Total Amount</p>
                  <p className="text-xl font-bold text-[#3CB371]">₹{order.totalAmount.toFixed(0)}</p>
                </div>
              </div>
            </div>

            {/* Order Items Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#000000]">
                <IoCart className="w-6 h-6 text-[#3CB371]" />
                Your Items ({(order.items as unknown as PopulatedOrderItem[]).length})
              </h2>

              <div className="space-y-4">
                {(order.items as unknown as PopulatedOrderItem[]).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 rounded-xl border border-[#E5E5E5] hover:border-[#3CB371] hover:shadow-md transition-all"
                  >
                    {/* Item Image (if available) */}
                    {item.menu?.coverImage && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.menu.coverImage}
                          alt={item.menu?.name || "Meal"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-[#000000] mb-1">
                        {item.menu?.name || "N/A"}
                      </h3>
                      <p className="text-sm text-[#333333] mb-1">
                        {item.plan?.name || "N/A"} · {item.vendor?.name || "N/A"}
                      </p>
                      <p className="text-xs text-[#B3B3B3]">Quantity: {item.quantity}</p>
                    </div>

                    {/* Item Price */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#3CB371]">
                        ₹{item.itemTotalPrice.toFixed(0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Addresses Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#000000]">
                <IoLocation className="w-6 h-6 text-[#3CB371]" />
                Delivery Addresses
              </h2>

              <div className="space-y-4">
                {order.deliveryAddresses &&
                  Object.entries(order.deliveryAddresses).map(([category, address]) => (
                    <div
                      key={category}
                      className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F8F9FA]"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-[#3CB371]"></div>
                        <p className="font-bold text-sm text-[#000000] capitalize">{category}</p>
                      </div>
                      <p className="text-sm text-[#333333] pl-4">
                        {address.street}, {address.city} - {address.zip}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Payment Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Payment Details Card */}
            {order.paymentMethod !== "COD" && order.paymentSessionId && (
              <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#000000]">
                  <IoWallet className="w-6 h-6 text-[#3CB371]" />
                  Payment Info
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-[#F8F9FA] rounded-lg">
                    <p className="text-xs text-[#333333] mb-1 font-medium">Payment Method</p>
                    <p className="text-sm font-bold text-[#000000]">{order.paymentMethod}</p>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <IoCheckmarkCircle className="w-5 h-5 text-[#3CB371]" />
                    <span className="text-sm font-medium text-[#3CB371]">Payment Verified</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-6">
              <h2 className="text-lg font-bold mb-4 text-[#000000]">Quick Actions</h2>

              <div className="space-y-3">
                <Link
                  href={`/order-details/${order._id}`}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold rounded-lg bg-[#3CB371] hover:bg-[#34A166] text-white transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <IoReceipt className="w-5 h-5" />
                    <span>View Full Details</span>
                  </div>
                  <IoChevronForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/pricing"
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-semibold rounded-lg border-2 border-[#3CB371] text-[#3CB371] hover:bg-[#3CB371] hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <IoCart className="w-5 h-5" />
                    <span>Order Again</span>
                  </div>
                  <IoChevronForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg bg-[#F8F9FA] hover:bg-[#E5E5E5] text-[#000000] transition-all"
                >
                  <IoHome className="w-5 h-5" />
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>

            {/* Next Steps Info */}
            <div className="bg-gradient-to-br from-[#3CB371]/10 to-[#34A166]/10 rounded-xl border border-[#3CB371]/20 p-6">
              <h3 className="text-lg font-bold mb-3 text-[#000000]">What's Next?</h3>
              <ul className="space-y-2 text-sm text-[#333333]">
                <li className="flex items-start gap-2">
                  <IoCheckmarkDone className="w-5 h-5 text-[#3CB371] flex-shrink-0 mt-0.5" />
                  <span>You'll receive delivery updates via SMS</span>
                </li>
                <li className="flex items-start gap-2">
                  <IoCheckmarkDone className="w-5 h-5 text-[#3CB371] flex-shrink-0 mt-0.5" />
                  <span>Track your order in real-time</span>
                </li>
                <li className="flex items-start gap-2">
                  <IoCheckmarkDone className="w-5 h-5 text-[#3CB371] flex-shrink-0 mt-0.5" />
                  <span>Enjoy fresh, delicious meals daily</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
