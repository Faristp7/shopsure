import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const OnboardingPage = () => {
  const [status] = useState<"pending" | "approved" | "rejected">("pending");

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-extrabold text-lg">S</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Complete Your Seller Profile</h1>
          <p className="text-muted-foreground mt-2">Fill in the details below to get verified and start selling.</p>
        </div>

        {/* Status Banner */}
        <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
          status === "pending" ? "bg-warning/10 border border-warning/20" :
          status === "approved" ? "bg-success/10 border border-success/20" :
          "bg-destructive/10 border border-destructive/20"
        }`}>
          {status === "pending" && <Clock className="h-5 w-5 text-warning" />}
          {status === "approved" && <CheckCircle2 className="h-5 w-5 text-success" />}
          {status === "rejected" && <AlertCircle className="h-5 w-5 text-destructive" />}
          <div>
            <p className="text-sm font-semibold text-foreground">
              {status === "pending" && "Verification Pending"}
              {status === "approved" && "You're Approved!"}
              {status === "rejected" && "Verification Rejected"}
            </p>
            <p className="text-xs text-muted-foreground">
              {status === "pending" && "Your profile is under review. This usually takes less than 24 hours."}
              {status === "approved" && "You can now start listing products on the marketplace."}
              {status === "rejected" && "Please update the highlighted fields and resubmit."}
            </p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          {/* Brand Info */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Brand Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Brand Name</Label>
                <Input placeholder="e.g. Priya's Boutique" className="mt-1.5" />
              </div>
              <div>
                <Label>Instagram Profile Link</Label>
                <Input placeholder="instagram.com/yourbrand" className="mt-1.5" />
              </div>
            </div>
            <div className="mt-4">
              <Label>Brand Logo</Label>
              <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Business Details</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Business Type</Label>
                <select className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option>Individual</option>
                  <option>Registered Business</option>
                </select>
              </div>
              <div>
                <Label>GST Number <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input placeholder="22AAAAA0000A1Z5" className="mt-1.5" />
                <p className="text-xs text-muted-foreground mt-1">Required only for registered businesses</p>
              </div>
            </div>
          </div>

          {/* Pickup Address */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Pickup Address</h3>
            <Textarea placeholder="Full address for courier pickup" className="min-h-[80px]" />
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <div>
                <Label>City</Label>
                <Input placeholder="Mumbai" className="mt-1.5" />
              </div>
              <div>
                <Label>State</Label>
                <Input placeholder="Maharashtra" className="mt-1.5" />
              </div>
              <div>
                <Label>Pincode</Label>
                <Input placeholder="400001" className="mt-1.5" />
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div>
            <h3 className="font-bold text-foreground mb-4">Bank Details for Payouts</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Account Holder Name</Label>
                <Input placeholder="As per bank records" className="mt-1.5" />
              </div>
              <div>
                <Label>Account Number</Label>
                <Input placeholder="Enter account number" className="mt-1.5" />
              </div>
              <div>
                <Label>IFSC Code</Label>
                <Input placeholder="e.g. SBIN0001234" className="mt-1.5" />
              </div>
              <div>
                <Label>Bank Name</Label>
                <Input placeholder="e.g. State Bank of India" className="mt-1.5" />
              </div>
            </div>
          </div>

          <Button className="w-full h-12 text-base font-semibold" size="lg">
            Submit for Verification
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
