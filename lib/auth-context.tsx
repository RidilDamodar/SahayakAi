"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  name: string;
  email: string;
  businessType?: string;
  category?: string;
  gender?: string;
  state?: string;
  district?: string;
  city?: string;
  pincode?: string;
  annualTurnover?: string;
  loanAmountNeeded?: string;
  socialCategory?: string;
  businessStage?: string;
  loanPurpose?: string;
  annualFamilyIncome?: string;
  dob?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (data: { name: string; email: string; businessType?: string; state?: string; dob?: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileData: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load session from localStorage on initial render
    const storedUser = localStorage.getItem("sahayak_user_session");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulating authentication (or connecting to Supabase/backend)
    const mockUser: UserProfile = {
      name: email.split("@")[0].toUpperCase() || "Sahayak User",
      email,
      businessType: "Micro Enterprise",
      category: "Manufacturing & Handicraft",
      gender: "Female",
      state: "Maharashtra",
      annualTurnover: "₹5,00,000",
      loanAmountNeeded: "₹3,00,000",
      socialCategory: "OBC / Minorities",
    };

    localStorage.setItem("sahayak_user_session", JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
    return true;
  };

  const signup = async (data: { name: string; email: string; businessType?: string; state?: string; dob?: string }): Promise<boolean> => {
    setIsLoading(true);
    const newUser: UserProfile = {
      name: data.name,
      email: data.email,
      businessType: data.businessType || "Micro Enterprise",
      state: data.state || "Maharashtra",
      dob: data.dob,
      annualTurnover: "₹5,00,000",
      loanAmountNeeded: "₹3,00,000",
    };

    localStorage.setItem("sahayak_user_session", JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    localStorage.removeItem("sahayak_user_session");
    setUser(null);
  };

  const updateProfile = (profileData: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...profileData };
      localStorage.setItem("sahayak_user_session", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
