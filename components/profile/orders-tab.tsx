import { Order } from "@/lib/types";
import {
  Package,
  Clock,
  CheckCircle2,
  X,
  AlertCircle,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { CancelConfirmationModal } from "@/components/cancel-confirmation-modal";

interface OrdersTabProps {
  orders: Order[];
  tabLoading: boolean;
  loading: boolean;
  handleCancelOrder: (orderId: string) => void;
  router: any;
}

export function OrdersTab({
  orders,
  tabLoading,
  loading,
  handleCancelOrder,
  router,
}: OrdersTabProps) {
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
        return <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case "confirmed":
        return <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case "delivered":
        return <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      case "cancelled":
        return <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
    }
  };

  if (tabLoading) {
    return (
      <div className="relative min-h-[300px] sm:min-h-[400px]">
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/70 rounded-2xl sm:rounded-3xl z-10">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-t-transparent rounded-full animate-spin mb-3"
            style={{ borderColor: "#606C38", borderTopColor: "transparent" }}
          ></div>
          <p className="text-sm sm:text-md font-semibold" style={{ color: "#283618" }}>
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        className="rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-lg sm:shadow-xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
          style={{ backgroundColor: "rgba(221, 161, 94, 0.1)" }}
        >
          <Package className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: "#DDA15E" }} />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3" style={{ color: "#283618" }}>
          No Orders Yet
        </h3>
        <p className="mb-6 sm:mb-8 text-base sm:text-lg" style={{ color: "#606C38" }}>
          Start your culinary journey with us today!
        </p>
        <button
          onClick={() => router.push("/pricing")}
          className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-sm sm:text-base"
          style={{ backgroundColor: "#606C38", color: "#FEFAE0" }}
        >
          Browse Meals
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all border"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "rgba(96, 108, 56, 0.1)",
          }}
        >
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Order Info */}
            <div className="flex-1">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(96, 108, 56, 0.1)" }}
                >
                  <Package className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#606C38" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h4
                      className="font-bold text-base sm:text-lg break-words"
                      style={{ color: "#283618" }}
                    >
                      Order #{order._id?.substring(0, 8).toUpperCase()}
                    </h4>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                        order.status
                      )} w-fit`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold mb-1.5 sm:mb-2" style={{ color: "#606C38" }}>
                    ₹{order.totalAmount.toFixed(2)}
                  </p>
                  {order.createdAt && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm" style={{ color: "#999" }}>
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() =>
                  order._id && router.push(`/order-details/${order._id}`)
                }
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                style={{
                  backgroundColor: "#DDA15E",
                  color: "#283618",
                }}
              >
                View Details
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              {(order.status === "pending" || order.status === "confirmed") && (
                <CancelConfirmationModal
                  onConfirm={() => order._id && handleCancelOrder(order._id)}
                >
                  <button
                    className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg w-full sm:w-auto"
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
  );
}
