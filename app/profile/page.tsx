"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { Footer } from "@/components/footer";
import { toast } from "sonner";
import {
  getProfileDetails,
  updateProfileDetails,
  getAllOrders,
  updateOrder,
} from "@/lib/api";
import { DeliveryLocation, UserProfile, Order } from "@/lib/types";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  Package,
  Sun,
  Sunset,
  Moon,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Award,
  MapPinned,
  Navigation,
} from "lucide-react";
import { Header } from "@/components/header";
import { CancelConfirmationModal } from "@/components/cancel-confirmation-modal";

export default function ProfilePage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false); // New state for tab-specific loading
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses">(
    "overview"
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    breakfastDeliveryLocation: {
      street: "",
      state: "",
      pincode: "",
      lat: 0,
      lon: 0,
    },
    lunchDeliveryLocation: {
      street: "",
      state: "",
      pincode: "",
      lat: 0,
      lon: 0,
    },
    dinnerDeliveryLocation: {
      street: "",
      state: "",
      pincode: "",
      lat: 0,
      lon: 0,
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Unauthorized. Please log in again.");
      router.push("/auth");
    } else if (token) {
      fetchUserProfile(token);
    }
  }, [user, token, authLoading, router]);

  useEffect(() => {
    if (activeTab === "orders" && token) {
      fetchOrders(token);
    }
  }, [activeTab, token]);

  const fetchOrders = async (token: string) => {
    setTabLoading(true); // Use tabLoading here
    try {
      const data = await getAllOrders(token);
      setOrders(data);
    } catch (error: any) {
      toast.error(`Failed to fetch orders: ${error.message}`);
    } finally {
      setTabLoading(false); // Use tabLoading here
    }
  };

  const fetchUserProfile = async (token: string) => {
    setLoading(true);
    try {
      const data = await getProfileDetails(token);
      if (!data) {
        toast.error("Unauthorized. Please log in again.");
        router.push("/auth");
        return;
      }
      setProfile(data);
      setFormData({
        fullName: data.fullName || "",
        phoneNumber: data.phoneNumber || "",
        breakfastDeliveryLocation: data.breakfastDeliveryLocation || {
          street: "",
          state: "",
          pincode: "",
          lat: 0,
          lon: 0,
        },
        lunchDeliveryLocation: data.lunchDeliveryLocation || {
          street: "",
          state: "",
          pincode: "",
          lat: 0,
          lon: 0,
        },
        dinnerDeliveryLocation: data.dinnerDeliveryLocation || {
          street: "",
          state: "",
          pincode: "",
          lat: 0,
          lon: 0,
        },
      });
    } catch (error: any) {
      toast.error(`Failed to fetch profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      router.push("/auth");
      return;
    }

    setLoading(true);
    try {
      const updatedOrder = await updateOrder(orderId, { status: "cancelled" }, token);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
      toast.success(`Order cancelled successfully!`);
    } catch (error: any) {
      toast.error(`Failed to cancel order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    locationType:
      | "breakfastDeliveryLocation"
      | "lunchDeliveryLocation"
      | "dinnerDeliveryLocation"
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [locationType]: {
        ...prev[locationType],
        [name]: name === "lat" || name === "lon" ? parseFloat(value) : value,
      },
    }));
  };

  const handleFetchGPSLocation = async (
    locationType:
      | "breakfastDeliveryLocation"
      | "lunchDeliveryLocation"
      | "dinnerDeliveryLocation"
  ) => {
    setLoading(true);
    try {
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser.");
        setLoading(false);
        return;
      }

      toast.info("Fetching GPS location...");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            [locationType]: {
              ...prev[locationType],
              lat: latitude,
              lon: longitude,
            },
          }));
          toast.success("GPS location fetched successfully!");
          setLoading(false);
        },
        (error) => {
          toast.error(`Failed to fetch GPS location: ${error.message}`);
          setLoading(false);
        }
      );
    } catch (error: any) {
      toast.error(`Failed to fetch GPS location: ${error.message}`);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        router.push("/auth");
        return;
      }

      const updatedData = await updateProfileDetails(formData as UserProfile, token);
      setProfile(updatedData);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(`Failed to update profile: ${error.message}`);
      if (error.message.includes("session expired")) {
        router.push("/auth");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "delivered":
        return <Package className="w-4 h-4" />;
      case "cancelled":
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4"
            style={{ borderColor: "#606C38", borderTopColor: "transparent" }}
          ></div>
          <p
            className="text-lg font-semibold animate-pulse"
            style={{ color: "#283618" }}
          >
            Loading your profile...
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle
              className="w-20 h-20 mx-auto mb-6"
              style={{ color: "#BC6C25" }}
            />
            <h2 className="text-2xl font-bold mb-3" style={{ color: "#283618" }}>
              Profile Not Found
            </h2>
            <p className="mb-6" style={{ color: "#606C38" }}>
              We couldn't load your profile data. Please try logging in again.
            </p>
            <button
              onClick={() => router.push("/auth")}
              className="px-6 py-3 rounded-lg font-semibold"
              style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
            >
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Calculate user stats
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;
  const totalSpent = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const deliveryLocations = [
    {
      id: "breakfast",
      title: "Breakfast",
      icon: Sun,
      location: profile.breakfastDeliveryLocation,
      formKey: "breakfastDeliveryLocation" as const,
      gradient: "from-amber-400 via-orange-400 to-amber-500",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      id: "lunch",
      title: "Lunch",
      icon: Sunset,
      location: profile.lunchDeliveryLocation,
      formKey: "lunchDeliveryLocation" as const,
      gradient: "from-orange-400 via-red-400 to-pink-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: "dinner",
      title: "Dinner",
      icon: Moon,
      location: profile.dinnerDeliveryLocation,
      formKey: "dinnerDeliveryLocation" as const,
      gradient: "from-indigo-500 via-purple-500 to-indigo-600",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
      <Header/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Card */}
        <div
          className="rounded-3xl overflow-hidden shadow-2xl mb-8"
          style={{
            background: "linear-gradient(135deg, #606C38 0%, #283618 100%)",
          }}
        >

          <div className="relative p-8 sm:p-10">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Profile Avatar & Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
                <div className="relative group">
                  <div
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center text-5xl font-bold shadow-2xl transform transition-transform group-hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #DDA15E, #BC6C25)",
                      color: "#FEFAE0",
                    }}
                  >
                    {profile.fullName
                      ? profile.fullName.charAt(0).toUpperCase()
                      : profile.email.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: "#DDA15E" }}
                  >
                    <Award className="w-5 h-5" style={{ color: "#283618" }} />
                  </div>
                </div>

                <div className="text-center sm:text-left flex-1">
                  <h1
                    className="text-3xl sm:text-4xl font-bold mb-3"
                    style={{ color: "#FEFAE0" }}
                  >
                    {profile.fullName || profile.name || "User"}
                  </h1>

                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <Mail className="w-4 h-4" style={{ color: "#DDA15E" }} />
                      <span
                        className="text-sm"
                        style={{ color: "rgba(254, 250, 224, 0.9)" }}
                      >
                        {profile.email}
                      </span>
                    </div>
                    {profile.phoneNumber && (
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <Phone className="w-4 h-4" style={{ color: "#DDA15E" }} />
                        <span
                          className="text-sm"
                          style={{ color: "rgba(254, 250, 224, 0.9)" }}
                        >
                          {profile.phoneNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
                <div
                  className="rounded-2xl p-5 backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(254, 250, 224, 0.15)" }}
                >
                  <Package className="w-7 h-7 mb-2" style={{ color: "#DDA15E" }} />
                  <p
                    className="text-2xl font-bold mb-1"
                    style={{ color: "#FEFAE0" }}
                  >
                    {totalOrders}
                  </p>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "rgba(254, 250, 224, 0.7)" }}
                  >
                    Total Orders
                  </p>
                </div>

                <div
                  className="rounded-2xl p-5 backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(254, 250, 224, 0.15)" }}
                >
                  <CheckCircle2 className="w-7 h-7 mb-2" style={{ color: "#DDA15E" }} />
                  <p
                    className="text-2xl font-bold mb-1"
                    style={{ color: "#FEFAE0" }}
                  >
                    {deliveredOrders}
                  </p>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "rgba(254, 250, 224, 0.7)" }}
                  >
                    Delivered
                  </p>
                </div>

                <div
                  className="rounded-2xl p-5 backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(254, 250, 224, 0.15)" }}
                >
                  <Clock className="w-7 h-7 mb-2" style={{ color: "#DDA15E" }} />
                  <p
                    className="text-2xl font-bold mb-1"
                    style={{ color: "#FEFAE0" }}
                  >
                    {pendingOrders}
                  </p>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "rgba(254, 250, 224, 0.7)" }}
                  >
                    Active
                  </p>
                </div>

                <div
                  className="rounded-2xl p-5 backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(254, 250, 224, 0.15)" }}
                >
                  <TrendingUp className="w-7 h-7 mb-2" style={{ color: "#DDA15E" }} />
                  <p
                    className="text-2xl font-bold mb-1"
                    style={{ color: "#FEFAE0" }}
                  >
                    ₹{totalSpent.toFixed(0)}
                  </p>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "rgba(254, 250, 224, 0.7)" }}
                  >
                    Total Spent
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <div
          className="inline-flex gap-2 p-2 rounded-2xl mb-8 shadow-lg"
          style={{ backgroundColor: "#ffffff" }}
        >
          <button
            onClick={() => {
              setActiveTab("overview");
              setTabLoading(false); // No loading needed for overview
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "overview" ? "shadow-md" : ""
            }`}
            style={{
              backgroundColor: activeTab === "overview" ? "#606C38" : "transparent",
              color: activeTab === "overview" ? "#FEFAE0" : "#606C38",
            }}
          >
            <User className="w-5 h-5" />
            Overview
          </button>
          <button
            onClick={() => {
              setActiveTab("orders");
              setTabLoading(true); // Set tabLoading to true when switching to orders
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "orders" ? "shadow-md" : ""
            }`}
            style={{
              backgroundColor: activeTab === "orders" ? "#606C38" : "transparent",
              color: activeTab === "orders" ? "#FEFAE0" : "#606C38",
            }}
          >
            <Package className="w-5 h-5" />
            Orders
            {pendingOrders > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ backgroundColor: "#DDA15E", color: "#283618" }}
              >
                {pendingOrders}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("addresses");
              setTabLoading(false); // No loading needed for addresses as it uses profile data already fetched
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
              activeTab === "addresses" ? "shadow-md" : ""
            }`}
            style={{
              backgroundColor: activeTab === "addresses" ? "#606C38" : "transparent",
              color: activeTab === "addresses" ? "#FEFAE0" : "#606C38",
            }}
          >
            <MapPin className="w-5 h-5" />
            Addresses
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Personal Information Card with Inline Edit */}
            <div
              className="rounded-3xl p-8 shadow-xl border"
              style={{ backgroundColor: "#ffffff", borderColor: "rgba(96, 108, 56, 0.1)" }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: "rgba(96, 108, 56, 0.1)" }}
                  >
                    <User className="w-6 h-6" style={{ color: "#606C38" }} />
                  </div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "#283618" }}
                  >
                    Personal Information
                  </h2>
                </div>

                {/* Inline Edit Controls */}
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            fullName: profile?.fullName || "",
                            phoneNumber: profile?.phoneNumber || "",
                            breakfastDeliveryLocation: profile?.breakfastDeliveryLocation || {
                              street: "",
                              state: "",
                              pincode: "",
                              lat: 0,
                              lon: 0,
                            },
                            lunchDeliveryLocation: profile?.lunchDeliveryLocation || {
                              street: "",
                              state: "",
                              pincode: "",
                              lat: 0,
                              lon: 0,
                            },
                            dinnerDeliveryLocation: profile?.dinnerDeliveryLocation || {
                              street: "",
                              state: "",
                              pincode: "",
                              lat: 0,
                              lon: 0,
                            },
                          });
                        }}
                        className="p-2.5 rounded-xl transition-all"
                        style={{
                          backgroundColor: "rgba(188, 108, 37, 0.1)",
                          color: "#BC6C25",
                        }}
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleUpdateProfile}
                        disabled={loading}
                        className="px-5 py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
                        style={{ backgroundColor: "#DDA15E", color: "#283618" }}
                      >
                        <Save className="w-5 h-5" />
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
                      style={{ backgroundColor: "#DDA15E", color: "#283618" }}
                    >
                      <Edit3 className="w-5 h-5" />
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm font-semibold mb-3"
                    style={{ color: "#606C38" }}
                  >
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2"
                      style={{
                        border: "2px solid rgba(221, 161, 94, 0.3)",
                        color: "#283618",
                        backgroundColor: "#FEFAE0",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#606C38";
                        e.currentTarget.style.boxShadow = "0 0 0 4px rgba(96, 108, 56, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(221, 161, 94, 0.3)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="px-4 py-3.5 rounded-xl text-sm font-semibold"
                      style={{
                        backgroundColor: "rgba(221, 161, 94, 0.08)",
                        color: "#283618",
                      }}
                    >
                      {profile.fullName || (
                        <span style={{ color: "#999" }}>Not set</span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-3"
                    style={{ color: "#606C38" }}
                  >
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2"
                      style={{
                        border: "2px solid rgba(221, 161, 94, 0.3)",
                        color: "#283618",
                        backgroundColor: "#FEFAE0",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#606C38";
                        e.currentTarget.style.boxShadow = "0 0 0 4px rgba(96, 108, 56, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "rgba(221, 161, 94, 0.3)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="px-4 py-3.5 rounded-xl text-sm font-semibold"
                      style={{
                        backgroundColor: "rgba(221, 161, 94, 0.08)",
                        color: "#283618",
                      }}
                    >
                      {profile.phoneNumber || (
                        <span style={{ color: "#999" }}>Not set</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveTab("orders")}
                className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left group"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: "rgba(96, 108, 56, 0.1)" }}
                  >
                    <Package className="w-7 h-7" style={{ color: "#606C38" }} />
                  </div>
                  <ArrowRight className="w-5 h-5" style={{ color: "#DDA15E" }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#283618" }}>
                  My Orders
                </h3>
                <p className="text-sm" style={{ color: "#606C38" }}>
                  View and track your orders
                </p>
              </button>

              <button
                onClick={() => setActiveTab("addresses")}
                className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left group"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}
                  >
                    <MapPin className="w-7 h-7" style={{ color: "#BC6C25" }} />
                  </div>
                  <ArrowRight className="w-5 h-5" style={{ color: "#DDA15E" }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#283618" }}>
                  Delivery Addresses
                </h3>
                <p className="text-sm" style={{ color: "#606C38" }}>
                  Manage your delivery locations
                </p>
              </button>

              <button
                onClick={() => router.push("/pricing")}
                className="p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left group"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: "rgba(188, 108, 37, 0.1)" }}
                  >
                    <CreditCard className="w-7 h-7" style={{ color: "#BC6C25" }} />
                  </div>
                  <ArrowRight className="w-5 h-5" style={{ color: "#DDA15E" }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#283618" }}>
                  Browse Meals
                </h3>
                <p className="text-sm" style={{ color: "#606C38" }}>
                  Explore our delicious menu
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="relative min-h-[300px]"> {/* Added min-h to ensure space for loader */}
            {tabLoading ? (
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/70 rounded-3xl z-10">
                <div
                  className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mb-3"
                  style={{ borderColor: "#606C38", borderTopColor: "transparent" }}
                ></div>
                <p className="text-md font-semibold" style={{ color: "#283618" }}>
                  Loading orders...
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div
                className="rounded-3xl p-16 text-center shadow-xl"
                style={{ backgroundColor: "#ffffff" }}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}
                >
                  <Package className="w-12 h-12" style={{ color: "#DDA15E" }} />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: "#283618" }}>
                  No Orders Yet
                </h3>
                <p className="mb-8 text-lg" style={{ color: "#606C38" }}>
                  Start your culinary journey with us today!
                </p>
                <button
                  onClick={() => router.push("/pricing")}
                  className="px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                  style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
                >
                  Browse Meals
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border"
                    style={{
                      backgroundColor: "#ffffff",
                      borderColor: "rgba(96, 108, 56, 0.1)",
                    }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Order Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: "rgba(96, 108, 56, 0.1)" }}
                          >
                            <Package className="w-6 h-6" style={{ color: "#606C38" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h4
                                className="font-bold text-lg"
                                style={{ color: "#283618" }}
                              >
                                Order #{order._id?.substring(0, 8).toUpperCase()}
                              </h4>
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-2xl font-bold mb-2" style={{ color: "#606C38" }}>
                              ₹{order.totalAmount.toFixed(2)}
                            </p>
                            {order.createdAt && (
                              <div className="flex items-center gap-2 text-sm" style={{ color: "#999" }}>
                                <Calendar className="w-4 h-4" />
                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() =>
                            order._id && router.push(`/order-details/${order._id}`)
                          }
                          className="px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                          style={{
                            backgroundColor: "#DDA15E",
                            color: "#283618",
                          }}
                        >
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        {(order.status === "pending" || order.status === "confirmed") && (
                          <CancelConfirmationModal
                            onConfirm={() => order._id && handleCancelOrder(order._id)}
                          >
                            <button
                              className="px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg"
                              style={{
                                backgroundColor: "rgba(188, 108, 37, 0.1)",
                                color: "#BC6C25",
                              }}
                              disabled={loading}
                            >
                              Cancel Order
                            </button>
                          </CancelConfirmationModal>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === "addresses" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold" style={{ color: "#283618" }}>
                Delivery Locations
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                  style={{ backgroundColor: "#DDA15E", color: "#283618" }}
                >
                  <Edit3 className="w-4 h-4" />
                  Edit All
                </button>
              )}
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {deliveryLocations.map((item) => {
                const Icon = item.icon;
                const hasLocation =
                  item.location?.street ||
                  item.location?.state ||
                  item.location?.pincode ||
                  (item.location?.lat !== 0 && item.location?.lat !== undefined);

                return (
                  <div
                    key={item.id}
                    className="rounded-3xl overflow-hidden shadow-xl border transition-all hover:shadow-2xl"
                    style={{ borderColor: "rgba(96, 108, 56, 0.1)" }}
                  >
                    {/* Header with Gradient */}
                    <div className={`p-6 bg-gradient-to-br ${item.gradient}`}>
                      <div className="flex items-center gap-4 mb-3">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.iconBg}`}
                        >
                          <Icon className={`w-7 h-7 ${item.iconColor}`} />
                        </div>
                        <h3 className="font-bold text-2xl text-white">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm text-white/80">
                        Default delivery location for {item.title.toLowerCase()}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="p-6" style={{ backgroundColor: "#ffffff" }}>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label
                              className="block text-xs font-semibold mb-2"
                              style={{ color: "#606C38" }}
                            >
                              Street Address
                            </label>
                            <input
                              name="street"
                              placeholder="123 Main Street"
                              value={formData[item.formKey]?.street || ""}
                              onChange={(e) => handleLocationChange(e, item.formKey)}
                              className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2"
                              style={{
                                border: "2px solid rgba(221, 161, 94, 0.3)",
                                color: "#283618",
                                backgroundColor: "#FEFAE0",
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.borderColor = "#606C38";
                                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(96, 108, 56, 0.1)";
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.borderColor = "rgba(221, 161, 94, 0.3)";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label
                                className="block text-xs font-semibold mb-2"
                                style={{ color: "#606C38" }}
                              >
                                State
                              </label>
                              <input
                                name="state"
                                placeholder="Maharashtra"
                                value={formData[item.formKey]?.state || ""}
                                onChange={(e) => handleLocationChange(e, item.formKey)}
                                className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2"
                                style={{
                                  border: "2px solid rgba(221, 161, 94, 0.3)",
                                  color: "#283618",
                                  backgroundColor: "#FEFAE0",
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = "#606C38";
                                  e.currentTarget.style.boxShadow = "0 0 0 4px rgba(96, 108, 56, 0.1)";
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = "rgba(221, 161, 94, 0.3)";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              />
                            </div>
                            <div>
                              <label
                                className="block text-xs font-semibold mb-2"
                                style={{ color: "#606C38" }}
                              >
                                Pincode
                              </label>
                              <input
                                name="pincode"
                                placeholder="400001"
                                value={formData[item.formKey]?.pincode || ""}
                                onChange={(e) => handleLocationChange(e, item.formKey)}
                                className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2"
                                style={{
                                  border: "2px solid rgba(221, 161, 94, 0.3)",
                                  color: "#283618",
                                  backgroundColor: "#FEFAE0",
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = "#606C38";
                                  e.currentTarget.style.boxShadow = "0 0 0 4px rgba(96, 108, 56, 0.1)";
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = "rgba(221, 161, 94, 0.3)";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label
                                className="block text-xs font-semibold mb-2"
                                style={{ color: "#606C38" }}
                              >
                                Latitude
                              </label>
                              <input
                                name="lat"
                                type="number"
                                step="any"
                                placeholder="19.0760"
                                value={formData[item.formKey]?.lat || ""}
                                onChange={(e) => handleLocationChange(e, item.formKey)}
                                className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2"
                                style={{
                                  border: "2px solid rgba(221, 161, 94, 0.3)",
                                  color: "#283618",
                                  backgroundColor: "#FEFAE0",
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = "#606C38";
                                  e.currentTarget.style.boxShadow = "0 0 0 4px rgba(96, 108, 56, 0.1)";
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = "rgba(221, 161, 94, 0.3)";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              />
                            </div>
                            <div>
                              <label
                                className="block text-xs font-semibold mb-2"
                                style={{ color: "#606C38" }}
                              >
                                Longitude
                              </label>
                              <input
                                name="lon"
                                type="number"
                                step="any"
                                placeholder="72.8777"
                                value={formData[item.formKey]?.lon || ""}
                                onChange={(e) => handleLocationChange(e, item.formKey)}
                                className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2"
                                style={{
                                  border: "2px solid rgba(221, 161, 94, 0.3)",
                                  color: "#283618",
                                  backgroundColor: "#FEFAE0",
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = "#606C38";
                                  e.currentTarget.style.boxShadow = "0 0 0 4px rgba(96, 108, 56, 0.1)";
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = "rgba(221, 161, 94, 0.3)";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleFetchGPSLocation(item.formKey)}
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                            style={{
                              backgroundColor: "#606C38",
                              color: "#FEFAE0",
                            }}
                          >
                            <Navigation className="w-4 h-4" />
                            Fetch My Location
                          </button>
                        </div>
                      ) : (
                        <div>
                          {hasLocation ? (
                            <div className="space-y-4">
                              {item.location?.street && (
                                <div>
                                  <p
                                    className="text-xs font-semibold mb-1"
                                    style={{ color: "#999" }}
                                  >
                                    ADDRESS
                                  </p>
                                  <p
                                    className="text-sm font-semibold"
                                    style={{ color: "#283618" }}
                                  >
                                    {item.location.street}
                                  </p>
                                </div>
                              )}
                              
                              {(item.location?.state || item.location?.pincode) && (
                                <div>
                                  <p
                                    className="text-xs font-semibold mb-1"
                                    style={{ color: "#999" }}
                                  >
                                    LOCATION
                                  </p>
                                  <p
                                    className="text-sm font-semibold"
                                    style={{ color: "#283618" }}
                                  >
                                    {item.location.state}
                                    {item.location.state && item.location.pincode && " - "}
                                    {item.location.pincode}
                                  </p>
                                </div>
                              )}

                              {(item.location?.lat !== 0 && item.location?.lat !== undefined) && (
                                <div>
                                  <p
                                    className="text-xs font-semibold mb-2"
                                    style={{ color: "#999" }}
                                  >
                                    COORDINATES
                                  </p>
                                  <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${item.location.lat},${item.location.lon}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-md"
                                    style={{
                                      backgroundColor: "rgba(96, 108, 56, 0.1)",
                                      color: "#606C38",
                                    }}
                                  >
                                    <MapPinned className="w-4 h-4" />
                                    View on Map
                                  </a>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <AlertCircle
                                className="w-12 h-12 mx-auto mb-3"
                                style={{ color: "#DDA15E" }}
                              />
                              <p
                                className="text-sm font-semibold mb-1"
                                style={{ color: "#283618" }}
                              >
                                No address set
                              </p>
                              <p className="text-xs" style={{ color: "#999" }}>
                                Add your {item.title.toLowerCase()} delivery location
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {isEditing && (
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      fullName: profile?.fullName || "",
                      phoneNumber: profile?.phoneNumber || "",
                      breakfastDeliveryLocation: profile?.breakfastDeliveryLocation || {
                        street: "",
                        state: "",
                        pincode: "",
                        lat: 0,
                        lon: 0,
                      },
                      lunchDeliveryLocation: profile?.lunchDeliveryLocation || {
                        street: "",
                        state: "",
                        pincode: "",
                        lat: 0,
                        lon: 0,
                      },
                      dinnerDeliveryLocation: profile?.dinnerDeliveryLocation || {
                        street: "",
                        state: "",
                        pincode: "",
                        lat: 0,
                        lon: 0,
                      },
                    });
                  }}
                  className="px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                  style={{
                    backgroundColor: "rgba(188, 108, 37, 0.1)",
                    color: "#BC6C25",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                  style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
                >
                  <Save className="w-5 h-5" />
                  {loading ? "Saving..." : "Save All Addresses"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
