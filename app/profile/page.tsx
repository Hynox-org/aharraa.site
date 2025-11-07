"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { Header } from "@/components/header";
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
} from "lucide-react";

export default function ProfilePage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal-details" | "orders">(
  "personal-details"
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
    setLoading(true);
    try {
      const data = await getAllOrders(token);
      setOrders(data);
    } catch (error: any) {
      toast.error(`Failed to fetch orders: ${error.message}`);
    } finally {
      setLoading(false);
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

    if (!window.confirm("Are you sure you want to cancel this order?")) {
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
      toast.success(`Order ${orderId.substring(0, 8)}... cancelled successfully!`);
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

          // Optionally, fetch pincode/address from lat/lon using a reverse geocoding API
          // For this example, we'll just update lat/lon
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
        return "text-yellow-600"; // Example color for pending
      case "confirmed":
        return "text-blue-600"; // Example color for confirmed
      case "delivered":
        return "text-green-600"; // Example color for delivered
      case "cancelled":
        return "text-red-600"; // Example color for cancelled
      default:
        return "text-gray-600";
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
            Loading profile...
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle
              className="w-16 h-16 mx-auto mb-4"
              style={{ color: "#BC6C25" }}
            />
            <p className="text-base sm:text-lg" style={{ color: "#606C38" }}>
              No profile data found.
            </p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const deliveryLocations = [
    {
      id: "breakfast",
      title: "Breakfast",
      icon: Sun,
      location: profile.breakfastDeliveryLocation,
      formKey: "breakfastDeliveryLocation" as const,
      gradient: "from-[#DDA15E] to-[#BC6C25]",
    },
    {
      id: "lunch",
      title: "Lunch",
      icon: Sunset,
      location: profile.lunchDeliveryLocation,
      formKey: "lunchDeliveryLocation" as const,
      gradient: "from-[#606C38] to-[#283618]",
    },
    {
      id: "dinner",
      title: "Dinner",
      icon: Moon,
      location: profile.dinnerDeliveryLocation,
      formKey: "dinnerDeliveryLocation" as const,
      gradient: "from-[#283618] to-[#606C38]",
    },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#FEFAE0" }}>
      <Header />

      {/* Compact Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #606C38 0%, #283618 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
            {/* Avatar and Info */}
            <div className="flex items-center gap-4 flex-grow sm:flex-grow-0 w-full sm:w-auto justify-center sm:justify-start">
              <div className="relative">
                {/* Avatar */}
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold"
                  style={{
                    background: "linear-gradient(135deg, #DDA15E, #BC6C25)",
                    color: "#FEFAE0",
                  }}
                >
                  {profile.fullName
                    ? profile.fullName.charAt(0).toUpperCase()
                    : profile.email.charAt(0).toUpperCase()}
                </div>
              </div>

              <div>
                <h1
                  className="text-xl sm:text-2xl font-bold mb-1"
                  style={{ color: "#FEFAE0" }}
                >
                  {profile.fullName || profile.name || profile.email}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  {profile.fullName && profile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" style={{ color: "#DDA15E" }} />
                      <span
                        className="text-xs sm:text-sm"
                        style={{ color: "rgba(254, 250, 224, 0.9)" }}
                      >
                        {profile.email}
                      </span>
                    </div>
                  )}
                  {profile.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" style={{ color: "#DDA15E" }} />
                      <span
                        className="text-xs sm:text-sm"
                        style={{ color: "rgba(254, 250, 224, 0.9)" }}
                      >
                        {profile.phoneNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 sm:p-2.5 rounded-lg transition-all"
                    style={{
                      backgroundColor: "rgba(254, 250, 224, 0.1)",
                      color: "#FEFAE0",
                    }}
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="px-4 py-2 sm:py-2.5 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 text-sm font-bold"
                    style={{ backgroundColor: "#DDA15E", color: "#283618" }}
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 sm:py-2.5 rounded-lg transition-all flex items-center gap-2 text-sm font-bold"
                  style={{ backgroundColor: "#DDA15E", color: "#283618" }}
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("personal-details")}
            className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold text-sm sm:text-base whitespace-nowrap transition-all"
            style={{
              backgroundColor:
                activeTab === "personal-details" ? "#606C38" : "#ffffff",
              color: activeTab === "personal-details" ? "#FEFAE0" : "#606C38",
              boxShadow:
                activeTab === "personal-details"
                  ? "0 4px 12px rgba(96, 108, 56, 0.3)"
                  : "0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <User className="w-5 h-5" />
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold text-sm sm:text-base whitespace-nowrap transition-all"
            style={{
              backgroundColor: activeTab === "orders" ? "#606C38" : "#ffffff",
              color: activeTab === "orders" ? "#FEFAE0" : "#606C38",
              boxShadow:
                activeTab === "orders"
                  ? "0 4px 12px rgba(96, 108, 56, 0.3)"
                  : "0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Package className="w-5 h-5" />
            My Orders
          </button>
        </div>

        {/* Personal Details Tab */}
        {activeTab === "personal-details" && (
          <div className="space-y-6">
            {/* Basic Information Card */}
            <div
              className="rounded-2xl p-6 sm:p-8 shadow-lg"
              style={{ backgroundColor: "#ffffff" }}
            >
              <h2
                className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2"
                style={{ color: "#283618" }}
              >
                <User className="w-6 h-6" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: "#283618" }}
                  >
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                      style={{
                        border: "2px solid #DDA15E",
                        color: "#283618",
                        backgroundColor: "#FEFAE0",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#606C38")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "#DDA15E")
                      }
                    />
                  ) : (
                    <div
                      className="px-4 py-3 rounded-xl text-sm font-medium"
                      style={{
                        backgroundColor: "rgba(221, 161, 94, 0.1)",
                        color: "#283618",
                      }}
                    >
                      {profile.fullName || "Not set"}
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    className="block text-sm font-bold mb-2"
                    style={{ color: "#283618" }}
                  >
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                      style={{
                        border: "2px solid #DDA15E",
                        color: "#283618",
                        backgroundColor: "#FEFAE0",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "#606C38")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "#DDA15E")
                      }
                    />
                  ) : (
                    <div
                      className="px-4 py-3 rounded-xl text-sm font-medium"
                      style={{
                        backgroundColor: "rgba(221, 161, 94, 0.1)",
                        color: "#283618",
                      }}
                    >
                      {profile.phoneNumber || "Not set"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Locations */}
            <div>
              <h2
                className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-2"
                style={{ color: "#283618" }}
              >
                <MapPin className="w-6 h-6" />
                Delivery Locations
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {deliveryLocations.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl overflow-hidden shadow-lg"
                    >
                      {/* Header with Gradient */}
                      <div className={`p-4 bg-gradient-to-r ${item.gradient}`}>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{
                              backgroundColor: "rgba(254, 250, 224, 0.2)",
                            }}
                          >
                            <Icon
                              className="w-6 h-6"
                              style={{ color: "#FEFAE0" }}
                            />
                          </div>
                          <h3
                            className="font-bold text-lg"
                            style={{ color: "#FEFAE0" }}
                          >
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div
                        className="p-4 sm:p-5"
                        style={{ backgroundColor: "#ffffff" }}
                      >
                        {isEditing ? (
                          <div className="space-y-3">
                            <input
                              name="street"
                              placeholder="Street Address"
                              value={formData[item.formKey]?.street || ""}
                              onChange={(e) =>
                                handleLocationChange(e, item.formKey)
                              }
                              className="w-full px-3 py-2 rounded-lg text-sm transition-all"
                              style={{
                                border: "2px solid #DDA15E",
                                color: "#283618",
                                backgroundColor: "#FEFAE0",
                              }}
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                name="state"
                                placeholder="State"
                                value={formData[item.formKey]?.state || ""}
                                onChange={(e) =>
                                  handleLocationChange(e, item.formKey)
                                }
                                className="w-full px-3 py-2 rounded-lg text-sm transition-all"
                                style={{
                                  border: "2px solid #DDA15E",
                                  color: "#283618",
                                  backgroundColor: "#FEFAE0",
                                }}
                              />
                              <input
                                name="pincode"
                                placeholder="Pincode"
                                value={formData[item.formKey]?.pincode || ""}
                                onChange={(e) =>
                                  handleLocationChange(e, item.formKey)
                                }
                                className="w-full px-3 py-2 rounded-lg text-sm transition-all"
                                style={{
                                  border: "2px solid #DDA15E",
                                  color: "#283618",
                                  backgroundColor: "#FEFAE0",
                                }}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                name="lat"
                                type="number"
                                placeholder="Latitude"
                                value={formData[item.formKey]?.lat || 0}
                                onChange={(e) =>
                                  handleLocationChange(e, item.formKey)
                                }
                                className="w-full px-3 py-2 rounded-lg text-xs transition-all"
                                style={{
                                  border: "2px solid #DDA15E",
                                  color: "#283618",
                                  backgroundColor: "#FEFAE0",
                                }}
                              />
                              <input
                                name="lon"
                                type="number"
                                placeholder="Longitude"
                                value={formData[item.formKey]?.lon || 0}
                                onChange={(e) =>
                                  handleLocationChange(e, item.formKey)
                                }
                                className="w-full px-3 py-2 rounded-lg text-xs transition-all"
                                style={{
                                  border: "2px solid #DDA15E",
                                  color: "#283618",
                                  backgroundColor: "#FEFAE0",
                                }}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFetchGPSLocation(item.formKey)}
                              className="w-full px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                              style={{
                                backgroundColor: "#606C38",
                                color: "#FEFAE0",
                              }}
                            >
                              <MapPin className="w-4 h-4" />
                              Fetch GPS Location
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {(() => {
                              const hasLocationData =
                                item.location?.street ||
                                item.location?.state ||
                                item.location?.pincode ||
                                (item.location?.lat !== 0 && item.location?.lat !== undefined) ||
                                (item.location?.lon !== 0 && item.location?.lon !== undefined);

                              if (hasLocationData) {
                                return (
                                  <>
                                    {item.location?.street && (
                                      <p
                                        className="text-sm font-medium"
                                        style={{ color: "#283618" }}
                                      >
                                        {item.location.street}
                                      </p>
                                    )}
                                    {(item.location?.state || item.location?.pincode) && (
                                      <p
                                        className="text-sm"
                                        style={{ color: "#606C38" }}
                                      >
                                        {item.location.state}{" "}
                                        {item.location.state && item.location.pincode && "- "}{" "}
                                        {item.location.pincode}
                                      </p>
                                    )}
                                    {(item.location?.lat !== 0 && item.location?.lat !== undefined) ||
                                    (item.location?.lon !== 0 && item.location?.lon !== undefined) ? (
                                      <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${item.location.lat},${item.location.lon}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 pt-2 cursor-pointer hover:underline"
                                      >
                                        <MapPin
                                          className="w-3 h-3"
                                          style={{ color: "#BC6C25" }}
                                        />
                                        <p
                                          className="text-xs"
                                          style={{ color: "#606C38" }}
                                        >
                                          {item.location.lat.toFixed(4)},{" "}
                                          {item.location.lon.toFixed(4)}
                                        </p>
                                      </a>
                                    ) : null}
                                  </>
                                );
                              } else {
                                return (
                                  <div className="text-center py-4">
                                    <AlertCircle
                                      className="w-8 h-8 mx-auto mb-2"
                                      style={{ color: "#DDA15E" }}
                                    />
                                    <p
                                      className="text-xs"
                                      style={{ color: "#606C38" }}
                                    >
                                      No location set
                                    </p>
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

            {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            {orders.length === 0 ? (
              <div
                className="rounded-xl p-12 text-center"
                style={{ backgroundColor: "#ffffff" }}
              >
                <Package
                  className="w-16 h-16 mx-auto mb-4"
                  style={{ color: "#DDA15E" }}
                />
                <h3 className="text-xl font-bold mb-2" style={{ color: "#283618" }}>
                  No Orders Yet
                </h3>
                <p className="mb-6" style={{ color: "#606C38" }}>
                  Start ordering delicious meals today!
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-3 rounded-lg font-semibold"
                  style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
                >
                  Browse Meals
                </button>
              </div>
            ) : (
              <div
                className="rounded-xl overflow-hidden"
                style={{ backgroundColor: "#ffffff", border: "1px solid #e5e5e5" }}
              >
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead style={{ backgroundColor: "#f9f9f9" }}>
                      <tr>
                        <th
                          className="text-left px-6 py-4 font-semibold text-sm"
                          style={{ color: "#606C38" }}
                        >
                          Order ID
                        </th>
                        <th
                          className="text-left px-6 py-4 font-semibold text-sm"
                          style={{ color: "#606C38" }}
                        >
                          Status
                        </th>
                        <th
                          className="text-left px-6 py-4 font-semibold text-sm"
                          style={{ color: "#606C38" }}
                        >
                          Total Amount
                        </th>
                        <th
                          className="text-right px-6 py-4 font-semibold text-sm"
                          style={{ color: "#606C38" }}
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr
                          key={order._id}
                          className="border-t"
                          style={{ borderColor: "#e5e5e5" }}
                        >
                          <td
                            className="px-6 py-4 text-sm font-medium"
                            style={{ color: "#283618" }}
                          >
                            {order._id?.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`font-semibold capitalize ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td
                            className="px-6 py-4 text-sm font-medium"
                            style={{ color: "#283618" }}
                          >
                            ₹{order.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() =>
                                  order._id &&
                                  router.push(`/order-details/${order._id}`)
                                }
                                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                                style={{
                                  backgroundColor: "#DDA15E",
                                  color: "#283618",
                                }}
                              >
                                View Details
                              </button>
                              {(order.status === "pending" ||
                                order.status === "confirmed") && (
                                <button
                                  onClick={() =>
                                    order._id && handleCancelOrder(order._id)
                                  }
                                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                                  style={{
                                    backgroundColor: "#BC6C25",
                                    color: "#FEFAE0",
                                  }}
                                  disabled={loading}
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile List */}
                <div className="md:hidden divide-y" style={{ borderColor: "#e5e5e5" }}>
                  {orders.map((order) => (
                    <div key={order._id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p
                            className="text-xs font-semibold mb-1"
                            style={{ color: "#999" }}
                          >
                            Order ID
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#283618" }}
                          >
                            {order._id?.substring(0, 8)}...
                          </p>
                        </div>
                        <span
                          className={`text-sm font-semibold capitalize ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div>
                        <p
                          className="text-xs font-semibold mb-1"
                          style={{ color: "#999" }}
                        >
                          Total Amount
                        </p>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#283618" }}
                        >
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() =>
                            order._id && router.push(`/order-details/${order._id}`)
                          }
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold"
                          style={{
                            backgroundColor: "#DDA15E",
                            color: "#283618",
                          }}
                        >
                          View Details
                        </button>
                        {(order.status === "pending" ||
                          order.status === "confirmed") && (
                          <button
                            onClick={() =>
                              order._id && handleCancelOrder(order._id)
                            }
                            className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold"
                            style={{
                              backgroundColor: "#BC6C25",
                              color: "#FEFAE0",
                            }}
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
