import { UserProfile } from "@/lib/types";
import { User, Edit3, Save, X, Package, MapPin, CreditCard, ArrowRight } from "lucide-react";

interface GeneralTabProps {
  profile: UserProfile;
  formData: any;
  setFormData: any;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  loading: boolean;
  handleUpdateProfile: () => void;
  setActiveTab: (tab: "overview" | "orders" | "addresses") => void;
  router: any;
}

export function GeneralTab({
  profile,
  formData,
  setFormData,
  isEditing,
  setIsEditing,
  loading,
  handleUpdateProfile,
  setActiveTab,
  router,
}: GeneralTabProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Personal Information Card */}
      <div
        className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg sm:shadow-xl border"
        style={{ backgroundColor: "#ffffff", borderColor: "rgba(96, 108, 56, 0.1)" }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(96, 108, 56, 0.1)" }}
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#606C38" }} />
            </div>
            <h2
              className="text-xl sm:text-2xl font-bold"
              style={{ color: "#283618" }}
            >
              Personal Information
            </h2>
          </div>

          {/* Edit Controls */}
          <div className="flex gap-2 w-full sm:w-auto">
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
                  className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-all flex-1 sm:flex-none"
                  style={{
                    backgroundColor: "rgba(188, 108, 37, 0.1)",
                    color: "#BC6C25",
                  }}
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                </button>
                <button
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-sm flex-1 sm:flex-none"
                  style={{ backgroundColor: "#DDA15E", color: "#283618" }}
                >
                  <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>{loading ? "Saving..." : "Save"}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg text-sm w-full sm:w-auto"
                style={{ backgroundColor: "#DDA15E", color: "#283618" }}
              >
                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label
              className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3"
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2"
                style={{
                  border: "2px solid rgba(221, 161, 94, 0.3)",
                  color: "#283618",
                  backgroundColor: "#FEFAE0",
                }}
              />
            ) : (
              <div
                className="px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-sm font-semibold break-words"
                style={{
                  backgroundColor: "rgba(221, 161, 94, 0.08)",
                  color: "#283618",
                }}
              >
                {profile.fullName || <span style={{ color: "#999" }}>Not set</span>}
              </div>
            )}
          </div>

          <div>
            <label
              className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3"
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
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-2"
                style={{
                  border: "2px solid rgba(221, 161, 94, 0.3)",
                  color: "#283618",
                  backgroundColor: "#FEFAE0",
                }}
              />
            ) : (
              <div
                className="px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl text-sm font-semibold"
                style={{
                  backgroundColor: "rgba(221, 161, 94, 0.08)",
                  color: "#283618",
                }}
              >
                {profile.phoneNumber || <span style={{ color: "#999" }}>Not set</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <button
          onClick={() => setActiveTab("orders")}
          className="p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left group"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ backgroundColor: "rgba(96, 108, 56, 0.1)" }}
            >
              <Package className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: "#606C38" }} />
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#DDA15E" }} />
          </div>
          <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2" style={{ color: "#283618" }}>
            My Orders
          </h3>
          <p className="text-xs sm:text-sm" style={{ color: "#606C38" }}>
            View and track your orders
          </p>
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className="p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left group"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}
            >
              <MapPin className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: "#BC6C25" }} />
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#DDA15E" }} />
          </div>
          <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2" style={{ color: "#283618" }}>
            Delivery Addresses
          </h3>
          <p className="text-xs sm:text-sm" style={{ color: "#606C38" }}>
            Manage your delivery locations
          </p>
        </button>

        <button
          onClick={() => router.push("/pricing")}
          className="p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left group sm:col-span-2 lg:col-span-1"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ backgroundColor: "rgba(188, 108, 37, 0.1)" }}
            >
              <CreditCard className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: "#BC6C25" }} />
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "#DDA15E" }} />
          </div>
          <h3 className="text-base sm:text-lg font-bold mb-1.5 sm:mb-2" style={{ color: "#283618" }}>
            Browse Meals
          </h3>
          <p className="text-xs sm:text-sm" style={{ color: "#606C38" }}>
            Explore our delicious menu
          </p>
        </button>
      </div>
    </div>
  );
}
