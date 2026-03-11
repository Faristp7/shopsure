import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { sellerAuthService } from "@/services/seller-auth.service";
import { useRouter } from "next/navigation";

const OTP_LENGTH = 6;

const AuthCard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Registration data
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const startResendTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError("");

    try {
      await sellerAuthService.register({
        name: brandName,
        email: email,
        mobile: phoneNumber,
        password: password,
      });

      setShowOtp(true);
      setOtp(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      startResendTimer();
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (error: any) {
      console.error("Registration failed:", error);
      setAuthError(
        error.response?.data?.message ||
        "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError("");

    try {
      const response = await sellerAuthService.login({
        email: email,
        password: password,
      });

      // Store tokens in cookies
      document.cookie = `accessToken=${response.accessToken}; path=/; max-age=86400; SameSite=Strict`;
      document.cookie = `refreshToken=${response.refreshToken}; path=/; max-age=604800; SameSite=Strict`;
      localStorage.setItem("seller", JSON.stringify(response.seller));
alert(response.redirectTo);
      if (response.redirectTo === "waiting-approval") {
        router.push("/seller/onboarding");
      } else if (response.redirectTo === "onboarding") {
        router.push("/seller/onboarding");
      } else if (response.redirectTo === "rejected") {
        router.push("/seller/onboarding");
      } else if (response.redirectTo === "verify-email") {
        router.push("/seller/verify-email");
      } else {
        router.push("/seller/dashboard");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      setAuthError(
        error.response?.data?.message ||
        "Login failed. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length < OTP_LENGTH) {
      setOtpError("Please enter the complete OTP");
      return;
    }
    setOtpVerifying(true);
    setOtpError("");

    try {
      const response = await sellerAuthService.verifyEmailOtp({
        email: email,
        otp: code,
      });

      // Store tokens in cookies
      document.cookie = `accessToken=${response.accessToken}; path=/; max-age=86400; SameSite=Strict`;
      document.cookie = `refreshToken=${response.refreshToken}; path=/; max-age=604800; SameSite=Strict`;
      localStorage.setItem("user", JSON.stringify(response.user));

      router.push("/seller/dashboard");
    } catch (error: any) {
      console.error("OTP Verification failed:", error);
      setOtpError(
        error.response?.data?.message || "Invalid OTP. Please try again.",
      );
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setOtp(Array(OTP_LENGTH).fill(""));
    setOtpError("");

    try {
      await sellerAuthService.register({
        name: brandName,
        email: email,
        mobile: phoneNumber,
        password: password,
      });
      startResendTimer();
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      setOtpError("Failed to resend OTP. Please try again.");
    }
  };

  const otpFilled = otp.every((d) => d !== "");

  return (
    <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
      {/* Tabs */}
      {!showOtp && (
        <div className="grid grid-cols-2 border-b border-border">
          {(["signup", "login"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setAuthError("");
              }}
              className={`relative py-4 text-sm font-semibold transition-colors ${activeTab === tab
                ? "text-primary bg-accent/50"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab === "signup"
                ? "New Seller? Sign Up"
                : "Existing Seller? Login"}
              {activeTab === tab && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="p-6">
        {authError && (
          <div className="mb-4 p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {authError}
          </div>
        )}
        <AnimatePresence mode="wait">
          {showOtp ? (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="mx-auto w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-3">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Verify Your Email
                </h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit code to{" "}
                  <span className="font-semibold text-foreground">{email}</span>
                </p>
              </div>

              {/* OTP Input */}
              <div
                className="flex justify-center gap-2.5"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`w-11 h-13 text-center text-lg font-bold rounded-lg border-2 transition-all outline-none
                      bg-background text-foreground
                      ${digit ? "border-primary" : "border-input"}
                      ${otpError ? "border-destructive" : ""}
                      focus:border-primary focus:ring-2 focus:ring-ring/30
                    `}
                    aria-label={`OTP digit ${i + 1}`}
                  />
                ))}
              </div>

              {/* Error */}
              {otpError && (
                <p className="text-xs text-destructive text-center font-medium">
                  {otpError}
                </p>
              )}

              {/* Verify Button */}
              <Button
                onClick={handleVerifyOtp}
                className="w-full text-base font-semibold h-12"
                size="lg"
                disabled={!otpFilled || otpVerifying}
              >
                {otpVerifying ? (
                  <span className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 animate-spin" /> Verifying...
                  </span>
                ) : (
                  <>
                    Verify & Create Account{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Resend & Back */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowOtp(false)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="h-3 w-3" /> Back
                </button>
                <button
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className={`text-xs font-medium transition-colors ${resendTimer > 0
                    ? "text-muted-foreground cursor-not-allowed"
                    : "text-primary hover:underline"
                    }`}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
              </div>
            </motion.div>
          ) : activeTab === "signup" ? (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSignupSubmit}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="brandName">Brand / Store Name</Label>
                <Input
                  id="brandName"
                  placeholder="e.g. Priya's Boutique"
                  className="mt-1.5"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="mt-1.5"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email (OTP verification)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1.5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="mt-1.5 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex items-start gap-2.5">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) =>
                    setAgreedToTerms(checked === true)
                  }
                  className="mt-0.5"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-muted-foreground leading-relaxed cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    href="/seller-terms"
                    className="text-primary hover:underline font-medium"
                    target="_blank"
                  >
                    Seller Terms & Conditions
                  </Link>
                </label>
              </div>
              <Button
                type="submit"
                className="w-full text-base font-semibold h-12"
                size="lg"
                disabled={!agreedToTerms || isLoading}
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    Start Selling <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Approval within 24 hours · No upfront cost
              </p>
            </motion.form>
          ) : (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleLoginSubmit}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="loginEmail">Email</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1.5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <Label htmlFor="loginPassword">Password</Label>
                <Input
                  id="loginPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="mt-1.5 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <Button
                type="submit"
                className="w-full text-base font-semibold h-12"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Logging in..."
                ) : (
                  <>
                    Login to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                <a href="#" className="text-primary hover:underline">
                  Forgot password?
                </a>
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthCard;
