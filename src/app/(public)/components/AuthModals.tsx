"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export const LoginModal = () => {
  const {
    showLogin,
    setShowLogin,
    setShowSignup,
    login,
    verifyLoginOtp,
    resendLoginOtp,
  } = useAuth();

  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpVal, setOtpVal] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.otpRequired) {
        setStep("otp");
        setTimer(60);
        if (result.otp) {
          setDevOtp(result.otp);
        }
      }
    }
  };

  const handleVerifyOtp = async (code = otpVal) => {
    if (code.length !== 6) return;
    setOtpLoading(true);
    const success = await verifyLoginOtp(email, code);
    setOtpLoading(false);
    if (success) {
      setStep("credentials");
      setEmail("");
      setPassword("");
      setOtpVal("");
      setDevOtp(undefined);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resendLoading) return;
    setResendLoading(true);
    const result = await resendLoginOtp(email);
    setResendLoading(false);
    if (result.success) {
      setTimer(60);
      setOtpVal("");
      if (result.otp) {
        setDevOtp(result.otp);
      }
    }
  };

  const resetModalState = () => {
    setStep("credentials");
    setEmail("");
    setPassword("");
    setOtpVal("");
    setDevOtp(undefined);
  };

  if (step === "otp") {
    return (
      <Dialog
        open={showLogin}
        onOpenChange={(open) => {
          setShowLogin(open);
          if (!open) resetModalState();
        }}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Verify OTP</DialogTitle>
            <p className="text-center text-sm text-muted-foreground">
              We have sent a verification code to <span className="font-semibold text-foreground">{email}</span>
            </p>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center space-y-6 pt-4">
            <InputOTP
              maxLength={6}
              value={otpVal}
              onChange={(v) => {
                setOtpVal(v);
                if (v.length === 6) {
                  handleVerifyOtp(v);
                }
              }}
              disabled={otpLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {devOtp && (
              <div className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-md text-center max-w-[280px]">
                🔑 Dev Mode: Your code is <strong className="font-bold select-all">{devOtp}</strong>
              </div>
            )}

            <div className="w-full space-y-4">
              <Button
                onClick={() => handleVerifyOtp()}
                className="w-full font-medium"
                disabled={otpVal.length !== 6 || otpLoading}
              >
                {otpLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <div className="flex justify-between items-center text-sm px-1">
                <button
                  type="button"
                  onClick={() => setStep("credentials")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  disabled={otpLoading}
                >
                  Change Email
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timer > 0 || resendLoading || otpLoading}
                  className="text-primary font-medium hover:underline disabled:text-muted-foreground disabled:no-underline transition-all"
                >
                  {timer > 0 ? (
                    `Resend OTP in ${timer}s`
                  ) : resendLoading ? (
                    "Resending..."
                  ) : (
                    "Resend OTP"
                  )}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={showLogin}
      onOpenChange={(open) => {
        setShowLogin(open);
        if (!open) resetModalState();
      }}
    >
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome back</DialogTitle>
          <p className="text-center text-sm text-muted-foreground">Sign in to your ShopSure account</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-pw">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="login-pw"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-10"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
              <input type="checkbox" className="rounded border-border" disabled={loading} /> Remember me
            </label>
            <button type="button" className="text-primary hover:underline" disabled={loading}>
              Forgot password?
            </button>
          </div>
          <Button type="submit" className="w-full font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setShowLogin(false);
                setShowSignup(true);
              }}
              className="text-primary font-medium hover:underline"
              disabled={loading}
            >
              Sign up
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const SignupModal = () => {
  const {
    showSignup,
    setShowSignup,
    setShowLogin,
    signup,
    verifyRegisterOtp,
    resendRegisterOtp,
  } = useAuth();

  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpVal, setOtpVal] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [devOtp, setDevOtp] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);
    if (result.success) {
      if (result.otpRequired) {
        setStep("otp");
        setTimer(60);
        if (result.otp) {
          setDevOtp(result.otp);
        }
      }
    }
  };

  const handleVerifyOtp = async (code = otpVal) => {
    if (code.length !== 6) return;
    setOtpLoading(true);
    const success = await verifyRegisterOtp(email, code);
    setOtpLoading(false);
    if (success) {
      setStep("details");
      setName("");
      setEmail("");
      setPassword("");
      setOtpVal("");
      setDevOtp(undefined);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resendLoading) return;
    setResendLoading(true);
    const result = await resendRegisterOtp(email);
    setResendLoading(false);
    if (result.success) {
      setTimer(60);
      setOtpVal("");
      if (result.otp) {
        setDevOtp(result.otp);
      }
    }
  };

  const resetModalState = () => {
    setStep("details");
    setName("");
    setEmail("");
    setPassword("");
    setOtpVal("");
    setDevOtp(undefined);
  };

  if (step === "otp") {
    return (
      <Dialog
        open={showSignup}
        onOpenChange={(open) => {
          setShowSignup(open);
          if (!open) resetModalState();
        }}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Verify OTP</DialogTitle>
            <p className="text-center text-sm text-muted-foreground">
              We have sent a verification code to <span className="font-semibold text-foreground">{email}</span>
            </p>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center space-y-6 pt-4">
            <InputOTP
              maxLength={6}
              value={otpVal}
              onChange={(v) => {
                setOtpVal(v);
                if (v.length === 6) {
                  handleVerifyOtp(v);
                }
              }}
              disabled={otpLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {devOtp && (
              <div className="text-xs bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-md text-center max-w-[280px]">
                🔑 Dev Mode: Your code is <strong className="font-bold select-all">{devOtp}</strong>
              </div>
            )}

            <div className="w-full space-y-4">
              <Button
                onClick={() => handleVerifyOtp()}
                className="w-full font-medium"
                disabled={otpVal.length !== 6 || otpLoading}
              >
                {otpLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>

              <div className="flex justify-between items-center text-sm px-1">
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  disabled={otpLoading}
                >
                  Back to Details
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timer > 0 || resendLoading || otpLoading}
                  className="text-primary font-medium hover:underline disabled:text-muted-foreground disabled:no-underline transition-all"
                >
                  {timer > 0 ? (
                    `Resend OTP in ${timer}s`
                  ) : resendLoading ? (
                    "Resending..."
                  ) : (
                    "Resend OTP"
                  )}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={showSignup}
      onOpenChange={(open) => {
        setShowSignup(open);
        if (!open) resetModalState();
      }}
    >
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Create account</DialogTitle>
          <p className="text-center text-sm text-muted-foreground">Join ShopSure and start shopping</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="signup-name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="signup-name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9"
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
                disabled={loading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-pw">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="signup-pw"
                type={showPw ? "text" : "password"}
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-10"
                required
                minLength={8}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setShowSignup(false);
                setShowLogin(true);
              }}
              className="text-primary font-medium hover:underline"
              disabled={loading}
            >
              Sign in
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
