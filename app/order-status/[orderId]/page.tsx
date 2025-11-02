"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { useAuth } from "@/app/context/auth-context";
import { getOrderDetails, verifyPayment } from "@/lib/api";
import { Order } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function OrderStatusPage({ params }: { params: { orderId: string } | Promise<{ orderId: string }> }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const fetchOrder = async () => {
          try {
            setPageLoading(true);
            const token = localStorage.getItem("aharraa-u-token");
            if (!token) {
              toast.error("Authentication token not found. Please log in again.");
              router.push("/auth?returnUrl=/order-status/" + currentOrderId);
              return;
            }
            const orderDetails = await getOrderDetails(currentOrderId, token);
            setOrder(orderDetails);

            // Verify payment after fetching order details
            const verificationResponse = await verifyPayment(currentOrderId, token);
            setOrder(verificationResponse.order); // Update order with verified status
            // You can also store cashfreeDetails if needed for display
            // const cashfreeDetails = verificationResponse.cashfreeDetails;

          } catch (err: any) {
            console.error("Error fetching order details or verifying payment:", err);
            setError(err.message || "Failed to fetch order details or verify payment.");
            toast.error(err.message || "Failed to fetch order details or verify payment.");
          } finally {
            setPageLoading(false);
          }
        };
        fetchOrder();
      }
    };
    resolveParams();
  }, [isAuthenticated, loading, user, params, router]);

  if (loading || pageLoading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-6 animate-spin text-green-600" />
          <p className="text-lg">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-black mb-4 text-red-600">Error</h1>
          <p className="text-lg text-neutral-600 mb-8">{error}</p>
          <Button asChild className="mt-8 px-8 py-4 text-lg font-bold rounded-xl" style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}>
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-black mb-4 text-red-600">Order Not Found</h1>
          <p className="text-lg text-neutral-600 mb-8">The order with ID "{orderId}" could not be found.</p>
          <Button asChild className="mt-8 px-8 py-4 text-lg font-bold rounded-xl" style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}>
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f8f9fa" }}>
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-xl text-center" style={{ border: "none", backgroundColor: "#ffffff" }}>
          <CardHeader className="pb-0">
            <CheckCircle2 className="w-24 h-24 mx-auto mb-6 text-green-500" />
            <CardTitle className="text-4xl font-black mb-2" style={{ color: "#0B132B" }}>
              Order {order.status === "confirmed" ? "Confirmed!" : order.status === "pending" ? "Pending" : "Status: " + order.status}!
            </CardTitle>
            <p className="text-lg text-neutral-600">
              {order.status === "confirmed" ? "Thank you for your purchase." : "Your order status has been updated."}
            </p>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="text-left space-y-2">
              <p className="text-xl font-bold" style={{ color: "#0B132B" }}>Order ID: <span className="font-normal text-neutral-700">{order._id}</span></p>
              <p className="text-xl font-bold" style={{ color: "#0B132B" }}>Status: <span className={`font-normal ${order.status === "confirmed" ? "text-green-600" : "text-orange-500"}`}>{order.status.toUpperCase()}</span></p>
              <p className="text-xl font-bold" style={{ color: "#0B132B" }}>Total Amount: <span className="font-normal text-neutral-700">₹{order.totalAmount.toFixed(2)}</span></p>
              <p className="text-xl font-bold" style={{ color: "#0B132B" }}>Order Date: <span className="font-normal text-neutral-700">{new Date(order.orderDate).toLocaleDateString()}</span></p>
            </div>

            {order.paymentMethod !== "COD" && order.paymentSessionId && (
              <div className="space-y-3 text-left">
                <h2 className="text-2xl font-black" style={{ color: "#0B132B" }}>Payment Details:</h2>
                <div className="p-3 rounded-lg" style={{ backgroundColor: "#EAFFF9" }}>
                  <p className="font-bold" style={{ color: "#0B132B" }}>Payment Method: <span className="font-normal text-neutral-700">{order.paymentMethod}</span></p>
                  <p className="font-bold" style={{ color: "#0B132B" }}>Payment Session ID: <span className="font-normal text-neutral-700">{order.paymentSessionId}</span></p>
                  {/* Add more Cashfree details here if needed from verificationResponse.cashfreeDetails */}
                </div>
              </div>
            )}

            <div className="space-y-3 text-left">
              <h2 className="text-2xl font-black" style={{ color: "#0B132B" }}>Delivery Addresses:</h2>
              {order.deliveryAddresses && Object.entries(order.deliveryAddresses).map(([category, address]) => (
                <div key={category} className="p-3 rounded-lg" style={{ backgroundColor: "#EAFFF9" }}>
                  <p className="font-bold" style={{ color: "#0B132B" }}>{category}: <span className="font-normal text-neutral-700">{address.street}, {address.city} - {address.zip}</span></p>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-left">
              <h2 className="text-2xl font-black" style={{ color: "#0B132B" }}>Items:</h2>
              {order.items.map((item) => (
                <div key={item.productId} className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: "#EAFFF9" }}>
                  <div>
                    <p className="font-bold" style={{ color: "#0B132B" }}>{item.mealName}</p>
                    <p className="text-sm text-neutral-600">{item.planName} from {item.vendorName}</p>
                    <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold" style={{ color: "#034C3C" }}>₹{item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Button asChild className="w-full py-6 text-base font-black rounded-xl transition-all hover:scale-105 shadow-lg" style={{ backgroundColor: "#034C3C", color: "#EAFFF9" }}>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
