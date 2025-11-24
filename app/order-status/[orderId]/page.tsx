"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAuth } from "@/app/context/auth-context"
import { getOrderDetails, verifyPayment } from "@/lib/api"
import { Order, PopulatedOrderItem } from "@/lib/types"
import LottieAnimation from "@/components/lottie-animation"
import ItayCheffAnimation from "@/public/lottie/ItayCheff.json"
import { IoCheckmarkCircle, IoHome, IoReceipt, IoCalendar, IoWallet, IoLocation, IoCart, IoRefresh } from "react-icons/io5"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function OrderStatusPage({ params }: { params: { orderId: string } | Promise<{ orderId: string }> }) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  const [orderId, setOrderId] = useState<string | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const POLLING_INTERVAL = 30000; // Poll every 30 seconds

  const fetchOrder = async (currentOrderId: string, showToast = false) => {
    try {
      if (isRefreshing) return; // Prevent multiple simultaneous refreshes
      setPageLoading(true)
      setIsRefreshing(true); // Indicate refresh in progress
      const token = localStorage.getItem("aharraa-u-token")
      if (!token) {
        toast.error("Authentication token not found. Please log in again.")
        router.push("/auth?returnUrl=/order-status/" + currentOrderId)
        return
      }
      const verificationResponse = await verifyPayment(currentOrderId, token)
      if (verificationResponse) {
        toast.success(verificationResponse.message)
      }
      const orderDetails = await getOrderDetails(currentOrderId, token)
      setOrder(orderDetails)
    } catch (err: any) {
      console.error("Error fetching order details or verifying payment:", err)
      setError(err.message || "Failed to fetch order details or verify payment.")
      toast.error(err.message || "Failed to fetch order details or verify payment.")
    } finally {
      setPageLoading(false)
      setIsRefreshing(false); // Reset refresh state
      if (showToast) {
        toast.success("Order status refreshed automatically!")
      }
    }
  }

  const handleRefresh = async () => {
    if (!orderId) {
      toast.error("Order ID not available for refresh.")
      return
    }
    setIsRefreshing(true)
    await fetchOrder(orderId)
    setIsRefreshing(false)
    toast.success("Order status refreshed!")
  }

  useEffect(() => {
    const resolveParams = async () => {
      let currentOrderId: string | null = null
      if (params instanceof Promise) {
        const resolved = await params
        currentOrderId = resolved.orderId
      } else {
        currentOrderId = params.orderId
      }
      setOrderId(currentOrderId)

      if (!loading && !isAuthenticated) {
        router.push("/auth?returnUrl=/order-status/" + currentOrderId)
        return
      }

      if (isAuthenticated && user && currentOrderId) {
        fetchOrder(currentOrderId);
      }
    }
    resolveParams()
  }, [isAuthenticated, loading, user, params, router])

  // Polling mechanism
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isAuthenticated && user && orderId) {
      interval = setInterval(() => {
        console.log("Polling for order status...");
        fetchOrder(orderId, true); // Fetch and show toast for automatic refresh
      }, POLLING_INTERVAL);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAuthenticated, user, orderId, isRefreshing]); // Re-run if auth, user, orderId, or refresh status changes

  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LottieAnimation animationData={ItayCheffAnimation} style={{ width: 200, height: 200 }} />
      </div>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-red-50">
            <span className="text-3xl sm:text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-red-600">
            Error
          </h1>
          <p className="text-base sm:text-lg mb-8 text-gray-600">
            {error}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl transition-all bg-[#3CB371] hover:bg-[#2FA05E] text-white"
          >
            <IoHome className="w-5 h-5" />
            Go to Homepage
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  console.log("Before !order check: order =", order, "pageLoading =", pageLoading, "loading =", loading);

  if (!order) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-gray-100">
            <IoReceipt className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-black">
            Order Not Found
          </h1>
          <p className="text-base sm:text-lg mb-8 text-gray-600">
            The order with ID "{orderId}" could not be found.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl transition-all bg-[#3CB371] hover:bg-[#2FA05E] text-white"
          >
            <IoHome className="w-5 h-5" />
            Go to Homepage
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  const getStatusColor = (status: string) => {
    if (status === "confirmed") return "#3CB371"
    if (status === "pending") return "#FFA500"
    return "#3CB371"
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="rounded-2xl p-6 sm:p-8 shadow-xl bg-white border border-gray-100">
          {/* Success Icon & Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center bg-gray-50">
              <IoCheckmarkCircle className="w-12 h-12 sm:w-16 sm:h-16" style={{ color: getStatusColor(order.status) }} />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-black">
              Order {order.status === "confirmed" ? "Confirmed!" : order.status === "pending" ? "Pending" : `Status: ${order.status}`}!
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              {order.status === "confirmed" ? "Thank you for your purchase." : "Your order status has been updated."}
            </p>
          </div>

          <div className="space-y-6">
            {/* Order Details */}
            <div className="p-4 sm:p-5 rounded-xl space-y-3 bg-gray-50 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-black">
                  <IoReceipt className="w-5 h-5" />
                  Order Details
                </h2>
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[#3CB371] hover:bg-[#2FA05E] text-white"
                >
                  <IoRefresh className="w-4 h-4" />
                  {isRefreshing ? "Refreshing..." : "Refresh Status"}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">
                <div>
                  <p className="font-bold mb-1 text-black">Order ID</p>
                  <p className="break-all text-gray-600">{order._id}</p>
                </div>
                <div>
                  <p className="font-bold mb-1 text-black">Status</p>
                  <p className="font-bold" style={{ color: getStatusColor(order.status) }}>
                    {order.status.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="font-bold mb-1 text-black">Total Amount</p>
                  <p className="text-lg sm:text-xl font-bold text-black">
                    ₹{order.totalAmount.toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="font-bold mb-1 text-black">Order Date</p>
                  <p className="flex items-center gap-1 text-gray-600">
                    <IoCalendar className="w-4 h-4" />
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            {order.paymentMethod !== "COD" && order.paymentSessionId && (
              <div className="p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-black">
                  <IoWallet className="w-5 h-5" />
                  Payment Details
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  <span className="font-bold">Payment Method:</span> {order.paymentMethod}
                </p>
              </div>
            )}

            {/* Delivery Addresses */}
            <div className="p-4 sm:p-5 rounded-xl space-y-3 bg-gray-50 border border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-black">
                <IoLocation className="w-5 h-5" />
                Delivery Addresses
              </h2>
              {order.deliveryAddresses && Object.entries(order.deliveryAddresses).map(([category, address]) => (
                <div key={category} className="p-3 rounded-lg bg-white border border-gray-200">
                  <p className="font-bold text-sm mb-1 text-black">{category}</p>
                  <p className="text-sm text-gray-600">
                    {address.street}, {address.city} - {address.zip}
                  </p>
                </div>
              ))}
            </div>

            {/* Items */}
            <div className="p-4 sm:p-5 rounded-xl space-y-3 bg-gray-50 border border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-black">
                <IoCart className="w-5 h-5" />
                Items
              </h2>
              {(order.items as unknown as PopulatedOrderItem[]).map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-3 rounded-lg bg-white border border-gray-200">
                  <div className="flex-1">
                    <p className="font-bold text-sm sm:text-base text-black">
                      {item.menu?.name || 'N/A'} 
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {(item.plan?.name || 'N/A')} from {(item.vendor?.name || 'N/A')}
                    </p>
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-base sm:text-lg text-black">
                    ₹{item.itemTotalPrice.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            {/* View Order Details Button */}
            <Link
              href={`/order-details/${order._id}`}
              className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl bg-blue-600 hover:bg-blue-700 text-white mt-4"
            >
              <IoReceipt className="w-5 h-5" />
              View Order Details
            </Link>

            {/* Continue Shopping Button */}
            <Link
              href="/pricing"
              className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl bg-[#3CB371] hover:bg-[#2FA05E] text-white mt-4"
            >
              <IoHome className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
