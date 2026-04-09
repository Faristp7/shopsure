"use client";

import { useState } from "react";
import { useAuth, Address } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Plus, Pencil, Trash2, Check } from "lucide-react";

const emptyForm = { label: "", name: "", phone: "", street: "", city: "", state: "", zip: "", isDefault: false };

export default function AddressPage() {
  const { isLoggedIn, addresses, addAddress, updateAddress, deleteAddress } = useAuth();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  // if (!isLoggedIn) return null; 
  // Handled by layout

  const openAdd = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (addr: Address) => { 
    setEditId(addr.id); 
    setForm({ 
      label: addr.label, 
      name: addr.name, 
      phone: addr.phone, 
      street: addr.street, 
      city: addr.city, 
      state: addr.state, 
      zip: addr.zip, 
      isDefault: addr.isDefault 
    }); 
    setOpen(true); 
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) updateAddress(editId, form);
    else addAddress(form);
    setOpen(false);
  };

  return (
    <div className="container py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-0 uppercase tracking-tight">Saved Addresses</h1>
        <Button onClick={openAdd} size="sm" className="gap-2 rounded-full px-5"><Plus className="w-4 h-4" /> Add New</Button>
      </div>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl shadow-card border border-border/50">
            <MapPin className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No addresses saved yet.</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} className={`bg-card rounded-2xl p-6 border-2 transition-all shadow-card ${addr.isDefault ? "border-primary/20 bg-primary/5" : "border-transparent"}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-foreground uppercase tracking-widest">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> DEFAULT
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">{addr.name}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {addr.street}<br />
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                  <p className="text-sm font-medium text-foreground mt-2">{addr.phone}</p>
                </div>
                <div className="flex gap-1 ml-4">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-secondary/50 hover:bg-secondary" onClick={() => openEdit(addr)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-destructive hover:text-destructive hover:bg-destructive/5" onClick={() => deleteAddress(addr.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
              {!addr.isDefault && (
                <button 
                  onClick={() => updateAddress(addr.id, { isDefault: true })}
                  className="mt-4 text-xs font-bold text-primary hover:underline transition-all"
                >
                  Set as default address
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-card border-none shadow-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase tracking-tight">{editId ? "Edit Address" : "Add Address"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Label</Label>
                <Input placeholder="Home, Office..." className="bg-secondary/30 rounded-xl" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Full Name</Label>
                <Input className="bg-secondary/30 rounded-xl" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Phone Number</Label>
              <Input className="bg-secondary/30 rounded-xl" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Street Address</Label>
              <Input className="bg-secondary/30 rounded-xl" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">City</Label>
                <Input className="bg-secondary/30 rounded-xl" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">State</Label>
                <Input className="bg-secondary/30 rounded-xl" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">ZIP</Label>
                <Input className="bg-secondary/30 rounded-xl" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} required />
              </div>
            </div>
            <label className="flex items-center gap-3 text-sm cursor-pointer select-none py-2">
              <input 
                type="checkbox" 
                checked={form.isDefault} 
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} 
                className="w-4 h-4 rounded-md border-border text-primary focus:ring-primary/20" 
              />
              <span className="font-medium text-foreground">Set as default address</span>
            </label>
            <Button type="submit" className="w-full rounded-2xl py-6 font-bold uppercase tracking-widest">{editId ? "Save Changes" : "Create Address"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
