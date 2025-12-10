"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { toast } from "sonner";
import { getOrderDetails, updateOrder, verifyPayment } from "@/lib/api";
import { Order, PopulatedOrder, DeliveryAddress, MealCategory } from "@/lib/types";
import LottieAnimation from "@/components/lottie-animation";
import ItayCheffAnimation from "@/public/lottie/ItayCheff.json";
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
  Download,
  Edit,
  Save,
  X,
  CheckCircle2,
  TruckIcon,
  ChevronRight,
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
  const [order, setOrder] = useState<PopulatedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [editedAddresses, setEditedAddresses] = useState<Record<string, DeliveryAddress>>({});

  const TIME_SLOTS: Record<MealCategory, { label: string; value: string }[]> = {
    Breakfast: [
      { label: "7:00 AM - 7:45 AM", value: "7:00 AM - 7:45 AM" },
      { label: "7:55 AM - 8:40 AM", value: "7:55 AM - 8:40 AM" },
      { label: "8:50 AM - 9:35 AM", value: "8:50 AM - 9:35 AM" },
      { label: "9:45 AM - 10:30 AM", value: "9:45 AM - 10:30 AM" },
    ],
    Lunch: [
      { label: "12:00 PM - 12:45 PM", value: "12:00 PM - 12:45 PM" },
      { label: "12:55 PM - 1:40 PM", value: "12:55 PM - 1:40 PM" },
      { label: "1:50 PM - 2:35 PM", value: "1:50 PM - 2:35 PM" },
      { label: "2:45 PM - 3:30 PM", value: "2:45 PM - 3:30 PM" },
    ],
    Dinner: [
      { label: "7:00 PM - 7:45 PM", value: "7:00 PM - 7:45 PM" },
      { label: "7:55 PM - 8:40 PM", value: "7:55 PM - 8:40 PM" },
      { label: "8:50 PM - 9:35 PM", value: "8:50 PM - 9:35 PM" },
      { label: "9:45 PM - 10:30 PM", value: "9:45 PM - 10:30 PM" },
    ],
  };

  const getTomorrowDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
  };

  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const tomorrow = getTomorrowDate();
  const tomorrowDateString = formatDateString(tomorrow);

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Unauthorized. Please log in again.");
      router.push("/auth");
    } else if (token && orderId) {
      const id = Array.isArray(orderId) ? orderId[0] : orderId;
      fetchOrderDetails(token, id as string);
    }
  }, [user, token, authLoading, router, orderId]);

  const handleEditAddress = () => {
    setIsEditingAddress(true);
    if (order?.deliveryAddresses) {
      setEditedAddresses({ ...order.deliveryAddresses });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingAddress(false);
    if (order?.deliveryAddresses) {
      setEditedAddresses({ ...order.deliveryAddresses });
    }
  };

  const handleAddressChange = (
    category: string,
    field: keyof DeliveryAddress,
    value: string
  ) => {
    setEditedAddresses((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const handleSaveAddresses = async () => {
    if (!order || !token) {
      toast.error("Order details or token not available.");
      return;
    }

    for (const [category, address] of Object.entries(editedAddresses)) {
      if (!address.street?.trim()) {
        toast.error(`Street address is required for ${category}`);
        return;
      }
      if (!address.zip?.trim()) {
        toast.error(`Zip code is required for ${category}`);
        return;
      }
      if (address.city === "Coimbatore" && !address.zip.match(/^641\d{3}$/)) {
        toast.error(`Invalid zip code for ${category}. Must start with 641`);
        return;
      }
    }

    setIsSavingAddress(true);
    try {
      const orderIdToUse = order._id!;
      const updatePayload = {
        deliveryAddresses: editedAddresses,
      };

      await updateOrder(orderIdToUse, updatePayload, token);

      const id = Array.isArray(orderId) ? orderId[0] : orderId;
      await fetchOrderDetails(token, id as string);

      setIsEditingAddress(false);
      toast.success("Delivery addresses updated successfully!");
    } catch (error: any) {
      console.error("Error updating delivery addresses:", error);
      toast.error(error.message || "Failed to update delivery addresses.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleSkipTomorrow = async (itemId: string) => {
    if (!order || !token) {
      toast.error("Order details or token not available.");
      return;
    }

    const orderIdToUse: string = order._id!;

    setIsUpdating(true);
    try {
      const itemToUpdate = order.items.find((item) => item.id === itemId);
      if (!itemToUpdate) {
        toast.error("Order item not found.");
        return;
      }

      const itemEndDate = new Date(itemToUpdate.endDate);
      itemEndDate.setHours(0, 0, 0, 0);
      const newEndDate = new Date(itemEndDate);
      newEndDate.setDate(itemEndDate.getDate() + 1);

      const updatePayload = {
        itemId: itemId,
        skippedDate: tomorrowDateString,
        newEndDate: formatDateString(newEndDate),
      };

      await updateOrder(orderIdToUse, updatePayload, token);
      toast.success("Tomorrow's delivery skipped for this item.");
      const id = Array.isArray(orderId) ? orderId[0] : orderId;
      fetchOrderDetails(token, id as string);
    } catch (error: any) {
      toast.error(`Failed to skip tomorrow's delivery: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const isItemEligibleForSkip = (
    itemStartDate: string,
    itemEndDate: string,
    skippedDates: string[] | undefined
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(itemStartDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(itemEndDate);
    end.setHours(0, 0, 0, 0);

    const isItemActiveOrStartsTomorrow =
      (today >= start && today <= end) || start.getTime() === tomorrow.getTime();

    const isTomorrowAlreadySkipped = skippedDates?.includes(tomorrowDateString);

    return isItemActiveOrStartsTomorrow && !isTomorrowAlreadySkipped;
  };

  const fetchOrderDetails = async (token: string, id: string) => {
    setLoading(true);
    try {
      const verificationResponse = await verifyPayment(id, token);
      if (verificationResponse) {
        toast.success(verificationResponse.message);
      }
      const orderDetails = await getOrderDetails(id, token);
      setOrder(orderDetails);
      if (orderDetails.deliveryAddresses) {
        setEditedAddresses(orderDetails.deliveryAddresses);
      }
      toast.success("Order details fetched successfully!");
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
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "readyForDelivery":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="w-5 h-5" />;
      case "readyForDelivery":
        return <TruckIcon className="w-5 h-5" />;
      case "delivered":
        return <Package className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LottieAnimation
          animationData={ItayCheffAnimation}
          style={{ width: 200, height: 200 }}
        />
      </div>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh] px-4">
          <div className="text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <p className="text-lg mb-4 text-[#333333]">Order details not found.</p>
            <button
              onClick={() => router.push("/profile")}
              className="mt-4 px-6 py-3 rounded-lg font-semibold bg-[#3CB371] hover:bg-[#34A166] text-white transition-colors"
            >
              Back to Profile
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const canEditAddress = ["pending", "confirmed", "readyForDelivery"].includes(order.status);

  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <button
            onClick={() => router.push("/profile")}
            className="text-[#333333] hover:text-[#3CB371] transition-colors"
          >
            My Orders
          </button>
          <ChevronRight className="w-4 h-4 text-[#B3B3B3]" />
          <span className="text-[#3CB371] font-medium">Order Details</span>
        </div>

        {/* Hero Section - Order Status Card */}
        <div className="bg-gradient-to-br from-[#3CB371] to-[#34A166] rounded-2xl p-6 md:p-8 mb-6 text-white shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Order ID</p>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    #{order._id?.substring(0, 10).toUpperCase()}
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <Calendar className="w-4 h-4" />
                <span>Placed on {new Date(order.orderDate).toLocaleDateString("en-IN", { 
                  day: "numeric", 
                  month: "long", 
                  year: "numeric" 
                })}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className={`px-5 py-3 rounded-xl border-2 ${getStatusColor(order.status)} bg-white flex items-center gap-2 font-semibold`}>
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status.replace(/([A-Z])/g, ' $1').trim()}</span>
              </div>
              {order.status === "confirmed" && order.invoiceUrl && (
                <a
                  href={order.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
                >
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline">Invoice</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items (Takes 2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#000000] flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-[#3CB371]" />
                  Your Meals
                </h2>
                <span className="text-sm text-[#333333] bg-[#F8F9FA] px-3 py-1 rounded-full">
                  {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
                </span>
              </div>

              <div className="space-y-4">
                {order.items.map((item, index) => {
                  const skippedDatesNormalized = item.skippedDates?.map(
                    (dateStr) => new Date(dateStr).toISOString().split("T")[0]
                  );
                  const isTomorrowSkipped = skippedDatesNormalized?.includes(tomorrowDateString);

                  return (
                    <div
                      key={index}
                      className="group border border-[#E5E5E5] rounded-xl overflow-hidden hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col sm:flex-row gap-4 p-4">
                        {/* Meal Image */}
                        <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={item.menu?.coverImage || "/defaults/default-meal.jpg"}
                            alt={item.menu?.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 bg-[#3CB371] text-white px-2 py-1 rounded-md text-xs font-semibold">
                            x{item.quantity}
                          </div>
                        </div>

                        {/* Meal Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-[#000000] mb-2">
                            {item.menu?.name}
                          </h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                            <div className="flex items-center gap-2 text-sm text-[#333333]">
                              <Tag className="w-4 h-4 text-[#3CB371]" />
                              <span>{item.plan?.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#333333]">
                              <UserIcon className="w-4 h-4 text-[#3CB371]" />
                              <span>{item.vendor?.name}</span>
                            </div>
                          </div>

                          {/* Meal Times Tags */}
                          {item.selectedMealTimes && item.selectedMealTimes.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {item.selectedMealTimes.map((mealTime, idx) => (
                                <span
                                  key={idx}
                                  className="px-3 py-1 bg-[#3CB371]/10 text-[#3CB371] rounded-full text-xs font-medium capitalize"
                                >
                                  {mealTime}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Date Range */}
                          <div className="flex items-center gap-2 text-sm text-[#333333] mb-3 bg-[#F8F9FA] px-3 py-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-[#3CB371]" />
                            <span>
                              {new Date(item.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} - {new Date(item.endDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>

                          {/* Person Details */}
                          {item.personDetails && item.personDetails.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-[#333333] mb-1">Delivery For:</p>
                              <div className="flex flex-wrap gap-2">
                                {item.personDetails.map((person, pIndex) => (
                                  <div
                                    key={pIndex}
                                    className="flex items-center gap-1 text-xs bg-[#F8F9FA] px-2 py-1 rounded-md"
                                  >
                                    <UserIcon className="w-3 h-3 text-[#3CB371]" />
                                    <span className="text-[#333333]">{person.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Price and Action */}
                          <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E5]">
                            <p className="text-lg font-bold text-[#3CB371]">
                              ₹{item.itemTotalPrice?.toFixed(2)}
                            </p>
                            <button
                              onClick={() => handleSkipTomorrow(item.id)}
                              disabled={
                                isUpdating ||
                                !isItemEligibleForSkip(
                                  item.startDate,
                                  item.endDate,
                                  item.skippedDates
                                ) ||
                                isTomorrowSkipped ||
                                order.status === "cancelled"
                              }
                              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#3CB371] hover:bg-[#34A166] text-white disabled:bg-[#B3B3B3] disabled:cursor-not-allowed transition-colors"
                            >
                              {isUpdating ? (
                                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                              ) : (
                                <FastForward className="w-4 h-4" />
                              )}
                              <span className="hidden sm:inline">
                                {isTomorrowSkipped ? "Already Skipped" : "Skip Tomorrow"}
                              </span>
                              <span className="sm:hidden">
                                {isTomorrowSkipped ? "Skipped" : "Skip"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Addresses Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#000000] flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-[#3CB371]" />
                  Delivery Information
                </h2>
                {canEditAddress && !isEditingAddress && (
                  <button
                    onClick={handleEditAddress}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#3CB371] hover:bg-[#34A166] text-white transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
                {isEditingAddress && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSavingAddress}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold bg-[#F8F9FA] hover:bg-[#E5E5E5] text-[#333333] transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAddresses}
                      disabled={isSavingAddress}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold bg-[#3CB371] hover:bg-[#34A166] text-white transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSavingAddress ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {Object.entries(isEditingAddress ? editedAddresses : order.deliveryAddresses).map(
                  ([menuType, address], index) => (
                    <div
                      key={index}
                      className="border border-[#E5E5E5] rounded-xl p-4 hover:border-[#3CB371] transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-[#3CB371]/10 rounded-lg">
                          <Utensils className="w-5 h-5 text-[#3CB371]" />
                        </div>
                        <h3 className="text-lg font-semibold capitalize text-[#000000]">
                          {menuType} Delivery
                        </h3>
                      </div>

                      {isEditingAddress ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs font-semibold text-[#333333] block mb-1">
                              Street Address *
                            </label>
                            <input
                              type="text"
                              value={editedAddresses[menuType]?.street || ""}
                              onChange={(e) =>
                                handleAddressChange(menuType, "street", e.target.value)
                              }
                              className="w-full px-4 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-transparent text-[#000000]"
                              placeholder="Enter street address"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-semibold text-[#333333] block mb-1">
                                City *
                              </label>
                              <input
                                type="text"
                                value={editedAddresses[menuType]?.city || "Coimbatore"}
                                onChange={(e) =>
                                  handleAddressChange(menuType, "city", e.target.value)
                                }
                                className="w-full px-4 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-transparent text-[#000000]"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-[#333333] block mb-1">
                                Zip Code *
                              </label>
                              <input
                                type="text"
                                value={editedAddresses[menuType]?.zip || ""}
                                onChange={(e) =>
                                  handleAddressChange(menuType, "zip", e.target.value)
                                }
                                className="w-full px-4 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-transparent text-[#000000]"
                                placeholder="641001"
                                maxLength={6}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-[#333333] block mb-1">
                              Delivery Time Slot
                            </label>
                            <select
                              value={editedAddresses[menuType]?.selectedTimeSlot || ""}
                              onChange={(e) =>
                                handleAddressChange(menuType, "selectedTimeSlot", e.target.value)
                              }
                              className="w-full px-4 py-2 text-sm border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-transparent text-[#000000]"
                            >
                              <option value="">Select a time slot</option>
                              {TIME_SLOTS[menuType as MealCategory]?.map((slot) => (
                                <option key={slot.value} value={slot.value}>
                                  {slot.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-sm text-[#333333]">
                            <MapPin className="w-4 h-4 text-[#3CB371] mt-0.5 flex-shrink-0" />
                            <span>
                              {address.street}, {address.city} - {address.zip}
                            </span>
                          </div>
                          {address.selectedTimeSlot && (
                            <div className="flex items-center gap-2 text-sm text-[#333333] bg-[#F8F9FA] px-3 py-2 rounded-lg">
                              <Clock className="w-4 h-4 text-[#3CB371]" />
                              <span className="font-medium">Time Slot:</span>{" "}
                              {address.selectedTimeSlot}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Payment Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-6">
              <h2 className="text-xl font-bold text-[#000000] mb-6 flex items-center gap-2">
                <Receipt className="w-6 h-6 text-[#3CB371]" />
                Payment Summary
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#333333]">Order Total</span>
                  <span className="font-semibold text-[#000000]">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="pt-4 border-t border-[#E5E5E5]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-[#333333]">Total Amount</span>
                    <span className="text-2xl font-bold text-[#3CB371]">
                      ₹{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5E5E5] space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg">
                    <Banknote className="w-5 h-5 text-[#3CB371]" />
                    <div>
                      <p className="text-xs text-[#333333]">Payment Method</p>
                      <p className="text-sm font-semibold text-[#000000] capitalize">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-[#F8F9FA] rounded-lg">
                    <Tag className="w-5 h-5 text-[#3CB371]" />
                    <div>
                      <p className="text-xs text-[#333333]">Currency</p>
                      <p className="text-sm font-semibold text-[#000000]">{order.currency}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline Card */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-6">
              <h2 className="text-xl font-bold text-[#000000] mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#3CB371]" />
                Order Timeline
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#3CB371]/10 rounded-full">
                    <Timer className="w-4 h-4 text-[#3CB371]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#333333]">Order Placed</p>
                    <p className="text-sm font-semibold text-[#000000]">
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#3CB371]/10 rounded-full">
                    <Clock className="w-4 h-4 text-[#3CB371]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#333333]">Last Updated</p>
                    <p className="text-sm font-semibold text-[#000000]">
                      {new Date(order.updatedAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
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
