"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Search, MapPin, ChevronDown, User, LogIn, UserPlus, Package, Heart, Settings, LogOut, Navigation } from "lucide-react";
import { SearchBar } from "@/components/public/SearchBar";
import { ChatBot } from "@/components/public/ChatBot";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const cities = [
  { name: "New York", state: "NY" },
  { name: "Los Angeles", state: "CA" },
  { name: "Chicago", state: "IL" },
  { name: "Houston", state: "TX" },
  { name: "Phoenix", state: "AZ" },
  { name: "Philadelphia", state: "PA" },
  { name: "San Antonio", state: "TX" },
  { name: "San Diego", state: "CA" },
  { name: "Dallas", state: "TX" },
  { name: "Miami", state: "FL" },
];

const Navbar = () => {
  const { itemCount } = useCart();
  const { isLoggedIn, user, logout, setShowLogin, setShowSignup } = useAuth();
  const router = useRouter();
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("New York");
  const [citySearch, setCitySearch] = useState("");

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.state.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <>
      <header className="bg-card shadow-card sticky top-0 z-50">
        <div className="container flex items-center gap-4 py-3">
          <Link href="/" className="text-xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity shrink-0">
            ShopSure
          </Link>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
            <SearchBar
              inputClassName="w-full bg-secondary text-sm rounded-xl py-2.5 pl-9 pr-3 outline-none focus:ring-2 focus:ring-ring/20 transition-all placeholder:text-muted-foreground"
              placeholder="Search products, brands..."
            />
          </div>

          <button
            onClick={() => setLocationOpen(true)}
            className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <MapPin className="w-4 h-4" />
            <span>{selectedCity}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0">
                {isLoggedIn ? (
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span>{isLoggedIn ? user?.name?.split(" ")[0] : "Account"}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {isLoggedIn ? (
                <>
                  <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => router.push("/profile")}>
                    <User className="w-4 h-4" /> My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => router.push("/orders")}>
                    <Package className="w-4 h-4" /> My Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => router.push("/wishlist")}>
                    <Heart className="w-4 h-4" /> Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => router.push("/addresses")}>
                    <MapPin className="w-4 h-4" /> Addresses
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => router.push("/profile")}>
                    <Settings className="w-4 h-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive" onClick={() => { logout(); router.push("/"); }}>
                    <LogOut className="w-4 h-4" /> Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setShowLogin(true)}>
                    <LogIn className="w-4 h-4" /> Sign In
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setShowSignup(true)}>
                    <UserPlus className="w-4 h-4" /> Create Account
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <ChatBot />

          <Link href="/cart" className="relative p-2 rounded-lg hover:bg-secondary transition-colors shrink-0" aria-label="Cart">
            <ShoppingBag className="w-5 h-5 text-foreground" />
            {itemCount > 0 && (
              <span
                key={itemCount}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-semibold rounded-full flex items-center justify-center [animation:cart-badge-bump_0.5s_ease]"
              >
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <Dialog open={locationOpen} onOpenChange={setLocationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Select your location
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors text-sm font-medium">
              <Navigation className="w-4 h-4" />
              Use my current location
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search city..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full bg-secondary text-sm rounded-xl py-2.5 pl-9 pr-3 outline-none focus:ring-2 focus:ring-ring/20 transition-all placeholder:text-muted-foreground"
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {filteredCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => { setSelectedCity(city.name); setLocationOpen(false); setCitySearch(""); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${selectedCity === city.name ? "bg-primary/10 text-primary font-medium" : "hover:bg-secondary text-foreground"}`}
                >
                  <span>{city.name}</span>
                  <span className="text-muted-foreground text-xs">{city.state}</span>
                </button>
              ))}
              {filteredCities.length === 0 && <p className="text-center text-muted-foreground text-sm py-4">No cities found</p>}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
