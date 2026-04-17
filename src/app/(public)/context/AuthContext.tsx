"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { apiService } from "@/services/api";
import { toast } from "sonner";

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserProfile | null;
  addresses: Address[];
  wishlist: string[];
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  toggleWishlist: (productId: string) => void;
  showLogin: boolean;
  setShowLogin: (v: boolean) => void;
  showSignup: boolean;
  setShowSignup: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADDRESSES_KEY = "shopsure_addresses";

function loadAddresses(): Address[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ADDRESSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAddresses(addresses: Address[]) {
  try {
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
  } catch {}
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const hasToken = document.cookie.includes("accessToken=");
    const storedUser = localStorage.getItem("auth_user");
    if (hasToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
        setAddresses(loadAddresses());
      } catch {}
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.post<{
        user: { id: string; fullName: string; email: string; phone: string | null };
        accessToken: string;
        refreshToken: string;
      }>("v1/auth/login", { email, password });

      setCookie("accessToken", response.accessToken, 86400);
      setCookie("refreshToken", response.refreshToken, 604800);

      const userProfile: UserProfile = {
        id: response.user.id,
        name: response.user.fullName ?? "",
        email: response.user.email ?? "",
        phone: response.user.phone ?? "",
        avatar: "",
      };

      localStorage.setItem("auth_user", JSON.stringify(userProfile));
      setUser(userProfile);
      setIsLoggedIn(true);
      setAddresses(loadAddresses());
      setShowLogin(false);
      return true;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Login failed. Please check your credentials.";
      toast.error(msg);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await apiService.post("v1/auth/register/buyer", { fullName: name, email, password });
      setShowSignup(false);
      return login(email, password);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Registration failed. Please try again.";
      toast.error(msg);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiService.post("v1/auth/logout");
    } catch {}
    clearCookie("accessToken");
    clearCookie("refreshToken");
    localStorage.removeItem("auth_user");
    setUser(null);
    setIsLoggedIn(false);
    setAddresses([]);
    toast.info("Logged out successfully");
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...profile };
      setUser(updated);
      localStorage.setItem("auth_user", JSON.stringify(updated));
    }
  };

  const addAddress = (address: Omit<Address, "id">) => {
    const newAddr = { ...address, id: Date.now().toString() };
    setAddresses((prev) => {
      const updated = address.isDefault
        ? [...prev.map((a) => ({ ...a, isDefault: false })), newAddr]
        : [...prev, newAddr];
      saveAddresses(updated);
      return updated;
    });
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setAddresses((prev) => {
      let updated = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
      if (updates.isDefault) updated = updated.map((a) => ({ ...a, isDefault: a.id === id }));
      saveAddresses(updated);
      return updated;
    });
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      saveAddresses(updated);
      return updated;
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        addresses,
        wishlist,
        login,
        signup,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        toggleWishlist,
        showLogin,
        setShowLogin,
        showSignup,
        setShowSignup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
