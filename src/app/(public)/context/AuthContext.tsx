"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  country: string;
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
  isInitialized: boolean;
  user: UserProfile | null;
  addresses: Address[];
  wishlist: string[];
  login: (email: string, password: string) => Promise<{ success: boolean; otpRequired?: boolean; email?: string; otp?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; otpRequired?: boolean; email?: string; otp?: string }>;
  verifyLoginOtp: (email: string, otp: string) => Promise<boolean>;
  verifyRegisterOtp: (email: string, otp: string) => Promise<boolean>;
  resendLoginOtp: (email: string) => Promise<{ success: boolean; otp?: string }>;
  resendRegisterOtp: (email: string) => Promise<{ success: boolean; otp?: string }>;
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

function loadAddresses(userId: string | undefined): Address[] {
  if (typeof window === "undefined" || !userId) return [];
  try {
    const raw = localStorage.getItem(`shopsure_addresses_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAddresses(addresses: Address[], userId: string | undefined) {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.setItem(`shopsure_addresses_${userId}`, JSON.stringify(addresses));
  } catch {}
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    // Restore session from the readable accessToken cookie + localStorage user profile.
    const hasToken = document.cookie.includes("accessToken=");
    const storedUser = localStorage.getItem("auth_user");
    if (hasToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
        setAddresses(loadAddresses(parsedUser.id));
      } catch {}
    }
    setIsInitialized(true);
  }, []);

  // Post-login redirect logic
  useEffect(() => {
    if (isLoggedIn) {
      const redirectTarget = localStorage.getItem("auth_redirect");
      if (redirectTarget) {
        localStorage.removeItem("auth_redirect");
        router.push(redirectTarget);
      }
    }
  }, [isLoggedIn, router]);

  const login = async (email: string, password: string): Promise<{ success: boolean; otpRequired?: boolean; email?: string; otp?: string }> => {
    try {
      const response = await apiService.post<{
        otpRequired?: boolean;
        email?: string;
        otp?: string;
        user?: { id: string; fullName: string; email: string; phone: string | null };
        accessToken?: string;
      }>("v1/auth/login", { email, password });

      if (response.otpRequired) {
        return { success: true, otpRequired: true, email: response.email, otp: response.otp };
      }

      if (response.user && response.accessToken) {
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
        setAddresses(loadAddresses(userProfile.id));
        setShowLogin(false);
      }
      return { success: true };
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Login failed. Please check your credentials.";
      toast.error(msg);
      return { success: false };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; otpRequired?: boolean; email?: string; otp?: string }> => {
    try {
      const response = await apiService.post<{
        otpRequired?: boolean;
        email?: string;
        otp?: string;
      }>("v1/auth/register/buyer", { fullName: name, email, password });

      if (response.otpRequired) {
        return { success: true, otpRequired: true, email: response.email, otp: response.otp };
      }

      return { success: true };
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Registration failed. Please try again.";
      toast.error(msg);
      return { success: false };
    }
  };

  const verifyLoginOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      const response = await apiService.post<{
        user: { id: string; fullName: string; email: string; phone: string | null };
        accessToken: string;
      }>("v1/auth/login/verify-otp", { email, otp });

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
      setAddresses(loadAddresses(userProfile.id));
      setShowLogin(false);
      toast.success("Successfully signed in!");
      return true;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Verification failed. Please try again.";
      toast.error(msg);
      return false;
    }
  };

  const verifyRegisterOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      const response = await apiService.post<{
        user: { id: string; fullName: string; email: string; phone: string | null };
        accessToken: string;
      }>("v1/auth/register/verify-otp", { email, otp });

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
      setAddresses(loadAddresses(userProfile.id));
      setShowSignup(false);
      toast.success("Account created successfully!");
      return true;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Verification failed. Please try again.";
      toast.error(msg);
      return false;
    }
  };

  const resendLoginOtp = async (email: string): Promise<{ success: boolean; otp?: string }> => {
    try {
      const response = await apiService.post<{
        success: boolean;
        otp?: string;
      }>("v1/auth/login/resend-otp", { email });
      toast.success("OTP resent to your email.");
      return { success: true, otp: response.otp };
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to resend OTP. Please try again.";
      toast.error(msg);
      return { success: false };
    }
  };

  const resendRegisterOtp = async (email: string): Promise<{ success: boolean; otp?: string }> => {
    try {
      const response = await apiService.post<{
        success: boolean;
        otp?: string;
      }>("v1/auth/register/resend-otp", { email });
      toast.success("OTP resent to your email.");
      return { success: true, otp: response.otp };
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to resend OTP. Please try again.";
      toast.error(msg);
      return { success: false };
    }
  };

  const logout = async () => {
    try {
      await apiService.post("v1/auth/logout");
    } catch {}
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
    if (!user?.id) {
      toast.error("Please sign in to manage addresses.");
      return;
    }
    const newAddr = { ...address, id: Date.now().toString() };
    setAddresses((prev) => {
      const updated = address.isDefault
        ? [...prev.map((a) => ({ ...a, isDefault: false })), newAddr]
        : [...prev, newAddr];
      saveAddresses(updated, user.id);
      return updated;
    });
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    if (!user?.id) {
      toast.error("Please sign in to manage addresses.");
      return;
    }
    setAddresses((prev) => {
      let updated = prev.map((a) => (a.id === id ? { ...a, ...updates } : a));
      if (updates.isDefault) updated = updated.map((a) => ({ ...a, isDefault: a.id === id }));
      saveAddresses(updated, user.id);
      return updated;
    });
  };

  const deleteAddress = (id: string) => {
    if (!user?.id) {
      toast.error("Please sign in to manage addresses.");
      return;
    }
    setAddresses((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      saveAddresses(updated, user.id);
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
        isInitialized,
        user,
        addresses,
        wishlist,
        login,
        signup,
        verifyLoginOtp,
        verifyRegisterOtp,
        resendLoginOtp,
        resendRegisterOtp,
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
