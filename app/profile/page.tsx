"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/auth-context";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { toast } from "sonner";
import {
  getProfileDetails,
  updateProfileDetails,
  getAllOrders,
  updateOrder,
} from "@/lib/api";
import { UserProfile, Order } from "@/lib/types";
import { User, Package, MapPin, AlertCircle } from "lucide-react";

// Import tab components
import { GeneralTab } from "@/components/profile/general-tab";
import { OrdersTab } from "@/components/profile/orders-tab";
import { AddressesTab } from "@/components/profile/addresses-tab";
import { ProfileHeader } from "@/components/profile/profile-header";
import { TabNavigation } from "@/components/profile/tab-navigation";
import LottieAnimation from "@/components/lottie-animation";
import ItayCheffAnimation from "../../public/lottie/ItayCheff.json";

export default function ProfilePage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses">("overview");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCancellingOrderId, setIsCancellingOrderId] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
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
      fetchOrders(token);
      fetchUserProfile(token);
    }
  }, [user, token, authLoading, router]);

  useEffect(() => {
    if (activeTab === "orders" && token) {
      fetchOrders(token);
    }
  }, [activeTab, token]);

  const fetchOrders = async (token: string) => {
    setTabLoading(true);
    try {
      const data = await getAllOrders(token);
      setOrders(data);
    } catch (error: any) {
      toast.error(`Failed to fetch orders: ${error.message}`);
    } finally {
      setTabLoading(false);
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

    setIsCancellingOrderId(orderId);
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
      setIsCancellingOrderId(null);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        router.push("/auth");
        setIsUpdatingProfile(false);
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
      setIsUpdatingProfile(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LottieAnimation animationData={ItayCheffAnimation} style={{ width: 200, height: 200 }} />
      </div>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 text-red-500"
            />
            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-black">
              Profile Not Found
            </h2>
            <p className="mb-6 text-sm sm:text-base text-gray-600">
              We couldn't load your profile data. Please try logging in again.
            </p>
            <button
              onClick={() => router.push("/auth")}
              className="px-6 py-3 rounded-lg font-semibold text-sm sm:text-base bg-[#3CB371] hover:bg-[#2FA05E] text-white transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "confirmed"
  ).length;
  const totalSpent = orders
    .filter((o) => o.status === "confirmed" || o.status === "delivered")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Profile Header */}
        <ProfileHeader
          profile={profile}
          totalOrders={totalOrders}
          deliveredOrders={deliveredOrders}
          pendingOrders={pendingOrders}
          totalSpent={totalSpent}
        />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingOrders={pendingOrders}
          setTabLoading={setTabLoading}
        />

        {/* Tab Content */}
        {activeTab === "overview" && (
          <GeneralTab
            profile={profile}
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            loading={loading}
            handleUpdateProfile={handleUpdateProfile}
            isUpdatingProfile={isUpdatingProfile}
            setActiveTab={setActiveTab}
            router={router}
          />
        )}

        {activeTab === "orders" && (
          <OrdersTab
            orders={orders}
            tabLoading={tabLoading}
            loading={loading}
            handleCancelOrder={handleCancelOrder}
            isCancellingOrderId={isCancellingOrderId}
            router={router}
          />
        )}

        {activeTab === "addresses" && (
          <AddressesTab
            profile={profile}
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            loading={loading}
            handleUpdateProfile={handleUpdateProfile}
            isUpdatingProfile={isUpdatingProfile}
          />
        )}
      </div>

      <Footer />
    </main>
  );
}
