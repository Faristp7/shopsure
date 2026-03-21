import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export const LoginModal = () => {
  const { showLogin, setShowLogin, setShowSignup, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) login(email, password);
  };

  return (
    <Dialog open={showLogin} onOpenChange={setShowLogin}>
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
              <Input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-pw">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="login-pw" type={showPw ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 pr-10" required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border" /> Remember me
            </label>
            <button type="button" className="text-primary hover:underline">Forgot password?</button>
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button type="button" onClick={() => { setShowLogin(false); setShowSignup(true); }} className="text-primary font-medium hover:underline">
              Sign up
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const SignupModal = () => {
  const { showSignup, setShowSignup, setShowLogin, signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) signup(name, email, password);
  };

  return (
    <Dialog open={showSignup} onOpenChange={setShowSignup}>
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
              <Input id="signup-name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-9" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="signup-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-pw">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="signup-pw" type={showPw ? "text" : "password"} placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 pr-10" required minLength={8} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full">Create Account</Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button type="button" onClick={() => { setShowSignup(false); setShowLogin(true); }} className="text-primary font-medium hover:underline">
              Sign in
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
