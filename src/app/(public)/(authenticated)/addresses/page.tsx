"use client";

import { useState } from "react";
import { useAuth, Address } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Plus, Pencil, Trash2, Check } from "lucide-react";

const emptyForm = { label: "", name: "", phone: "", street: "", city: "", state: "", zip: "", isDefault: false };

export default function AddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress } = useAuth();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (addr: Address) => { setEditId(addr.id); setForm({ label: addr.label, name: addr.name, phone: addr.phone, street: addr.street, city: addr.city, state: addr.state, zip: addr.zip, isDefault: addr.isDefault }); setOpen(true); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) updateAddress(editId, form);
    else addAddress(form);
    setOpen(false);
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Addresses</h1>
        <Button onClick={openAdd} size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Add Address</Button>
      </div>

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div key={addr.id} className={`bg-card rounded-2xl p-5 border-2 transition-colors ${addr.isDefault ? "border-primary/30" : "border-transparent"}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground">{addr.name}</p>
                <p className="text-sm text-muted-foreground">{addr.street}</p>
                <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
                <p className="text-sm text-muted-foreground mt-1">{addr.phone}</p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(addr)}><Pencil className="w-3.5 h-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteAddress(addr.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
            {!addr.isDefault && (
              <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => updateAddress(addr.id, { isDefault: true })}>Set as Default</Button>
            )}
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Address" : "Add New Address"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Label</Label><Input placeholder="Home, Office..." value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required /></div>
              <div><Label className="text-xs">Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            </div>
            <div><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
            <div><Label className="text-xs">Street Address</Label><Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label className="text-xs">City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></div>
              <div><Label className="text-xs">State</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required /></div>
              <div><Label className="text-xs">ZIP</Label><Input value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} required /></div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="rounded border-border" />
              Set as default address
            </label>
            <Button type="submit" className="w-full">{editId ? "Save Changes" : "Add Address"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
