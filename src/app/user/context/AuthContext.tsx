"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
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
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
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

const mockAddresses: Address[] = [
  { id: "1", label: "Home", name: "John Doe", phone: "+1 234 567 8900", street: "123 Main Street, Apt 4B", city: "New York", state: "NY", zip: "10001", isDefault: true },
  { id: "2", label: "Office", name: "John Doe", phone: "+1 234 567 8901", street: "456 Business Ave, Floor 12", city: "New York", state: "NY", zip: "10018", isDefault: false },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // Check for stored token on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/v1/auth/login`, {
        authMethod: "PASSWORD",
        identifier: email,
        password,
      });

      const { accessToken, user: userData } = response.data;
      localStorage.setItem("auth_token", accessToken);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      
      setUser(userData);
      setIsLoggedIn(true);
      setShowLogin(false);
      toast.success("Welcome back!");
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(message);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/v1/auth/register/buyer`, {
        fullName: name,
        email,
        password,
      });

      // After registration, the backend returns the user object but usually not the tokens yet.
      // Some backends auto-login. Assuming we might need to manually call login or if the backend returns tokens:
      // Looking at AuthService, register returns { user }. We should probably auto-login if possible or just show login modal.
      // However, most modern apps auto-login. Let's check AuthService.register again.
      // Register returns { user }. It DOES NOT return tokens.
      // So let's auto-login by calling the login function.
      
      toast.success("Account created successfully!");
      await login(email, password);
      setShowSignup(false);
    } catch (error: any) {
      console.log(error,'error');
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setUser(null);
    setIsLoggedIn(false);
    toast.info("Logged out successfully");
  };

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (user) setUser({ ...user, ...profile });
  };

  const addAddress = (address: Omit<Address, "id">) => {
    const newAddr = { ...address, id: Date.now().toString() };
    if (newAddr.isDefault) {
      setAddresses((prev) => [...prev.map((a) => ({ ...a, isDefault: false })), newAddr]);
    } else {
      setAddresses((prev) => [...prev, newAddr]);
    }
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setAddresses((prev) => {
      let updated = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
      if (updates.isDefault) updated = updated.map((a) => ({ ...a, isDefault: a.id === id }));
      return updated;
    });
  };

  const deleteAddress = (id: string) => setAddresses((prev) => prev.filter((a) => a.id !== id));

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, addresses, wishlist, login, signup, logout, updateProfile, addAddress, updateAddress, deleteAddress, toggleWishlist, showLogin, setShowLogin, showSignup, setShowSignup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
