"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { toast } from "sonner";
import { getOrderDetails, updateOrder, verifyPayment } from "@/lib/api";
import { Order, PopulatedOrder, DeliveryAddress ,MealCategory  } from "@/lib/types";
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
  }
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

  // Validate addresses
  for (const [category, address] of Object.entries(editedAddresses)) {
    if (!address.street?.trim()) {
      toast.error(`Street address is required for ${category}`);
      return;
    }
    if (!address.zip?.trim()) {
      toast.error(`Zip code is required for ${category}`);
      return;
    }
    if (address.city === 'Coimbatore' && !address.zip.match(/^641\d{3}$/)) {
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
    
    // Refetch the order to get populated data
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

    console.log({ itemId });
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

      console.log("Skipping tomorrow's delivery for item:", itemId);
      console.log("Update payload:", updatePayload);

      await updateOrder(orderIdToUse, updatePayload, token);
      toast.success(
        "Order item updated successfully! Tomorrow's delivery skipped for this item."
      );
      const id = Array.isArray(orderId) ? orderId[0] : orderId;
      fetchOrderDetails(token, id as string);
    } catch (error: any) {
      toast.error(
        `Failed to skip tomorrow's delivery for item: ${error.message}`
      );
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

    console.log({ today, start, end, tomorrow });

    const isItemActiveOrStartsTomorrow =
      (today >= start && today <= end) ||
      start.getTime() === tomorrow.getTime();

    console.log({ isItemActiveOrStartsTomorrow });

    const isTomorrowAlreadySkipped = skippedDates?.includes(tomorrowDateString);
    console.log({ isTomorrowAlreadySkipped });

    return isItemActiveOrStartsTomorrow && !isTomorrowAlreadySkipped;
  };

  const fetchOrderDetails = async (token: string, id: string) => {
    setLoading(true);
    try {
     const verificationResponse = await verifyPayment(id, token)
      if (verificationResponse) {
        toast.success(verificationResponse.message)
      }
      const orderDetails = await getOrderDetails(id, token)
      setOrder(orderDetails);
      if (orderDetails.deliveryAddresses) {
        setEditedAddresses(orderDetails.deliveryAddresses);
      }
      toast.success("Order details fetched successfully!")
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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LottieAnimation animationData={ItayCheffAnimation} style={{ width: 200, height: 200 }} />
      </div>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center min-h-[60vh] px-4">
          <div className="text-center">
            <XCircle
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-red-500"
            />
            <p
              className="text-sm sm:text-base md:text-lg mb-4 text-gray-600"
            >
              Order details not found.
            </p>
            <button
              onClick={() => router.push("/profile")}
              className="mt-4 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base bg-[#3CB371] hover:bg-[#2FA05E] text-white"
            >
              Back to Profile
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }
// Check if order can be edited
  const canEditAddress = ['pending', 'confirmed', 'readyForDelivery'].includes(order.status);
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Page Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-bold text-black"
          >
            Order Details
          </h1>
          <button
            onClick={() => router.push("/profile")}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold bg-[#3CB371] hover:bg-[#2FA05E] text-white"
          >
            Back to Profile
          </button>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
          {/* Order Header - Mobile Optimized */}
          <div
            className="flex flex-col gap-4 border-b border-gray-200 pb-4 mb-4"
          >
            {/* Order ID Section */}
            <div className="flex items-center gap-3">
              <Package
                className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 text-[#3CB371]"
              />
              <div className="min-w-0 flex-1">
                <p
                  className="text-xs sm:text-sm font-medium text-gray-600"
                >
                  Order ID
                </p>
                <h2
                  className="text-base sm:text-lg md:text-xl font-bold truncate text-black"
                >
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
              {order.status === "confirmed" && order.invoiceUrl && (
                <a
                  href={order.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap bg-[#3CB371] hover:bg-[#2FA05E] text-white"
                >
                  <Download className="w-4 h-4 flex-shrink-0" />
                  Download Invoice
                </a>
              )}
            </div>
          </div>

          {/* Order Information Grid - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Date */}
            <div
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200"
            >
              <Calendar
                className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-gray-600"
              />
              <div className="min-w-0">
                <p
                  className="text-xs sm:text-sm font-medium text-gray-600"
                >
                  Order Date
                </p>
                <p
                  className="text-sm sm:text-base font-semibold text-black"
                >
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Total Amount */}
            <div
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200"
            >
              <DollarSign
                className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-gray-600"
              />
              <div className="min-w-0">
                <p
                  className="text-xs sm:text-sm font-medium text-gray-600"
                >
                  Total Amount
                </p>
                <p
                  className="text-sm sm:text-base font-semibold text-black"
                >
                  ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method and Currency - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200"
            >
              <Banknote
                className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-gray-600"
              />
              <div className="min-w-0">
                <p
                  className="text-xs sm:text-sm font-medium text-gray-600"
                >
                  Payment Method
                </p>
                <p
                  className="text-sm sm:text-base font-semibold capitalize text-black"
                >
                  {order.paymentMethod}
                </p>
              </div>
            </div>
            <div
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200"
            >
              <Tag
                className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-gray-600"
              />
              <div className="min-w-0">
                <p
                  className="text-xs sm:text-sm font-medium text-gray-600"
                >
                  Currency
                </p>
                <p
                  className="text-sm sm:text-base font-semibold text-black"
                >
                  {order.currency}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Addresses - Mobile Optimized */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-black">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                <span>Delivery Information</span>
              </h3>
    
              {canEditAddress && !isEditingAddress && (
                <button
                  onClick={handleEditAddress}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
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
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAddresses}
                    disabled={isSavingAddress}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[#3CB371] hover:bg-[#2FA05E] text-white disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSavingAddress ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Use editedAddresses instead of order.deliveryAddresses */}
              {Object.entries(isEditingAddress ? editedAddresses : order.deliveryAddresses).map(
                ([menuType, address], index) => (
                  <div
                    key={index}
                    className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Utensils className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-gray-600" />
                      <p className="text-base sm:text-lg font-semibold capitalize text-black">
                        {menuType} Delivery
                      </p>
                    </div>
                    {isEditingAddress ? (
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs font-semibold text-gray-700 block mb-1">
                            Street Address
                          </label>
                          <input
                            type="text"
                            value={editedAddresses[menuType]?.street || ""}
                            onChange={(e) => handleAddressChange(menuType, "street", e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] text-black"
                            placeholder="Enter street address"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              value={editedAddresses[menuType]?.city || "Coimbatore"}
                              onChange={(e) => handleAddressChange(menuType, "city", e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] text-black"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">
                              Zip Code
                            </label>
                            <input
                              type="text"
                              value={editedAddresses[menuType]?.zip || ""}
                              onChange={(e) => handleAddressChange(menuType, "zip", e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] text-black"
                              placeholder="641001"
                              maxLength={6}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-700 block mb-1">
                            Delivery Time Slot
                          </label>
                          <select
                            value={editedAddresses[menuType]?.selectedTimeSlot || ""}
                            onChange={(e) => handleAddressChange(menuType, "selectedTimeSlot", e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] text-black"
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
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm break-words text-gray-600">
                          <span className="font-medium">Address:</span>{" "}
                          {address.street}, {address.city} - {address.zip}
                        </p>
                        {address.selectedTimeSlot && (
                          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="w-4 h-4 text-[#3CB371]" />
                            <span className="font-medium">Time Slot:</span> {address.selectedTimeSlot}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Ordered Items - Mobile Optimized */}
          <div
            className="pt-4 sm:pt-6 border-t border-gray-200"
          >
            <h3
              className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 text-black"
            >
              <Utensils className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <span>Ordered Items</span>
            </h3>
            <div className="space-y-4 sm:space-y-6">
              {(order.items || []).map((item, index) => {
                const skippedDatesNormalized = item.skippedDates?.map(
                  (dateStr) => new Date(dateStr).toISOString().split("T")[0]
                );
                const isTomorrowSkipped =
                  skippedDatesNormalized?.includes(tomorrowDateString);
                  console.log(order);
                return (
                  <div
                    key={index}
                    className="p-4 sm:p-5 rounded-lg sm:rounded-xl shadow-sm bg-gray-50 border border-gray-200"
                  >
                    {/* Item Header with Image - Mobile Optimized */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <img
                        src={
                          item.menu?.coverImage ||
                          "/public/defaults/default-meal.jpg"
                        }
                        alt={item.menu?.name}
                        className="w-full sm:w-20 h-48 sm:h-20 object-cover rounded-lg"
                      />
                      <div className="flex-grow min-w-0 space-y-1">
                        <p
                          className="text-base sm:text-lg font-bold text-black"
                        >
                          {item.menu?.name}
                        </p>
                        <p
                          className="text-xs sm:text-sm text-gray-600"
                        >
                          <span className="font-medium">Plan:</span>{" "}
                          {item.plan?.name}
                        </p>
                        <p
                          className="text-xs sm:text-sm text-gray-600"
                        >
                          <span className="font-medium">Vendor:</span>{" "}
                          {item.vendor?.name}
                        </p>
                        <p
                          className="text-xs sm:text-sm text-gray-600"
                        >
                          <span className="font-medium">Quantity:</span>{" "}
                          {item.quantity}
                        </p>
                        <p
                          className="text-sm sm:text-base font-semibold pt-1 text-[#3CB371]"
                        >
                          Item Total: ₹{item.itemTotalPrice?.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Person Details */}
                    {item.personDetails && item.personDetails.length > 0 && (
                      <div
                        className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 space-y-2"
                      >
                        <p
                          className="text-xs sm:text-sm font-medium mb-2 text-gray-600"
                        >
                          Person Details:
                        </p>
                        {item.personDetails.map((person, pIndex) => (
                          <div
                            key={pIndex}
                            className="flex items-start gap-2 text-xs sm:text-sm text-black"
                          >
                            <UserIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span className="break-words">
                              {person.name} ({person.phoneNumber})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Selected Meal Times */}
                    {item.selectedMealTimes && item.selectedMealTimes.length > 0 && (
                      <div
                        className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex items-center gap-2 text-xs sm:text-sm text-gray-600"
                      >
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">Meal Times:</span>
                        <span className="break-words capitalize">
                          {item.selectedMealTimes.join(", ")}
                        </span>
                      </div>
                    )}

                    {/* Date Range */}
                    <div
                      className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex items-center gap-2 text-xs sm:text-sm text-gray-600"
                    >
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="break-words">
                        {new Date(item.startDate).toLocaleDateString()} -{" "}
                        {new Date(item.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Skip Tomorrow Button for each item */}
                    <div
                      className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200"
                    >
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
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap disabled:opacity-60 bg-[#3CB371] hover:bg-[#2FA05E] text-white"
                      >
                        {isUpdating ? (
                          <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                        ) : (
                          <FastForward className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span className="hidden sm:inline">
                          {isTomorrowSkipped
                            ? "Already Skipped Tomorrow"
                            : "Skip Tomorrow"}
                        </span>
                        <span className="sm:hidden">
                          {isTomorrowSkipped ? "Skipped" : "Skip"}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Order Details - Mobile Optimized */}
          <div
            className="pt-4 sm:pt-6 border-t border-gray-200"
          >
            <h3
              className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 text-black"
            >
              <Info className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <span>Additional Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200"
              >
                <Timer
                  className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 text-gray-600"
                />
                <div className="min-w-0">
                  <p
                    className="text-xs sm:text-sm font-medium mb-1 text-gray-600"
                  >
                    Order Placed At
                  </p>
                  <p
                    className="text-xs sm:text-base font-semibold break-words text-black"
                  >
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div
                className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-200"
              >
                <Clock
                  className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 text-gray-600"
                />
                <div className="min-w-0">
                  <p
                    className="text-xs sm:text-sm font-medium mb-1 text-gray-600"
                  >
                    Last Updated At
                  </p>
                  <p
                    className="text-xs sm:text-base font-semibold break-words text-black"
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
