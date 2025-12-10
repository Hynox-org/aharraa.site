import { UserProfile } from "@/lib/types";
import { Mail, Phone, Package, CheckCircle2, Clock, TrendingUp, Award } from "lucide-react";

interface ProfileHeaderProps {
  profile: UserProfile;
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  totalSpent: number;
}

export function ProfileHeader({
  profile,
  totalOrders,
  deliveredOrders,
  pendingOrders,
  totalSpent,
}: ProfileHeaderProps) {
  return (
    <div
      className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl mb-6 sm:mb-8 bg-gradient-to-br from-black to-gray-900"
    >
      <div className="relative p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6 lg:gap-8">
          {/* Profile Avatar & Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 flex-1 w-full">
            <div className="relative group">
              <div
                className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl font-bold shadow-xl sm:shadow-2xl transform transition-transform group-hover:scale-105 bg-[#3CB371] text-white"
              >
                <div className="...">
                  {(profile.fullName?.charAt(0) || profile.email?.charAt(0) || 'U').toUpperCase()}
                </div>

              </div>
              <div
                className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md sm:shadow-lg bg-[#3CB371]"
              >
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>

            <div className="text-center sm:text-left flex-1 w-full">
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 break-words text-white"
              >
                {profile.fullName || profile.name || "User"}
              </h1>

              <div className="flex flex-col gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-gray-300" />
                  <span
                    className="text-xs sm:text-sm break-all text-gray-300"
                  >
                    {profile.email}
                  </span>
                </div>
                {profile.phoneNumber && (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-gray-300" />
                    <span
                      className="text-xs sm:text-sm text-gray-300"
                    >
                      {profile.phoneNumber}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid - Responsive */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full lg:w-auto">
            <div
              className="rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 backdrop-blur-sm bg-white/10"
            >
              <Package className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mb-1.5 sm:mb-2 text-[#3CB371]" />
              <p
                className="text-lg sm:text-xl lg:text-2xl font-bold mb-0.5 sm:mb-1 text-white"
              >
                {totalOrders}
              </p>
              <p
                className="text-[10px] sm:text-xs font-medium text-gray-300"
              >
                Total Orders
              </p>
            </div>

            <div
              className="rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 backdrop-blur-sm bg-white/10"
            >
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mb-1.5 sm:mb-2 text-[#3CB371]" />
              <p
                className="text-lg sm:text-xl lg:text-2xl font-bold mb-0.5 sm:mb-1 text-white"
              >
                {deliveredOrders}
              </p>
              <p
                className="text-[10px] sm:text-xs font-medium text-gray-300"
              >
                Delivered
              </p>
            </div>

            <div
              className="rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 backdrop-blur-sm bg-white/10"
            >
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mb-1.5 sm:mb-2 text-[#3CB371]" />
              <p
                className="text-lg sm:text-xl lg:text-2xl font-bold mb-0.5 sm:mb-1 text-white"
              >
                {pendingOrders}
              </p>
              <p
                className="text-[10px] sm:text-xs font-medium text-gray-300"
              >
                Active
              </p>
            </div>

            <div
              className="rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 backdrop-blur-sm bg-white/10"
            >
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mb-1.5 sm:mb-2 text-[#3CB371]" />
              <p
                className="text-lg sm:text-xl lg:text-2xl font-bold mb-0.5 sm:mb-1 text-white"
              >
                ₹{totalSpent.toFixed(0)}
              </p>
              <p
                className="text-[10px] sm:text-xs font-medium text-gray-300"
              >
                Total Spent
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
