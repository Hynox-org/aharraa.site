"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  verifySession: (token?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    verifySession();
  }, []);

  const verifySession = async (token?:string) => {
    setIsLoading(true);
    const accessToken = token ? token : Cookies.get("x-access-token");

    if (!accessToken) {
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/verify", { access_token: accessToken });
      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser(response.data.user); // Assuming the verify endpoint returns user data
      } else {
        setIsAuthenticated(false);
        setUser(null);
        Cookies.remove("x-access-token");
        Cookies.remove("x-user-id");
      }
    } catch (error) {
      console.error("Session verification failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      Cookies.remove("x-access-token");
      Cookies.remove("x-user-id");
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/signin", { email, password });
      const accessToken = response.headers["x-access-token"] || response.headers["X-Access-Token"];
      const userId = response.headers["x-user-id"] || response.headers["X-User-Id"];

      if (accessToken && userId) {
        Cookies.set("x-access-token", accessToken, { expires: 7 });
        Cookies.set("x-user-id", userId, { expires: 7 });
        await verifySession(); // Re-verify session after successful sign-in
        router.push("/"); // Redirect to home or dashboard
      } else {
        throw new Error("Authentication failed: Missing access token or user ID in response."); // Throw an error
      }
    } catch (error) {
      console.error("Sign-in failed:", error);
      throw error; // Re-throw to allow UI to handle errors
    }
  };

  const signOut = () => {
    Cookies.remove("x-access-token");
    Cookies.remove("x-user-id");
    setIsAuthenticated(false);
    setUser(null);
    router.push("/auth"); // Redirect to sign-in page
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, signIn, signOut, verifySession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
