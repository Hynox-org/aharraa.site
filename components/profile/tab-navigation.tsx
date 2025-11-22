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
        className="inline-flex gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg min-w-full sm:min-w-0 justify-center bg-white border border-gray-100"
      >
        <button
          onClick={() => {
            setActiveTab("overview");
            setTabLoading(false);
          }}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === "overview" ? "shadow-md bg-[#3CB371] text-white" : "bg-transparent text-gray-700 hover:bg-gray-50"
          }`}
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Overview</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("orders");
            setTabLoading(true);
          }}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
            activeTab === "orders" ? "shadow-md bg-[#3CB371] text-white" : "bg-transparent text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Package className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Orders</span>
          {pendingOrders > 0 && (
            <span
              className="px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-500 text-white"
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
            activeTab === "addresses" ? "shadow-md bg-[#3CB371] text-white" : "bg-transparent text-gray-700 hover:bg-gray-50"
          }`}
        >
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Addresses</span>
        </button>
      </div>
    </div>
  );
}
