"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { validateToken } from "@/lib/api";

interface User {
  id: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const login = async (token: string) => { // Make login function async
    localStorage.setItem("aharraa-u-token", token);
    setLoading(true);
    try {
      const response = await validateToken(token);
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      localStorage.removeItem("aharraa-u-token");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
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