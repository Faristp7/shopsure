"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "../../context/LocationContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Camera, Package, Heart, MapPin, Settings, LogOut, ChevronRight, Navigation } from "lucide-react";
import { LocationSelector } from "../../components/LocationSelector";

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { location } = useLocation();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  // if (!isLoggedIn) return null; 
  // Handled by layout

  const startEdit = () => {
    setForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
    setEditing(true);
  };

  const saveEdit = () => {
    updateProfile(form);
    setEditing(false);
  };

  const menuItems = [
    { icon: Package, label: "My Orders", desc: "Track, return, or buy again", path: "/orders" },
    { icon: Heart, label: "Wishlist", desc: "Your saved items", path: "/wishlist" },
    { icon: MapPin, label: "Addresses", desc: "Manage delivery addresses", path: "/addresses" },
    { icon: Settings, label: "Settings", desc: "Notifications, privacy, security", path: "/profile" },
  ];

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-foreground mb-8 uppercase tracking-tight">Account Profile</h1>
      
      {/* Profile Header */}
      <div className="bg-card rounded-2xl p-6 mb-6 shadow-card border border-border/50">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {user?.name?.charAt(0) || "U"}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Name</Label>
                    <Input className="bg-secondary/30 rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Phone</Label>
                    <Input className="bg-secondary/30 rounded-xl" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Email</Label>
                  <Input className="bg-secondary/30 rounded-xl" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" className="rounded-full px-6" onClick={saveEdit}>Save Changes</Button>
                  <Button size="sm" variant="ghost" className="rounded-full px-6" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{user?.email}</span>
                  {user?.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{user.phone}</span>}
                </div>
                <Button size="sm" variant="outline" className="mt-4 rounded-full px-6" onClick={startEdit}>Edit Profile</Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl p-6 mb-6 shadow-card border border-border/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Preferred Location</p>
            <div className="mt-2 flex items-center gap-2 text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">{location?.label ?? "No location selected"}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              We use this to show the right city context and prefill delivery details faster.
            </p>
          </div>
          <Button className="gap-2 rounded-full px-6" variant="outline" onClick={() => setLocationOpen(true)}>
            <Navigation className="h-4 w-4" />
            Change Location
          </Button>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-card rounded-2xl divide-y divide-border shadow-card border border-border/50 overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.path)}
            className="w-full flex items-center gap-4 p-5 hover:bg-secondary/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
              <item.icon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Sign Out */}
      <button
        onClick={() => { logout(); router.push("/"); }}
        className="w-full mt-6 flex items-center gap-3 p-5 bg-card rounded-2xl text-destructive hover:bg-destructive/5 transition-colors shadow-card border border-border/50"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-semibold">Sign Out from Device</span>
      </button>

      <LocationSelector open={locationOpen} onOpenChange={setLocationOpen} />
    </div>
  );
}
