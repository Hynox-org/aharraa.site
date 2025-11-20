import { User, Package, MapPin } from "lucide-react";

interface TabNavigationProps {
  activeTab: "overview" | "orders" | "addresses";
  setActiveTab: (tab: "overview" | "orders" | "addresses") => void;
  pendingOrders: number;
  setTabLoading: (loading: boolean) => void;
}

export function TabNavigation({
  activeTab,
  setActiveTab,
  pendingOrders,
  setTabLoading,
}: TabNavigationProps) {
  return (
    <div className="mb-6 sm:mb-8 overflow-x-auto">
      <div
        className="inline-flex gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg min-w-full sm:min-w-0"
        style={{ backgroundColor: "#ffffff" }}
      >
        <button
          onClick={() => {
            setActiveTab("overview");
            setTabLoading(false);
          }}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === "overview" ? "shadow-md" : ""
          }`}
          style={{
            backgroundColor: activeTab === "overview" ? "#606C38" : "transparent",
            color: activeTab === "overview" ? "#FEFAE0" : "#606C38",
          }}
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="">Overview</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("orders");
            setTabLoading(true);
          }}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === "orders" ? "shadow-md" : ""
          }`}
          style={{
            backgroundColor: activeTab === "orders" ? "#606C38" : "transparent",
            color: activeTab === "orders" ? "#FEFAE0" : "#606C38",
          }}
        >
          <Package className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="">Orders</span>
          {pendingOrders > 0 && (
            <span
              className="px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold"
              style={{ backgroundColor: "#DDA15E", color: "#283618" }}
            >
              {pendingOrders}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab("addresses");
            setTabLoading(false);
          }}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === "addresses" ? "shadow-md" : ""
          }`}
          style={{
            backgroundColor: activeTab === "addresses" ? "#606C38" : "transparent",
            color: activeTab === "addresses" ? "#FEFAE0" : "#606C38",
          }}
        >
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="">Addresses</span>
        </button>
      </div>
    </div>
  );
}
