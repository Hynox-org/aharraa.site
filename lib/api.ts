export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { User, ValidateTokenResponse, CreateOrderPayload, Order } from "./types";

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: Record<string, unknown> | null = null,
  token: string | null = null,
): Promise<T> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const payload = body;

  try {
    console.log(" API Request:", {
      url: `${API_URL}${endpoint}`,
      method,
      headers,
      body: method !== "GET" ? payload : null,
    });

    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: method !== "GET" ? JSON.stringify(payload) : null,
    });

    let data: any = {};
    try {
      data = await res.json();
    } catch {
      console.warn("⚠️ Response not JSON or empty");
    }

    if (!res.ok) {
      console.error("❌ API Error:", res?.status, data);
      const cleanMessage =
        data?.message ||
        data?.error ||
        data?.supabaseError ||
        data?.details ||
        `Request failed with status ${res.status}`;
      throw new Error(cleanMessage);
    }

    console.log("✅ API Success:", data);
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

export async function validateToken(
  token: string
): Promise<ValidateTokenResponse> {
  return apiRequest<ValidateTokenResponse>(
    "/auth/verify",
    "POST",
    {token}
  );
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

export async function createOrder(
  payload: CreateOrderPayload,
  token: string
): Promise<Order> {
  const response = await apiRequest<any>(
    "/api/orders",
    "POST",
    payload as unknown as Record<string, unknown>,
    token
  );
  // Assuming the backend returns the order object directly or nested under an 'order' key
  if (response && response.order) {
    return response.order as Order;
  }
  return response as Order;
}

//createPayment
export async function createPayment(
  payload: CreateOrderPayload,
  token: string
): Promise<string> {
  const response = await apiRequest<any>(
    "/api/orders/payment",
    "POST",
    payload as unknown as Record<string, unknown>,
    token
  );
  // Assuming the backend returns the order object directly or nested under an 'order' key
  if (response && response.paymentSessionId) {
    return response.paymentSessionId as string;
  }
  return response.paymentSessionId as string;
}

export async function getOrderDetails(
  orderId: string,
  token: string
): Promise<Order> {
  const response = await apiRequest<any>(
    `/api/orders/details/${orderId}`,
    "GET",
    null,
    token
  );
  if (response && response.order) {
    return response.order as Order;
  }
  return response as Order;
}

export async function verifyPayment(
  orderId: string,
  token: string
): Promise<{ order: Order; cashfreeDetails?: any; message?: string }> {
  return apiRequest<{ order: Order; cashfreeDetails?: any; message?: string }>(
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
