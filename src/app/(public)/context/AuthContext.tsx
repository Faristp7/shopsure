"use client";
import { createContext, useContext, useState, ReactNode } from "react";

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

  const login = (email: string, _password: string) => {
    setUser({ name: "John Doe", email, phone: "+1 234 567 8900", avatar: "" });
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const signup = (name: string, email: string, _password: string) => {
    setUser({ name, email, phone: "", avatar: "" });
    setIsLoggedIn(true);
    setShowSignup(false);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
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
