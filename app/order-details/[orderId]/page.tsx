"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { toast } from "sonner";
import { getOrderDetails } from "@/lib/api";
import { Order, DeliveryAddress } from "@/lib/types";
import { Package, Calendar, MapPin, DollarSign, Utensils, Clock, Info, XCircle, User as UserIcon, Tag, Banknote, Receipt, Timer } from "lucide-react";

interface OrderDetailsPageProps {
  params: {
    orderId: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { orderId } = useParams();
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Unauthorized. Please log in again.");
      router.push("/auth");
    } else if (token && orderId) {
      const id = Array.isArray(orderId) ? orderId[0] : orderId;
      fetchOrderDetails(token, id);
    }
  }, [user, token, authLoading, router, orderId]);

  const fetchOrderDetails = async (token: string, id: string) => {
    setLoading(true);
    try {
      const data = await getOrderDetails(id, token);
      console.log(order)
      setOrder(data);
    } catch (error: any) {
      toast.error(`Failed to fetch order details: ${error.message}`);
      router.push("/profile"); // Redirect back to profile if order not found or error
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
        <Header />
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4"
            style={{ borderColor: "#606C38", borderTopColor: "transparent" }}
          ></div>
          <p
            className="text-base sm:text-lg font-medium"
            style={{ color: "#283618" }}
          >
            Loading order details...
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <XCircle
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: "#BC6C25" }}
            />
            <p className="text-base sm:text-lg" style={{ color: "#606C38" }}>
              Order details not found.
            </p>
            <button
              onClick={() => router.push("/profile")}
              className="mt-6 px-6 py-3 rounded-lg font-semibold"
              style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
            >
              Back to Profile
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#283618" }}>
            Order Details
          </h1>
          <button
            onClick={() => router.push("/profile")}
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: "#DDA15E", color: "#283618" }}
          >
            Back to Profile
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 mb-4" style={{ borderColor: "#e5e5e5" }}>
            <div className="flex items-center gap-3 mb-3 sm:mb-0">
              <Package className="w-7 h-7" style={{ color: "#BC6C25" }} />
              <div>
                <p className="text-sm font-medium" style={{ color: "#606C38" }}>Order ID</p>
                <h2 className="text-xl font-bold" style={{ color: "#283618" }}>{order._id?.substring(0, 12)}...</h2>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          {/* Order Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: "#FEFAE0", border: "1px solid #DDA15E" }}>
              <Calendar className="w-6 h-6" style={{ color: "#BC6C25" }} />
              <div>
                <p className="text-sm font-medium" style={{ color: "#606C38" }}>Order Date</p>
                <p className="text-base font-semibold" style={{ color: "#283618" }}>
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Total Amount */}
            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: "#FEFAE0", border: "1px solid #DDA15E" }}>
              <DollarSign className="w-6 h-6" style={{ color: "#BC6C25" }} />
              <div>
                <p className="text-sm font-medium" style={{ color: "#606C38" }}>Total Amount</p>
                <p className="text-base font-semibold" style={{ color: "#283618" }}>
                  ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method and Currency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: "#FEFAE0", border: "1px solid #DDA15E" }}>
              <Banknote className="w-6 h-6" style={{ color: "#BC6C25" }} />
              <div>
                <p className="text-sm font-medium" style={{ color: "#606C38" }}>Payment Method</p>
                <p className="text-base font-semibold" style={{ color: "#283618" }}>
                  {order.paymentMethod}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: "#FEFAE0", border: "1px solid #DDA15E" }}>
              <Tag className="w-6 h-6" style={{ color: "#BC6C25" }} />
              <div>
                <p className="text-sm font-medium" style={{ color: "#606C38" }}>Currency</p>
                <p className="text-base font-semibold" style={{ color: "#283618" }}>
                  {order.currency}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Addresses */}
          <div className="pt-6 border-t" style={{ borderColor: "#e5e5e5" }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#283618" }}>
              <MapPin className="w-6 h-6" /> Delivery Information
            </h3>
            <div className="space-y-4">
              {Object.entries(order.deliveryAddresses).map(([mealType, address], index) => (
                <div key={index} className="p-4 rounded-xl" style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils className="w-5 h-5" style={{ color: "#BC6C25" }} />
                    <p className="text-lg font-semibold capitalize" style={{ color: "#283618" }}>{mealType} Delivery</p>
                  </div>
                  <p className="text-sm" style={{ color: "#606C38" }}>
                    <span className="font-medium">Address:</span> {address.street}, {address.city} - {address.zip}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Items */}
          <div className="pt-6 border-t" style={{ borderColor: "#e5e5e5" }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#283618" }}>
              <Utensils className="w-6 h-6" /> Ordered Items
            </h3>
            <div className="space-y-6">
              {(order.items || []).map((item, index) => (
                <div key={index} className="p-5 rounded-xl shadow-sm" style={{ backgroundColor: "#FEFAE0", border: "1px solid #DDA15E" }}>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={item.meal._id.image || "/public/defaults/default-meal.jpg"}
                      alt={item.meal.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <p className="text-lg font-bold" style={{ color: "#283618" }}>{item.meal.name}</p>
                      <p className="text-sm" style={{ color: "#606C38" }}>Plan: {item.plan.name}</p>
                      <p className="text-sm" style={{ color: "#606C38" }}>Vendor: {item.vendor.name}</p>
                      <p className="text-sm" style={{ color: "#606C38" }}>Quantity: {item.quantity}</p>
                      <p className="text-base font-semibold" style={{ color: "#BC6C25" }}>
                        Item Total: ₹{item.itemTotalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {item.personDetails && item.personDetails.length > 0 && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: "#e5e5e5" }}>
                      <p className="text-sm font-medium mb-2" style={{ color: "#606C38" }}>Person Details:</p>
                      {item.personDetails.map((person, pIndex) => (
                        <div key={pIndex} className="flex items-center gap-2 text-sm" style={{ color: "#283618" }}>
                          <UserIcon className="w-4 h-4" />
                          <span>{person.name} ({person.phoneNumber})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t flex justify-between items-center" style={{ borderColor: "#e5e5e5" }}>
                    <div className="flex items-center gap-2 text-sm" style={{ color: "#606C38" }}>
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Order Details */}
          <div className="pt-6 border-t" style={{ borderColor: "#e5e5e5" }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "#283618" }}>
              <Info className="w-6 h-6" /> Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}>
                <Timer className="w-6 h-6" style={{ color: "#BC6C25" }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "#606C38" }}>Order Placed At</p>
                  <p className="text-base font-semibold" style={{ color: "#283618" }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}>
                <Clock className="w-6 h-6" style={{ color: "#BC6C25" }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "#606C38" }}>Last Updated At</p>
                  <p className="text-base font-semibold" style={{ color: "#283618" }}>
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
