import { UserProfile } from "@/lib/types";
import {
  Sun,
  Sunset,
  Moon,
  Edit3,
  Save,
  MapPinned,
  AlertCircle,
  Navigation,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddressesTabProps {
  profile: UserProfile;
  formData: any;
  setFormData: any;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  loading: boolean;
  handleUpdateProfile: () => void;
}

export function AddressesTab({
  profile,
  formData,
  setFormData,
  isEditing,
  setIsEditing,
  loading,
  handleUpdateProfile,
}: AddressesTabProps) {
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const handleLocationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    locationType:
      | "breakfastDeliveryLocation"
      | "lunchDeliveryLocation"
      | "dinnerDeliveryLocation"
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
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
    setFetchingLocation(true);
    try {
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser.");
        setFetchingLocation(false);
        return;
      }

      toast.info("Fetching GPS location...");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev: any) => ({
            ...prev,
            [locationType]: {
              ...prev[locationType],
              lat: latitude,
              lon: longitude,
            },
          }));
          toast.success("GPS location fetched successfully!");
          setFetchingLocation(false);
        },
        (error) => {
          toast.error(`Failed to fetch GPS location: ${error.message}`);
          setFetchingLocation(false);
        }
      );
    } catch (error: any) {
      toast.error(`Failed to fetch GPS location: ${error.message}`);
      setFetchingLocation(false);
    }
  };

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
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "#283618" }}>
          Delivery Locations
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all w-full sm:w-auto justify-center"
            style={{ backgroundColor: "#DDA15E", color: "#283618" }}
          >
            <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Edit All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
              className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg sm:shadow-xl border transition-all hover:shadow-2xl"
              style={{ borderColor: "rgba(96, 108, 56, 0.1)" }}
            >
              {/* Header with Gradient */}
              <div className={`p-4 sm:p-6 bg-gradient-to-br ${item.gradient}`}>
                <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center ${item.iconBg}`}
                  >
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${item.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-xl sm:text-2xl text-white">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-white/80">
                  Default delivery location for {item.title.toLowerCase()}
                </p>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6" style={{ backgroundColor: "#ffffff" }}>
                {isEditing ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label
                        className="block text-xs font-semibold mb-1.5 sm:mb-2"
                        style={{ color: "#606C38" }}
                      >
                        Street Address
                      </label>
                      <input
                        name="street"
                        placeholder="123 Main Street"
                        value={formData[item.formKey]?.street || ""}
                        onChange={(e) => handleLocationChange(e, item.formKey)}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all focus:outline-none focus:ring-2"
                        style={{
                          border: "2px solid rgba(221, 161, 94, 0.3)",
                          color: "#283618",
                          backgroundColor: "#FEFAE0",
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label
                          className="block text-xs font-semibold mb-1.5 sm:mb-2"
                          style={{ color: "#606C38" }}
                        >
                          State
                        </label>
                        <input
                          name="state"
                          placeholder="Maharashtra"
                          value={formData[item.formKey]?.state || ""}
                          onChange={(e) => handleLocationChange(e, item.formKey)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all focus:outline-none focus:ring-2"
                          style={{
                            border: "2px solid rgba(221, 161, 94, 0.3)",
                            color: "#283618",
                            backgroundColor: "#FEFAE0",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-semibold mb-1.5 sm:mb-2"
                          style={{ color: "#606C38" }}
                        >
                          Pincode
                        </label>
                        <input
                          name="pincode"
                          placeholder="400001"
                          value={formData[item.formKey]?.pincode || ""}
                          onChange={(e) => handleLocationChange(e, item.formKey)}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all focus:outline-none focus:ring-2"
                          style={{
                            border: "2px solid rgba(221, 161, 94, 0.3)",
                            color: "#283618",
                            backgroundColor: "#FEFAE0",
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label
                          className="block text-xs font-semibold mb-1.5 sm:mb-2"
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
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all focus:outline-none focus:ring-2"
                          style={{
                            border: "2px solid rgba(221, 161, 94, 0.3)",
                            color: "#283618",
                            backgroundColor: "#FEFAE0",
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-xs font-semibold mb-1.5 sm:mb-2"
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
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all focus:outline-none focus:ring-2"
                          style={{
                            border: "2px solid rgba(221, 161, 94, 0.3)",
                            color: "#283618",
                            backgroundColor: "#FEFAE0",
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFetchGPSLocation(item.formKey)}
                      disabled={fetchingLocation}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                      style={{
                        backgroundColor: "#606C38",
                        color: "#FEFAE0",
                      }}
                    >
                      <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {fetchingLocation ? "Fetching..." : "Fetch My Location"}
                    </button>
                  </div>
                ) : (
                  <div>
                    {hasLocation ? (
                      <div className="space-y-3 sm:space-y-4">
                        {item.location?.street && (
                          <div>
                            <p
                              className="text-[10px] sm:text-xs font-semibold mb-1"
                              style={{ color: "#999" }}
                            >
                              ADDRESS
                            </p>
                            <p
                              className="text-xs sm:text-sm font-semibold break-words"
                              style={{ color: "#283618" }}
                            >
                              {item.location.street}
                            </p>
                          </div>
                        )}

                        {(item.location?.state || item.location?.pincode) && (
                          <div>
                            <p
                              className="text-[10px] sm:text-xs font-semibold mb-1"
                              style={{ color: "#999" }}
                            >
                              LOCATION
                            </p>
                            <p
                              className="text-xs sm:text-sm font-semibold"
                              style={{ color: "#283618" }}
                            >
                              {item.location.state}
                              {item.location.state && item.location.pincode && " - "}
                              {item.location.pincode}
                            </p>
                          </div>
                        )}

                        {item.location?.lat !== 0 && item.location?.lat !== undefined && (
                          <div>
                            <p
                              className="text-[10px] sm:text-xs font-semibold mb-2"
                              style={{ color: "#999" }}
                            >
                              COORDINATES
                            </p>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${item.location.lat},${item.location.lon}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all hover:shadow-md"
                              style={{
                                backgroundColor: "rgba(96, 108, 56, 0.1)",
                                color: "#606C38",
                              }}
                            >
                              <MapPinned className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              View on Map
                            </a>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <AlertCircle
                          className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3"
                          style={{ color: "#DDA15E" }}
                        />
                        <p
                          className="text-xs sm:text-sm font-semibold mb-1"
                          style={{ color: "#283618" }}
                        >
                          No address set
                        </p>
                        <p className="text-[10px] sm:text-xs" style={{ color: "#999" }}>
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
        <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
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
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-sm w-full sm:w-auto"
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
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
            style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            {loading ? "Saving..." : "Save All Addresses"}
          </button>
        </div>
      )}
    </div>
  );
}
