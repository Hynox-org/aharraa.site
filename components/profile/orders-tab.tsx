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
import { Spinner } from "../ui/spinner";
import LottieAnimation from "../lottie-animation";
import ItayCheffAnimation from "../../public/lottie/ItayCheff.json";

interface OrdersTabProps {
  orders: Order[];
  tabLoading: boolean;
  loading: boolean;
  handleCancelOrder: (orderId: string) => void;
  isCancellingOrder: boolean;
  router: any;
}

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  failed: "bg-rose-100 text-rose-700 border-rose-200",
  default: "bg-gray-100 text-gray-700 border-gray-200",
} as const;

const statusIcons = {
  pending: <Clock className="w-4 h-4" aria-label="Pending" />,
  confirmed: <CheckCircle2 className="w-4 h-4" aria-label="Confirmed" />,
  delivered: <Package className="w-4 h-4" aria-label="Delivered" />,
  cancelled: <X className="w-4 h-4" aria-label="Cancelled" />,
  failed: <AlertCircle className="w-4 h-4" aria-label="Failed" />,
  default: <AlertCircle className="w-4 h-4" aria-label="Unknown status" />,
};

type OrderStatus = keyof typeof statusStyles;

function StatusBadge({ status }: { status: OrderStatus }) {
  const style = statusStyles[status] ?? statusStyles.default;
  const icon = statusIcons[status] ?? statusIcons.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border w-fit select-none ${style}`}
      aria-live="polite"
      aria-atomic="true"
      aria-label={`Order status: ${
        status.charAt(0).toUpperCase() + status.slice(1)
      }`}
    >
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function EmptyOrders({ router }: { router: any }) {
  return (
    <div
      className="rounded-2xl p-8 sm:p-12 lg:p-16 text-center shadow-lg sm:shadow-xl bg-white border border-gray-100"
      role="region"
      aria-live="polite"
    >
      <div
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-gray-100"
      >
        <Package className="w-12 h-12 text-gray-600" />
      </div>
      <h3 className="text-2xl font-bold mb-3 text-black">
        No Orders Yet
      </h3>
      <p className="mb-8 text-lg text-gray-600">
        Start your culinary journey with us today!
      </p>
      <button
        onClick={() => router.push("/pricing")}
        className="px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-0.5 text-base bg-[#3CB371] hover:bg-[#2FA05E] text-white"
        aria-label="Browse meals"
      >
        Browse Meals
      </button>
    </div>
  );
}

function OrderItem({
  order,
  handleCancelOrder,
  isCancellingOrder,
  router,
}: {
  order: Order;
  handleCancelOrder: (orderId: string) => void;
  isCancellingOrder: boolean;
  router: any;
}) {
  return (
    <div
      className="rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-200 bg-white transition-all"
      role="article"
      aria-labelledby={`order-${order._id}`}
      tabIndex={0}
    >
      <div className="flex flex-wrap gap-6">
        <section className="flex-1 min-w-0">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-100"
              aria-hidden="true"
            >
              <Package className="w-6 h-6 text-gray-700" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap w-full">
              <h4
                id={`order-${order._id}`}
                className="font-bold text-lg break-words text-black"
              >
                Order #{order._id?.substring(0, 8).toUpperCase()}
              </h4>
              <StatusBadge status={order.status as OrderStatus} />
            </div>
          </div>

          <p className="text-2xl font-bold mb-3 text-black">
            ₹{order.totalAmount.toFixed(2)}
          </p>

          {order.createdAt && (
            <div
              className="flex items-center gap-2 text-sm text-gray-500"
              aria-label="Order date"
            >
              <Calendar className="w-4 h-4" />
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          )}
        </section>

        <section className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto items-center justify-end">
          <button
            onClick={() =>
              order._id && router.push(`/order-details/${order._id}`)
            }
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg text-sm bg-[#3CB371] hover:bg-[#2FA05E] text-white transition"
            aria-label={`View details for order ${order._id?.substring(0, 8)}`}
          >
            View Details <ArrowRight className="w-4 h-4" />
          </button>

          {(order.status === "pending" || order.status === "confirmed") && (
            <CancelConfirmationModal
              onConfirm={() => order._id && handleCancelOrder(order._id)}
              isCancellingOrder={isCancellingOrder}
            >
              <button
                className="px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg w-full sm:w-auto text-sm transition bg-red-50 hover:bg-red-100 text-red-600"
                disabled={isCancellingOrder}
                aria-disabled={isCancellingOrder}
                aria-busy={isCancellingOrder}
              >
                {isCancellingOrder ? (
                  <Spinner className="w-5 h-5 text-red-600 mx-auto" />
                ) : (
                  "Cancel Order"
                )}
              </button>
            </CancelConfirmationModal>
          )}
        </section>
      </div>
    </div>
  );
}

export function OrdersTab({
  orders,
  tabLoading,
  loading,
  handleCancelOrder,
  isCancellingOrder,
  router,
}: OrdersTabProps) {
  if (tabLoading) {
    return (
      <div className="relative min-h-[300px] sm:min-h-[400px] flex justify-center items-center">
        <LottieAnimation
          animationData={ItayCheffAnimation}
          style={{ width: 200, height: 200 }}
          aria-label="Loading animation"
        />
      </div>
    );
  }

  if (orders.length === 0) {
    return <EmptyOrders router={router} />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderItem
          key={order._id}
          order={order}
          handleCancelOrder={handleCancelOrder}
          isCancellingOrder={isCancellingOrder}
          router={router}
        />
      ))}
    </div>
  );
}
