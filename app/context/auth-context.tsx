"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation"; // Import useRouter and usePathname
import { validateToken } from "@/lib/api";

interface User {
  id: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, returnUrl?: string) => void; // Update login function signature
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // New state to track active login process
  const router = useRouter(); // Initialize useRouter
  const pathname = usePathname(); // Initialize usePathname

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("aharraa-u-token");
      if (token) {
        try {
          const response = await validateToken(token);
          setUser(response.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("aharraa-u-token");
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    // Only redirect if authenticated, on /auth, and not currently in a login process
    if (isAuthenticated && pathname === "/auth" && !isLoggingIn) {
      router.push("/"); // If already authenticated and on /auth, redirect to home page
    }
  }, [isAuthenticated, pathname, router, isLoggingIn]);

  const login = async (token: string, returnUrl?: string) => { // Make login function async and accept returnUrl
    localStorage.setItem("aharraa-u-token", token);
    setLoading(true);
    setIsLoggingIn(true); // Set isLoggingIn to true at the start of login
    try {
      const response = await validateToken(token);
      setUser(response.user);
      setIsAuthenticated(true);
      setLoading(false); // Set loading to false before redirection
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push("/"); // Default redirect to home page
      }
    } catch (error) {
      console.error("Login failed:", error);
      localStorage.removeItem("aharraa-u-token");
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false); // Also set loading to false on error
    } finally {
      setIsLoggingIn(false); // Always set isLoggingIn to false at the end
    }
  };

  const logout = () => {
    localStorage.removeItem("aharraa-u-token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
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
