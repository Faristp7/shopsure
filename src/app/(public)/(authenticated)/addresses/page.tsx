"use client";
import { useState } from "react";
import { useAuth, Address } from "../../context/AuthContext";
import { useLocation } from "../../context/LocationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Plus, Pencil, Trash2, Check } from "lucide-react";
import { toast } from "sonner";

interface AddressFormErrors {
  label?: string;
  name?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

const emptyForm = { label: "", name: "", phone: "", street: "", city: "", state: "", zip: "", country: "India", isDefault: false };

const validateAddressForm = (form: typeof emptyForm): AddressFormErrors => {
  const errors: AddressFormErrors = {};

  if (!form.label || form.label.trim().length === 0) {
    errors.label = "Label is required (e.g. Home, Office)";
  } else if (form.label.trim().length < 2) {
    errors.label = "Label must be at least 2 characters";
  } else if (form.label.trim().length > 50) {
    errors.label = "Label must be at most 50 characters";
  }

  const nameTrim = form.name.trim();
  if (!nameTrim) {
    errors.name = "Full name is required";
  } else if (nameTrim.length < 2) {
    errors.name = "Full name must be at least 2 characters";
  } else if (nameTrim.length > 100) {
    errors.name = "Full name must be at most 100 characters";
  } else if (!/^[a-zA-Z\s\.\,\'\-]+$/.test(nameTrim)) {
    errors.name = "Use only letters, spaces, dots, commas, apostrophes, and hyphens";
  }

  const phoneTrim = form.phone.trim();
  if (!phoneTrim) {
    errors.phone = "Phone number is required";
  } else if (phoneTrim.length < 10 || phoneTrim.length > 20) {
    errors.phone = "Phone must be between 10 and 20 digits";
  } else if (!/^\+?[0-9\s\-()]{10,20}$/.test(phoneTrim)) {
    errors.phone = "Phone must be valid (e.g. +919876543210)";
  }

  const streetTrim = form.street.trim();
  if (!streetTrim) {
    errors.street = "Street address is required";
  } else if (streetTrim.length < 5) {
    errors.street = "Street must be at least 5 characters";
  } else if (streetTrim.length > 250) {
    errors.street = "Street must be at most 250 characters";
  }

  const cityTrim = form.city.trim();
  if (!cityTrim) {
    errors.city = "City is required";
  } else if (cityTrim.length < 2) {
    errors.city = "City must be at least 2 characters";
  } else if (cityTrim.length > 100) {
    errors.city = "City must be at most 100 characters";
  } else if (!/^[a-zA-Z\s\-]+$/.test(cityTrim)) {
    errors.city = "Letters, spaces, and hyphens only";
  }

  const stateTrim = form.state.trim();
  if (!stateTrim) {
    errors.state = "State is required";
  } else if (stateTrim.length < 2) {
    errors.state = "State must be at least 2 characters";
  } else if (stateTrim.length > 100) {
    errors.state = "State must be at most 100 characters";
  } else if (!/^[a-zA-Z\s\-]+$/.test(stateTrim)) {
    errors.state = "Letters, spaces, and hyphens only";
  }

  const zipTrim = form.zip.trim();
  if (!zipTrim) {
    errors.zip = "ZIP/Postal code is required";
  } else if (zipTrim.length < 3 || zipTrim.length > 10) {
    errors.zip = "ZIP must be 3-10 characters";
  } else if (!/^[a-zA-Z0-9\s\-]{3,10}$/.test(zipTrim)) {
    errors.zip = "Alphanumeric, spaces, or hyphens only";
  }

  const countryTrim = form.country.trim();
  if (!countryTrim) {
    errors.country = "Country is required";
  } else if (countryTrim.length < 2) {
    errors.country = "Country must be at least 2 characters";
  } else if (countryTrim.length > 100) {
    errors.country = "Country must be at most 100 characters";
  } else if (!/^[a-zA-Z\s\-]+$/.test(countryTrim)) {
    errors.country = "Letters, spaces, and hyphens only";
  }

  return errors;
};

const sanitizeForm = (f: typeof emptyForm) => {
  const sanitizeStr = (s: string) => {
    return s.trim().replace(/<[^>]*>/g, '');
  };
  return {
    ...f,
    label: sanitizeStr(f.label),
    name: sanitizeStr(f.name),
    phone: sanitizeStr(f.phone),
    street: sanitizeStr(f.street),
    city: sanitizeStr(f.city),
    state: sanitizeStr(f.state),
    zip: sanitizeStr(f.zip),
    country: sanitizeStr(f.country),
  };
};

export default function AddressPage() {
  const { user, addresses, addAddress, updateAddress, deleteAddress } = useAuth();
  const { location } = useLocation();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<AddressFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const openAdd = () => {
    setEditId(null);
    setErrors({});
    setForm({
      ...emptyForm,
      name: user?.name ?? "",
      city: location?.city ?? "",
      state: location?.state ?? "",
    });
    setOpen(true);
  };

  const openEdit = (addr: Address) => { 
    setEditId(addr.id); 
    setErrors({});
    setForm({ 
      label: addr.label, 
      name: addr.name, 
      phone: addr.phone, 
      street: addr.street, 
      city: addr.city, 
      state: addr.state, 
      zip: addr.zip, 
      country: addr.country || "India",
      isDefault: addr.isDefault 
    }); 
    setOpen(true); 
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateAddressForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please correct the validation errors in the form.");
      return;
    }

    setIsSaving(true);
    try {
      setErrors({});
      const sanitized = sanitizeForm(form);
      if (editId) {
        await updateAddress(editId, sanitized);
        toast.success("Address updated successfully!");
      } else {
        await addAddress(sanitized);
        toast.success("Address created successfully!");
      }
      setOpen(false);
    } catch (err) {
      toast.error("An error occurred while saving the address.");
    } finally {
      setIsSaving(false);
    }
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
                    {addr.city}, {addr.state} {addr.zip}<br />
                    {addr.country}
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
        <DialogContent className="sm:max-w-md bg-card border-none shadow-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold uppercase tracking-tight">{editId ? "Edit Address" : "Add Address"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Label</Label>
                <Input 
                  placeholder="Home, Office..." 
                  className={`bg-secondary/30 rounded-xl ${errors.label ? 'border-destructive/80 focus-visible:ring-destructive/20' : ''}`} 
                  value={form.label} 
                  onChange={(e) => setForm({ ...form, label: e.target.value })} 
                />
                {errors.label && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{errors.label}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Full Name</Label>
                <Input 
                  placeholder="John Doe"
                  className={`bg-secondary/30 rounded-xl ${errors.name ? 'border-destructive/80 focus-visible:ring-destructive/20' : ''}`} 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                />
                {errors.name && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{errors.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Phone Number</Label>
                <Input 
                  placeholder="+919876543210"
                  className={`bg-secondary/30 rounded-xl ${errors.phone ? 'border-destructive/80 focus-visible:ring-destructive/20' : ''}`} 
                  value={form.phone} 
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                />
                {errors.phone && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{errors.phone}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Country</Label>
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className={`flex h-10 w-full rounded-xl border border-input bg-secondary/30 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground ${errors.country ? 'border-destructive/80' : ''}`}
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                </select>
                {errors.country && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{errors.country}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Street Address</Label>
              <Input 
                placeholder="123 Main St, Apt 4B"
                className={`bg-secondary/30 rounded-xl ${errors.street ? 'border-destructive/80 focus-visible:ring-destructive/20' : ''}`} 
                value={form.street} 
                onChange={(e) => setForm({ ...form, street: e.target.value })} 
              />
              {errors.street && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{errors.street}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">City</Label>
                <Input 
                  placeholder="Mumbai"
                  className={`bg-secondary/30 rounded-xl ${errors.city ? 'border-destructive/80 focus-visible:ring-destructive/20' : ''}`} 
                  value={form.city} 
                  onChange={(e) => setForm({ ...form, city: e.target.value })} 
                />
                {errors.city && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{errors.city}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">State</Label>
                <Input 
                  placeholder="Maharashtra"
                  className={`bg-secondary/30 rounded-xl ${errors.state ? 'border-destructive/80 focus-visible:ring-destructive/20' : ''}`} 
                  value={form.state} 
                  onChange={(e) => setForm({ ...form, state: e.target.value })} 
                />
                {errors.state && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{errors.state}</p>}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">ZIP</Label>
                <Input 
                  placeholder="400001"
                  className={`bg-secondary/30 rounded-xl ${errors.zip ? 'border-destructive/80 focus-visible:ring-destructive/20' : ''}`} 
                  value={form.zip} 
                  onChange={(e) => setForm({ ...form, zip: e.target.value })} 
                />
                {errors.zip && <p className="text-destructive text-[11px] font-medium mt-1 leading-none">{errors.zip}</p>}
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
            <Button 
              type="submit" 
              className="w-full rounded-2xl py-6 font-bold uppercase tracking-widest"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : (editId ? "Save Changes" : "Create Address")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
