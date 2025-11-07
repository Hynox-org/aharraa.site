"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { toast } from "sonner";
import { getOrderDetails, updateOrder } from "@/lib/api";
import { Order, DeliveryAddress } from "@/lib/types";
import {
  Package,
  Calendar,
  MapPin,
  DollarSign,
  Utensils,
  Clock,
  Info,
  XCircle,
  User as UserIcon,
  Tag,
  Banknote,
  Receipt,
  Timer,
  FastForward,
} from "lucide-react";

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [isTomorrowSkipped, setIsTomorrowSkipped] = useState(false);

  // Calculate tomorrow's date for display and comparison
  const getTomorrowDateString = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 2);
    return tomorrow.toISOString();
  };

  const tomorrowDateStringFull = getTomorrowDateString();
  const tomorrowDateStringShort = tomorrowDateStringFull.split("T")[0];

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Unauthorized. Please log in again.");
      router.push("/auth");
    } else if (token && orderId) {
      const id = Array.isArray(orderId) ? orderId[0] : orderId;
      fetchOrderDetails(token, id as string);
    }
  }, [user, token, authLoading, router, orderId]);

  useEffect(() => {
    if (order) {
      const normalizedSkippedDates = order.skippedDates?.map(date => date.split("T")[0]) || [];
      const skipped = normalizedSkippedDates.includes(tomorrowDateStringShort);
      setIsTomorrowSkipped(skipped);
    }
  }, [order, tomorrowDateStringShort]);

  const handleSkipTomorrow = async () => {
    if (!order || !token) {
      toast.error("Order details or token not available.");
      return;
    }

    if (isTomorrowSkipped) {
      toast.info("Tomorrow's delivery is already skipped.");
      return;
    }

    const orderIdToUse: string = order._id!;

    setIsUpdating(true);
    try {
      let latestEndDate = new Date(0);
      order.items.forEach((item) => {
        const itemEndDate = new Date(item.endDate);
        if (itemEndDate > latestEndDate) {
          latestEndDate = itemEndDate;
        }
      });

      const newEndDate = new Date(latestEndDate);
      newEndDate.setDate(latestEndDate.getDate() + 1);

      const updatePayload = {
        skippedDate: tomorrowDateStringFull,
        newEndDate: newEndDate.toISOString().split("T")[0],
      };

      console.log("Skipping tomorrow's delivery. Tomorrow's date (full ISO):", tomorrowDateStringFull);
      console.log("Update payload:", updatePayload);

      await updateOrder(orderIdToUse, updatePayload, token);
      toast.success("Order updated successfully! Tomorrow's delivery skipped.");
      const id = Array.isArray(orderId) ? orderId[0] : orderId;
      fetchOrderDetails(token, id as string);
    } catch (error: any) {
      toast.error(`Failed to skip tomorrow's delivery: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchOrderDetails = async (token: string, id: string) => {
    setLoading(true);
    try {
      const data = await getOrderDetails(id, token);
      console.log("Fetched order details:", data);
      setOrder(data);
    } catch (error: any) {
      toast.error(`Failed to fetch order details: ${error.message}`);
      router.push("/profile");
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
        <div className="flex flex-col justify-center items-center min-h-[60vh] px-4">
          <div
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-4"
            style={{ borderColor: "#606C38", borderTopColor: "transparent" }}
          ></div>
          <p
            className="text-sm sm:text-base md:text-lg font-medium text-center"
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
        <div className="flex justify-center items-center min-h-[60vh] px-4">
          <div className="text-center">
            <XCircle
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4"
              style={{ color: "#BC6C25" }}
            />
            <p className="text-sm sm:text-base md:text-lg mb-4" style={{ color: "#606C38" }}>
              Order details not found.
            </p>
            <button
              onClick={() => router.push("/profile")}
              className="mt-4 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base"
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

      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Page Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-bold"
            style={{ color: "#283618" }}
          >
            Order Details
          </h1>
          <button
            onClick={() => router.push("/profile")}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: "#DDA15E", color: "#283618" }}
          >
            Back to Profile
          </button>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
          {/* Order Header - Mobile Optimized */}
          <div
            className="flex flex-col gap-4 border-b pb-4 mb-4"
            style={{ borderColor: "#e5e5e5" }}
          >
            {/* Order ID Section */}
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" style={{ color: "#BC6C25" }} />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium" style={{ color: "#606C38" }}>
                  Order ID
                </p>
                <h2 className="text-base sm:text-lg md:text-xl font-bold truncate" style={{ color: "#283618" }}>
                  {order._id?.substring(0, 12)}...
                </h2>
              </div>
            </div>
            
            {/* Status and Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <span
                className={`px-3 py-2 rounded-full text-xs sm:text-sm font-semibold capitalize text-center ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
              <button
                onClick={handleSkipTomorrow}
                disabled={isUpdating || isTomorrowSkipped}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap disabled:opacity-60"
                style={{ backgroundColor: "#BC6C25", color: "#FEFAE0" }}
              >
                {isUpdating ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <FastForward className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="hidden sm:inline">{isTomorrowSkipped ? "Already Skipped Tomorrow" : "Skip Tomorrow"}</span>
                <span className="sm:hidden">{isTomorrowSkipped ? "Skipped" : "Skip"}</span>
              </button>
            </div>
          </div>

          {/* Order Information Grid - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Date */}
            <div
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl"
              style={{
                backgroundColor: "#FEFAE0",
                border: "1px solid #DDA15E",
              }}
            >
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: "#BC6C25" }} />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium" style={{ color: "#606C38" }}>
                  Order Date
                </p>
                <p
                  className="text-sm sm:text-base font-semibold"
                  style={{ color: "#283618" }}
                >
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Total Amount */}
            <div
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl"
              style={{
                backgroundColor: "#FEFAE0",
                border: "1px solid #DDA15E",
              }}
            >
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: "#BC6C25" }} />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium" style={{ color: "#606C38" }}>
                  Total Amount
                </p>
                <p
                  className="text-sm sm:text-base font-semibold"
                  style={{ color: "#283618" }}
                >
                  ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method and Currency - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl"
              style={{
                backgroundColor: "#FEFAE0",
                border: "1px solid #DDA15E",
              }}
            >
              <Banknote className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: "#BC6C25" }} />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium" style={{ color: "#606C38" }}>
                  Payment Method
                </p>
                <p
                  className="text-sm sm:text-base font-semibold capitalize"
                  style={{ color: "#283618" }}
                >
                  {order.paymentMethod}
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl"
              style={{
                backgroundColor: "#FEFAE0",
                border: "1px solid #DDA15E",
              }}
            >
              <Tag className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: "#BC6C25" }} />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium" style={{ color: "#606C38" }}>
                  Currency
                </p>
                <p
                  className="text-sm sm:text-base font-semibold"
                  style={{ color: "#283618" }}
                >
                  {order.currency}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Addresses - Mobile Optimized */}
          <div className="pt-4 sm:pt-6 border-t" style={{ borderColor: "#e5e5e5" }}>
            <h3
              className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2"
              style={{ color: "#283618" }}
            >
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" /> 
              <span>Delivery Information</span>
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(order.deliveryAddresses).map(
                ([mealType, address], index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 rounded-lg sm:rounded-xl"
                    style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Utensils
                        className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                        style={{ color: "#BC6C25" }}
                      />
                      <p
                        className="text-base sm:text-lg font-semibold capitalize"
                        style={{ color: "#283618" }}
                      >
                        {mealType} Delivery
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm break-words" style={{ color: "#606C38" }}>
                      <span className="font-medium">Address:</span>{" "}
                      {address.street}, {address.city} - {address.zip}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Ordered Items - Mobile Optimized */}
          <div className="pt-4 sm:pt-6 border-t" style={{ borderColor: "#e5e5e5" }}>
            <h3
              className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2"
              style={{ color: "#283618" }}
            >
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" /> 
              <span>Ordered Items</span>
            </h3>
            <div className="space-y-4 sm:space-y-6">
              {(order.items || []).map((item, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-5 rounded-lg sm:rounded-xl shadow-sm"
                  style={{
                    backgroundColor: "#FEFAE0",
                    border: "1px solid #DDA15E",
                  }}
                >
                  {/* Item Header with Image - Mobile Optimized */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <img
                      src={
                        item.meal?._id?.image ||
                        "/public/defaults/default-meal.jpg"
                      }
                      alt={item.meal?.name}
                      className="w-full sm:w-20 h-48 sm:h-20 object-cover rounded-lg"
                    />
                    <div className="flex-grow min-w-0 space-y-1">
                      <p
                        className="text-base sm:text-lg font-bold"
                        style={{ color: "#283618" }}
                      >
                        {item.meal?.name}
                      </p>
                      <p className="text-xs sm:text-sm" style={{ color: "#606C38" }}>
                        <span className="font-medium">Plan:</span> {item.plan?.name}
                      </p>
                      <p className="text-xs sm:text-sm" style={{ color: "#606C38" }}>
                        <span className="font-medium">Vendor:</span> {item.vendor?.name}
                      </p>
                      <p className="text-xs sm:text-sm" style={{ color: "#606C38" }}>
                        <span className="font-medium">Quantity:</span> {item.quantity}
                      </p>
                      <p
                        className="text-sm sm:text-base font-semibold pt-1"
                        style={{ color: "#BC6C25" }}
                      >
                        Item Total: ₹{item.itemTotalPrice?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Person Details */}
                  {item.personDetails && item.personDetails.length > 0 && (
                    <div
                      className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t space-y-2"
                      style={{ borderColor: "#e5e5e5" }}
                    >
                      <p
                        className="text-xs sm:text-sm font-medium mb-2"
                        style={{ color: "#606C38" }}
                      >
                        Person Details:
                      </p>
                      {item.personDetails.map((person, pIndex) => (
                        <div
                          key={pIndex}
                          className="flex items-start gap-2 text-xs sm:text-sm"
                          style={{ color: "#283618" }}
                        >
                          <UserIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span className="break-words">
                            {person.name} ({person.phoneNumber})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Date Range */}
                  <div
                    className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex items-center gap-2 text-xs sm:text-sm"
                    style={{ borderColor: "#e5e5e5", color: "#606C38" }}
                  >
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="break-words">
                      {new Date(item.startDate).toLocaleDateString()} -{" "}
                      {new Date(item.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Order Details - Mobile Optimized */}
          <div className="pt-4 sm:pt-6 border-t" style={{ borderColor: "#e5e5e5" }}>
            <h3
              className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2"
              style={{ color: "#283618" }}
            >
              <Info className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" /> 
              <span>Additional Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl"
                style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}
              >
                <Timer className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" style={{ color: "#BC6C25" }} />
                <div className="min-w-0">
                  <p
                    className="text-xs sm:text-sm font-medium mb-1"
                    style={{ color: "#606C38" }}
                  >
                    Order Placed At
                  </p>
                  <p
                    className="text-xs sm:text-base font-semibold break-words"
                    style={{ color: "#283618" }}
                  >
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl"
                style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}
              >
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" style={{ color: "#BC6C25" }} />
                <div className="min-w-0">
                  <p
                    className="text-xs sm:text-sm font-medium mb-1"
                    style={{ color: "#606C38" }}
                  >
                    Last Updated At
                  </p>
                  <p
                    className="text-xs sm:text-base font-semibold break-words"
                    style={{ color: "#283618" }}
                  >
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
