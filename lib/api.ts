export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import {
  User,
  ValidateTokenResponse,
  CreatePaymentPayload,
  Order,
  UserProfile,
  Meal,
  Plan,
  Vendor,
  Cart,
  CartItem,
  PersonDetails,
  Menu,
  MenuWithPopulatedMeals // Changed from PopulatedMenu
} from "./types";


export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: Record<string, unknown> | null = null,
  token: string | null = null
): Promise<T> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const payload = body;

  try {
    console.log(" API Request:", {
      url: `${API_URL}${endpoint}`,
      method,
      headers,
      // payloadSent: payload, // Removed debugging log
      body: method !== "GET" && method !== "DELETE" ? JSON.stringify(payload) : null,
    });

    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: method !== "GET" && method !== "DELETE" ? JSON.stringify(payload) : null,
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      console.warn("⚠️ Response not JSON or empty");
    }

    if (!res.ok) {
      console.error("❌ API Error:", res?.status, data);
      if (res.status === 401) {
        // Redirect to auth page on 401 Unauthorized
        if (typeof window !== "undefined") {
          // Ensure this runs only in the browser
          window.location.href = "/auth";
        }
        throw new Error("Unauthorized: Redirecting to login.");
      }
      const cleanMessage =
        data?.message ||
        data?.error ||
        data?.supabaseError ||
        data?.details ||
        `Request failed with status ${res.status}`;
      throw new Error(cleanMessage);
    }

    return data as T;
  } catch (err: any) {
    console.error("🚨 apiRequest Catch:", err);
    if (err === "token not found") {
      localStorage.removeItem("aharraa-u-token");
      throw new Error("session expired Please log in again.");
    }

    throw new Error(err?.message || "Something went wrong");
  }
}

export async function pingServer(): Promise<{ ok: boolean; message: string }> {
  return apiRequest<{ ok: boolean; message: string }>("/", "GET");
}

export async function validateToken(
  token: string
): Promise<ValidateTokenResponse> {
  return apiRequest<ValidateTokenResponse>("/auth/verify", "POST", { token });
}

export async function oauthLogin(
  provider: string
): Promise<{ message: string; url: string }> {
  return apiRequest<{ message: string; url: string }>(
    `/auth/oauth/${provider}`,
    "GET",
    null,
    null
  );
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>("/auth/forgot-password", "POST", { email });
}

export async function resetPassword(
  newPassword: string,
  token: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    "/auth/reset-password",
    "POST",
    { newPassword },  // ✅ Only newPassword in body
    token             // ✅ Token as 4th parameter (becomes Authorization header)
  );
}

// export async function createOrder(
//   orderId: string,
//   token: string
// ): Promise<Order> {
//   const response = await apiRequest<any>(
//     "/api/orders",
//     "POST",
//     { orderId },
//     token
//   );
//   // Assuming the backend returns the order object directly or nested under an 'order' key
//   if (response && response.order) {
//     return response.order as Order;
//   }
//   return response as Order;
// }

//createPayment
export async function createOrder(
  payload: CreatePaymentPayload,
  token: string
): Promise<any> {
  const response = await apiRequest<any>(
    "/api/orders",
    "POST",
    payload as unknown as Record<string, unknown>,
    token
  );
  return response;
}

export async function getOrderDetails(
  orderId: string,
  token: string
): Promise<any> {
  const response = await apiRequest<any>(
    `/api/orders/details/${orderId}`,
    "GET",
    null,
    token
  );
  if (response && response.order) {
    return response.order as any;
  }
  return response as any;
}

export async function getProfileDetails(
  token: string
): Promise<UserProfile> {
  const response = await apiRequest<any>(
    `/api/users/profile`,
    "GET",
    null,
    token
  );
  console.log({ response })
  return response as UserProfile;
}

export async function updateProfileDetails(
  profileData: UserProfile,
  token: string
): Promise<UserProfile> {
  const response = await apiRequest<any>(
    "/api/users/profile",
    "PUT",
    profileData as unknown as Record<string, unknown>,
    token
  );
  return response as UserProfile;
}


export async function verifyPayment(
  orderId: string,
  token: string
): Promise<{ message?: string }> {
  return apiRequest<{ message?: string }>(
    `/api/orders/verify-payment/${orderId}`,
    "GET",
    null,
    token
  );
}

export async function sendOrderConfirmationEmail(
  orderId: string,
  userEmail: string,
  token: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    "/api/email/send-order-confirmation",
    "POST",
    { orderId, userEmail },
    token
  );
}

export async function getAllOrders(token: string): Promise<Order[]> {
  const response = await apiRequest<any>(
    "/api/orders",
    "GET",
    null,
    token
  );
  return response as Order[];
}

export async function updateOrder(
  orderId: string,
  updatePayload: Record<string, unknown>,
  token: string
): Promise<Order> {
  const response = await apiRequest<any>(
    `/api/orders/${orderId}`,
    "PUT",
    updatePayload,
    token
  );
  return response as Order;
}

export async function getPlans(): Promise<Plan[]> {
  return apiRequest<Plan[]>("/api/plans", "GET");
}

export async function getVendors(): Promise<Vendor[]> {
  return apiRequest<Vendor[]>("/api/vendors", "GET");
}

export async function getMenusByVendor(vendorId: string): Promise<Menu[]> {
  return apiRequest<Menu[]>(`/api/vendors/${vendorId}/menus`, "GET");
}

export async function getAllMenus(): Promise<MenuWithPopulatedMeals[]> {
  return apiRequest<MenuWithPopulatedMeals[]>("/api/menus", "GET");
}

export async function getVendorById(id: string): Promise<Vendor> {
  return apiRequest<Vendor>(`/api/vendors/${id}`, "GET");
}

export async function getCartItems(
  userId: string,
  token: string
): Promise<Cart> {
  return apiRequest<Cart>(`/api/cart/${userId}`, "GET", null, token);
}

// ➕ Add a new item to cart
export async function addToCartApi(
  userId: string,
  cartItem: {
    menuId: string; // Changed from mealId to menuId
    planId: string;
    quantity: number;
    startDate: string;
    personDetails?: PersonDetails[];
    selectedMealTimes?: string[]; // Add mealTimes
  },
  token: string
): Promise<Cart> {
  console.log("Adding to cart:", cartItem, "userId:", userId);
  const endpoint = `/api/cart/${userId}/add`;
  return apiRequest<Cart>(endpoint, "POST", cartItem, token);
}
export async function clearCart(userId: string, token: string) {
  return apiRequest(`/api/cart/${userId}/clear`, "DELETE", null, token);
}
export async function removeFromCart(userId: string, cartItemId: string, token: string) {
  return apiRequest(`/api/cart/${userId}/remove/${cartItemId}`, "DELETE", null, token);
}
export async function updateCartItemQuantity(
  userId: string,
  cartItemId: string,
  quantity: number,
  token: string
): Promise<Cart> {
  return apiRequest<Cart>(`/api/cart/${userId}/update-quantity/${cartItemId}`, "PUT", { quantity }, token);
}
export async function updateCartItemPersonDetails(
  userId: string,
  cartItemId: string,
  personDetails: PersonDetails[],
  token: string
): Promise<Cart> {
  return apiRequest<Cart>(`/api/cart/${userId}/update-person-details/${cartItemId}`, "PUT", { personDetails }, token);
}

export async function getCartTotalQuantity(
  userId: string,
  token: string
): Promise<{ totalItems: number }> {
  return apiRequest<{ totalItems: number }>(`/api/cart/${userId}/quantity`, "GET", null, token);
}
