"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Camera, Package, Heart, MapPin, Settings, LogOut, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const startEdit = () => {
    setForm({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
    setEditing(true);
  };

  const saveEdit = () => {
    updateProfile(form);
    setEditing(false);
  };

  const menuItems = [
    { icon: Package, label: "My Orders", desc: "Track, return, or buy again", path: "/user/orders" },
    { icon: Heart, label: "Wishlist", desc: "Your saved items", path: "/user/wishlist" },
    { icon: MapPin, label: "Addresses", desc: "Manage delivery addresses", path: "/user/addresses" },
    { icon: Settings, label: "Settings", desc: "Notifications, privacy, security", path: "/user/profile" },
  ];

  return (
    <div className="container py-8">
      {/* Profile Header */}
      <div className="bg-card rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {user?.name?.charAt(0) || "U"}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-md">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">Phone</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEdit}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{user?.email}</span>
                  {user?.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{user.phone}</span>}
                </div>
                <Button size="sm" variant="outline" className="mt-3" onClick={startEdit}>Edit Profile</Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-card rounded-2xl divide-y divide-border">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => router.push(item.path)}
            className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 text-foreground" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      {/* Sign Out */}
      <button
        onClick={() => { logout(); router.push("/user"); }}
        className="w-full mt-4 flex items-center gap-3 p-4 bg-card rounded-2xl text-destructive hover:bg-destructive/5 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="text-sm font-medium">Sign Out</span>
      </button>
    </div>
  );
}
