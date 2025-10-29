export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface User {
  id: string;
  role: string;
}

interface ValidateTokenResponse {
  message: string;
  user: User;
}

export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: Record<string, unknown> | null = null,
  token: string | null = null,
  name: string | null = null
): Promise<T> {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const payload =
    body && Object.keys(body).length > 0 ? { ...body, name } : { name };

  try {
    console.log(" API Request:", {
      url: `${API_URL}${endpoint}`,
      method,
      headers,
      body: method !== "GET" ? payload : name,
    });

    const res = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: method !== "GET" ? JSON.stringify(payload) : name,
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
