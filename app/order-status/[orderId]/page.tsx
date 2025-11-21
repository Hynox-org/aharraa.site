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
  const [isRefreshing, setIsRefreshing] = useState(false) // New state for refresh button loading

  const fetchOrder = async (currentOrderId: string) => {
    try {
      setPageLoading(true) // Set pageLoading to true when fetching for initial load or refresh
      const token = localStorage.getItem("aharraa-u-token")
      if (!token) {
        toast.error("Authentication token not found. Please log in again.")
        router.push("/auth?returnUrl=/order-status/" + currentOrderId)
        return
      }
      const orderDetails = await getOrderDetails(currentOrderId, token)
      setOrder(orderDetails)

      // Verify payment after fetching order details
      const verificationResponse = await verifyPayment(currentOrderId, token)
      if (verificationResponse && verificationResponse.order) {
        // setOrder(verificationResponse.order)
      }

    } catch (err: any) {
      console.error("Error fetching order details or verifying payment:", err)
      setError(err.message || "Failed to fetch order details or verify payment.")
      toast.error(err.message || "Failed to fetch order details or verify payment.")
    } finally {
      setPageLoading(false)
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
        const fetchOrder = async () => {
          try {
            setPageLoading(true)
            const token = localStorage.getItem("aharraa-u-token")
            if (!token) {
              toast.error("Authentication token not found. Please log in again.")
              router.push("/auth?returnUrl=/order-status/" + currentOrderId)
              return
            }
            const orderDetails = await getOrderDetails(currentOrderId, token)
            setOrder(orderDetails)

            // Verify payment after fetching order details
            const verificationResponse = await verifyPayment(currentOrderId, token)
            if (verificationResponse && verificationResponse.order) {
              // setOrder(verificationResponse.order)
            }

          } catch (err: any) {
            console.error("Error fetching order details or verifying payment:", err)
            setError(err.message || "Failed to fetch order details or verify payment.")
            toast.error(err.message || "Failed to fetch order details or verify payment.")
          } finally {
            setPageLoading(false)
          }
        }
        fetchOrder()
      }
    }
    resolveParams()
  }, [isAuthenticated, loading, user, params, router])

  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FEFAE0]">
        <LottieAnimation animationData={ItayCheffAnimation} style={{ width: 200, height: 200 }} />
      </div>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(188, 108, 37, 0.1)" }}>
            <span className="text-3xl sm:text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: "#BC6C25" }}>
            Error
          </h1>
          <p className="text-base sm:text-lg mb-8" style={{ color: "#606C38" }}>
            {error}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl transition-all"
            style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
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
      <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(188, 108, 37, 0.1)" }}>
            <IoReceipt className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: "#BC6C25" }} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: "#BC6C25" }}>
            Order Not Found
          </h1>
          <p className="text-base sm:text-lg mb-8" style={{ color: "#606C38" }}>
            The order with ID "{orderId}" could not be found.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl transition-all"
            style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
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
    if (status === "confirmed") return "#606C38"
    if (status === "pending") return "#DDA15E"
    return "#606C38"
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="rounded-2xl p-6 sm:p-8 shadow-xl" style={{ backgroundColor: "#ffffff" }}>
          {/* Success Icon & Title */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(96, 108, 56, 0.1)" }}>
              <IoCheckmarkCircle className="w-12 h-12 sm:w-16 sm:h-16" style={{ color: getStatusColor(order.status) }} />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2" style={{ color: "#283618" }}>
              Order {order.status === "confirmed" ? "Confirmed!" : order.status === "pending" ? "Pending" : `Status: ${order.status}`}!
            </h1>
            <p className="text-sm sm:text-base lg:text-lg" style={{ color: "#606C38" }}>
              {order.status === "confirmed" ? "Thank you for your purchase." : "Your order status has been updated."}
            </p>
          </div>

          <div className="space-y-6">
            {/* Order Details */}
            <div className="p-4 sm:p-5 rounded-xl space-y-3" style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2" style={{ color: "#283618" }}>
                  <IoReceipt className="w-5 h-5" />
                  Order Details
                </h2>
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg"
                  style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
                >
                  <IoRefresh className="w-4 h-4" />
                  {isRefreshing ? "Refreshing..." : "Refresh Status"}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">
                <div>
                  <p className="font-bold mb-1" style={{ color: "#283618" }}>Order ID</p>
                  <p className="break-all" style={{ color: "#606C38" }}>{order._id}</p>
                </div>
                <div>
                  <p className="font-bold mb-1" style={{ color: "#283618" }}>Status</p>
                  <p className="font-bold" style={{ color: getStatusColor(order.status) }}>
                    {order.status.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="font-bold mb-1" style={{ color: "#283618" }}>Total Amount</p>
                  <p className="text-lg sm:text-xl font-bold" style={{ color: "#606C38" }}>
                    ₹{order.totalAmount.toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="font-bold mb-1" style={{ color: "#283618" }}>Order Date</p>
                  <p className="flex items-center gap-1" style={{ color: "#606C38" }}>
                    <IoCalendar className="w-4 h-4" />
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            {order.paymentMethod !== "COD" && order.paymentSessionId && (
              <div className="p-4 sm:p-5 rounded-xl" style={{ backgroundColor: "rgba(96, 108, 56, 0.1)" }}>
                <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2" style={{ color: "#283618" }}>
                  <IoWallet className="w-5 h-5" />
                  Payment Details
                </h2>
                <p className="text-sm sm:text-base" style={{ color: "#606C38" }}>
                  <span className="font-bold">Payment Method:</span> {order.paymentMethod}
                </p>
              </div>
            )}

            {/* Delivery Addresses */}
            <div className="p-4 sm:p-5 rounded-xl space-y-3" style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}>
              <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2" style={{ color: "#283618" }}>
                <IoLocation className="w-5 h-5" />
                Delivery Addresses
              </h2>
              {order.deliveryAddresses && Object.entries(order.deliveryAddresses).map(([category, address]) => (
                <div key={category} className="p-3 rounded-lg" style={{ backgroundColor: "rgba(96, 108, 56, 0.1)" }}>
                  <p className="font-bold text-sm mb-1" style={{ color: "#283618" }}>{category}</p>
                  <p className="text-sm" style={{ color: "#606C38" }}>
                    {address.street}, {address.city} - {address.zip}
                  </p>
                </div>
              ))}
            </div>

            {/* Items */}
            <div className="p-4 sm:p-5 rounded-xl space-y-3" style={{ backgroundColor: "rgba(96, 108, 56, 0.1)" }}>
              <h2 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2" style={{ color: "#283618" }}>
                <IoCart className="w-5 h-5" />
                Items
              </h2>
              {(order.items as unknown as PopulatedOrderItem[]).map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-3 rounded-lg" 
                  style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}>
                  <div className="flex-1">
                    <p className="font-bold text-sm sm:text-base" style={{ color: "#283618" }}>
                      {/* Displaying menu id as name is not populated by API */}
                      {item.menu?.name || 'N/A'} 
                    </p>
                    <p className="text-xs sm:text-sm" style={{ color: "#606C38" }}>
                      {/* Displaying plan id and vendor id as names are not populated by API */}
                      {(item.plan?.name || 'N/A')} from {(item.vendor?.name || 'N/A')}
                    </p>
                    <p className="text-xs" style={{ color: "#606C38" }}>
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-base sm:text-lg" style={{ color: "#606C38" }}>
                    ₹{item.itemTotalPrice.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            {/* Continue Shopping Button */}
            <Link
              href="/pricing"
              className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
              style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
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
