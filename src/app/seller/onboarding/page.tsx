"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, OnboardingFormValues } from "./schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building2,
  MapPin,
  Banknote,
  Info,
} from "lucide-react";
import {
  sellerOnboardingService,
  OnboardingSubmitData,
} from "@/services/seller-onboarding.service";
import { sellerAuthService } from "@/services/seller-auth.service";
import { mediaService } from "@/services/media.service";
import { SellerStatus } from "@/types/seller";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const OnboardingPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState<SellerStatus>(
    SellerStatus.ONBOARDING_INCOMPLETE,
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  const {
    register,
    handleSubmit: handleRHFSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema) as any,
    defaultValues: {
      brand_name: "",
      brand_description: "",
      instagram_url: "",
      logo_url: "",
      public_email: "",
      public_phone: "",
      business_type: "individual",
      legal_business_name: "",
      pan_number: "",
      gst_registered: false,
      gst_number: "",
      business_registration_number: "",
      address_line_1: "",
      address_line_2: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      account_holder_name: "",
      account_number: "",
      ifsc_code: "",
      bank_name: "",
      confirm_account_number: "",
      upi_id: "",
      agreed_terms: false,
      agreed_commission: false,
      agreed_authenticity: false,
      agreed_return_policy: false,
    },
  });

  const isGstRegistered = watch("gst_registered");
  const logoUrl = watch("logo_url");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await sellerAuthService.getProfile();
        setStatus(profile.status);
        if (profile.onboarding) {
          reset(profile.onboarding as OnboardingFormValues);
          if (profile.onboarding.logo_url) {
            setLogoPreview(profile.onboarding.logo_url);
            setValue("logo_url", profile.onboarding.logo_url);
          }
        }

        if (profile.status === SellerStatus.APPROVED) {
          router.push("/seller/dashboard");
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, reset, setValue]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo size must be less than 2MB");
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));

    setUploading(true);
    try {
      const response = await mediaService.uploadLogo(file);
      setValue("logo_url", response.url, { shouldValidate: true });
      toast.success("Logo uploaded successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload logo");
      setLogoFile(null);
      setLogoPreview("");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    if (!data.logo_url) {
      toast.error("Please upload a brand logo");
      return;
    }

    setSubmitting(true);
    try {
      await sellerOnboardingService.submit(data as unknown as OnboardingSubmitData);
      toast.success("Onboarding details submitted successfully!");
      setStatus(SellerStatus.PENDING_ADMIN_APPROVAL);
      window.scrollTo(0, 0);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to submit onboarding details",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isPending = status === SellerStatus.PENDING_ADMIN_APPROVAL;
  const isRejected = status === SellerStatus.REJECTED;
  const isDisabled = isPending || status === SellerStatus.APPROVED;

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
            Seller Onboarding
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Professional verification ensuring quality and trust for our
            customers.
          </p>
        </div>

        {/* Verification Pending View */}
        {isPending && (
          <div className="bg-card border border-border rounded-3xl p-8 mb-8 text-center shadow-sm">
            <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Clock className="w-10 h-10 text-warning" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Verification in Progress
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Great things take time! Our administrators are currently reviewing
              your brand and business details. You'll be automatically
              redirected to your dashboard once approved.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-10">
              <div className="p-4 bg-muted/50 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center border border-border">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Email Verified</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 bg-background rounded-xl flex items-center justify-center border border-border">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Admin Approval</p>
                  <p className="text-xs text-muted-foreground">
                    Pending review
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="group rounded-xl px-6"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Hide Submitted Details" : "View Submitted Details"}
              {showForm ? (
                <ChevronUp className="ml-2 w-4 h-4" />
              ) : (
                <ChevronDown className="ml-2 w-4 h-4" />
              )}
            </Button>
          </div>
        )}

        {/* Rejection Alert */}
        {isRejected && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-destructive shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-destructive">
                Application Rejected
              </h3>
              <p className="text-sm text-destructive/80 mt-1">
                Unfortunately, your application was not approved. Please review
                the highlighted fields and resubmit.
              </p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div
          className={`${isPending && !showForm ? "hidden" : "block"} space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500`}
        >
          <form
            onSubmit={handleRHFSubmit(onSubmit)}
            className="space-y-8 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-sm transition-all duration-300"
          >
            {/* Section: Brand */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Brand Identity
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brand_name">Brand Name</Label>
                  <Input
                    id="brand_name"
                    {...register("brand_name")}
                    placeholder="e.g. Acme Premium"
                    disabled={isDisabled}
                    required
                  />
                  {errors.brand_name && (<p className="text-red-500 text-xs mt-1">{errors.brand_name.message?.toString()}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram_url">Instagram Profile</Label>
                  <Input
                    id="instagram_url"
                    {...register("instagram_url")}
                    type="url"
                    placeholder="https://instagram.com/yourbrand"
                    disabled={isDisabled}
                    required
                  />
                  {errors.instagram_url && (<p className="text-red-500 text-xs mt-1">{errors.instagram_url.message?.toString()}</p>)}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand_description">
                  Brand Mission & Description
                </Label>
                <Textarea
                  id="brand_description"
                  {...register("brand_description")}
                  placeholder="Tell us about what makes your brand unique..."
                  className="min-h-[120px] resize-none"
                  disabled={isDisabled}
                  required
                />
                {errors.brand_description && (<p className="text-red-500 text-xs mt-1">{errors.brand_description.message?.toString()}</p>)}
              </div>

              <div className="space-y-2">
                <Label>Brand Logo</Label>
                <div
                  className={`mt-1.5 border-2 border-dashed rounded-2xl p-10 text-center transition-all relative overflow-hidden ${isDisabled
                      ? "bg-muted/30 border-border opacity-60"
                      : "border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                    }`}
                  onClick={() =>
                    !isDisabled &&
                    !uploading &&
                    document.getElementById("logo-upload")?.click()
                  }
                >
                  <input
                    type="file"
                    id="logo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoChange}
                    disabled={isDisabled || uploading}
                  />

                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                      <p className="text-sm font-medium text-foreground">
                        Uploading logo...
                      </p>
                    </div>
                  ) : logoPreview || logoUrl ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={logoPreview || logoUrl}
                        alt="Logo preview"
                        className="h-20 w-20 object-contain rounded-lg mb-4"
                      />
                      <p className="text-sm font-medium text-foreground">
                        {isDisabled ? "Logo submitted" : "Click to change logo"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm font-medium text-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG up to 2MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Section: Contact */}
            <section className="space-y-6 pt-4">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Info className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Public Contact Information
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="public_email">Public Support Email</Label>
                  <Input
                    id="public_email"
                    {...register("public_email")}
                    type="email"
                    placeholder="support@yourbrand.com"
                    disabled={isDisabled}
                    required
                  />
                  {errors.public_email && (<p className="text-red-500 text-xs mt-1">{errors.public_email.message?.toString()}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="public_phone">Public Support Phone</Label>
                  <Input
                    id="public_phone"
                    {...register("public_phone")}
                    placeholder="9876543210"
                    disabled={isDisabled}
                    required
                  />
                  {errors.public_phone && (<p className="text-red-500 text-xs mt-1">{errors.public_phone.message?.toString()}</p>)}
                </div>
              </div>
            </section>

            {/* Section: Business Details */}
            <section className="space-y-6 pt-4">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Legal Business Details
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="business_type">Business Type</Label>
                  <select
                    id="business_type"
                    {...register("business_type")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isDisabled}
                  >
                    <option value="individual">
                      Individual / Sole Proprietor
                    </option>
                    <option value="pvt_ltd">Private Limited</option>
                    <option value="llp">LLP</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legal_business_name">
                    Legal Business Name
                  </Label>
                  <Input
                    id="legal_business_name"
                    {...register("legal_business_name")}
                    placeholder="As per PAN records"
                    disabled={isDisabled}
                    required
                  />
                  {errors.legal_business_name && (<p className="text-red-500 text-xs mt-1">{errors.legal_business_name.message?.toString()}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan_number">Business PAN Number</Label>
                  <Input
                    id="pan_number"
                    {...register("pan_number")}
                    placeholder="ABCDE1234F"
                    className="uppercase"
                    disabled={isDisabled}
                    required
                  />
                  {errors.pan_number && (<p className="text-red-500 text-xs mt-1">{errors.pan_number.message?.toString()}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_registration_number">
                    Bus. Reg. Number (CIN/LLPIN)
                  </Label>
                  <Input
                    id="business_registration_number"
                    {...register("business_registration_number")}
                    placeholder="U74999MH2020PTC123456"
                    disabled={isDisabled}
                  />
                  {errors.business_registration_number && (<p className="text-red-500 text-xs mt-1">{errors.business_registration_number.message?.toString()}</p>)}
                </div>
              </div>

              <div className="flex items-center space-x-2 p-4 bg-muted/30 rounded-2xl">
                <input
                  type="checkbox"
                  id="gst_registered"
                  {...register("gst_registered")}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  disabled={isDisabled}
                />
                <Label htmlFor="gst_registered" className="cursor-pointer">
                  I am GST Registered
                </Label>
              </div>

              {isGstRegistered && (
                <div className="space-y-2 animate-in fade-in duration-300">
                  <Label htmlFor="gst_number">GSTIN Number</Label>
                  <Input
                    id="gst_number"
                    {...register("gst_number")}
                    placeholder="29ABCDE1234F2Z5"
                    className="uppercase"
                    disabled={isDisabled}
                    required={isGstRegistered}
                  />
                  {errors.gst_number && (<p className="text-red-500 text-xs mt-1">{errors.gst_number.message?.toString()}</p>)}
                </div>
              )}
            </section>

            {/* Section: Address */}
            <section className="space-y-6 pt-4">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Pickup Address
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address_line_1">Address Line 1</Label>
                  <Input
                    id="address_line_1"
                    {...register("address_line_1")}
                    placeholder="House/Plot No, Street"
                    disabled={isDisabled}
                    required
                  />
                  {errors.address_line_1 && (<p className="text-red-500 text-xs mt-1">{errors.address_line_1.message?.toString()}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_line_2">
                    Address Line 2 (Optional)
                  </Label>
                  <Input
                    id="address_line_2"
                    {...register("address_line_2")}
                    placeholder="Area, Locality"
                    disabled={isDisabled}
                    required
                  />
                  {errors.address_line_2 && (<p className="text-red-500 text-xs mt-1">{errors.address_line_2.message?.toString()}</p>)}
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input
                      id="landmark"
                      {...register("landmark")}
                      placeholder="Near..."
                      disabled={isDisabled}
                    />
                    {errors.landmark && (<p className="text-red-500 text-xs mt-1">{errors.landmark.message?.toString()}</p>)}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      placeholder="Mumbai"
                      disabled={isDisabled}
                      required
                    />
                    {errors.city && (<p className="text-red-500 text-xs mt-1">{errors.city.message?.toString()}</p>)}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      {...register("state")}
                      placeholder="Maharashtra"
                      disabled={isDisabled}
                      required
                    />
                    {errors.state && (<p className="text-red-500 text-xs mt-1">{errors.state.message?.toString()}</p>)}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      {...register("pincode")}
                      placeholder="400001"
                      disabled={isDisabled}
                      required
                    />
                    {errors.pincode && (<p className="text-red-500 text-xs mt-1">{errors.pincode.message?.toString()}</p>)}
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Payouts */}
            <section className="space-y-6 pt-4">
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Banknote className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  Payout Information
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="account_holder_name">
                    Account Holder Name
                  </Label>
                  <Input
                    id="account_holder_name"
                    {...register("account_holder_name")}
                    placeholder="As per bank records"
                    disabled={isDisabled}
                    required
                  />
                  {errors.account_holder_name && (<p className="text-red-500 text-xs mt-1">{errors.account_holder_name.message?.toString()}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank_name">Bank Name</Label>
                  <Input
                    id="bank_name"
                    {...register("bank_name")}
                    placeholder="e.g. HDFC Bank"
                    disabled={isDisabled}
                    required
                  />
                  {errors.bank_name && (<p className="text-red-500 text-xs mt-1">{errors.bank_name.message?.toString()}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account_number">Bank Account Number</Label>
                  <Input
                    id="account_number"
                    {...register("account_number")}
                    type="password"
                    placeholder="Enter account number"
                    disabled={isDisabled}
                    required
                  />
                  {errors.account_number && (<p className="text-red-500 text-xs mt-1">{errors.account_number.message?.toString()}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_account_number">
                    Confirm Account Number
                  </Label>
                  <Input
                    id="confirm_account_number"
                    {...register("confirm_account_number")}
                    placeholder="Re-enter account number"
                    disabled={isDisabled}
                    required={!isDisabled}
                  />
                  {errors.confirm_account_number && (<p className="text-red-500 text-xs mt-1">{errors.confirm_account_number.message?.toString()}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifsc_code">IFSC Code</Label>
                  <Input
                    id="ifsc_code"
                    {...register("ifsc_code")}
                    placeholder="HDFC0001234"
                    className="uppercase"
                    disabled={isDisabled}
                    required
                  />
                  {errors.ifsc_code && (<p className="text-red-500 text-xs mt-1">{errors.ifsc_code.message?.toString()}</p>)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upi_id">UPI ID (Optional)</Label>
                  <Input
                    id="upi_id"
                    {...register("upi_id")}
                    placeholder="yourname@bank"
                    disabled={isDisabled}
                  />
                  {errors.upi_id && (<p className="text-red-500 text-xs mt-1">{errors.upi_id.message?.toString()}</p>)}
                </div>
              </div>
            </section>

            {/* Section: Agreements */}
            {!isDisabled && (
              <section className="space-y-4 pt-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agreed_terms"
                      {...register("agreed_terms")}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      required
                    />
                    <Label
                      htmlFor="agreed_terms"
                      className="text-sm font-normal text-muted-foreground"
                    >
                      I agree to the{" "}
                      <span className="text-primary hover:underline cursor-pointer">
                        Terms and Conditions
                      </span>{" "}
                      of ShopSure.
                    </Label>
                    {errors.agreed_terms && (<p className="text-red-500 text-xs mt-1 w-full block">{errors.agreed_terms.message?.toString()}</p>)}
                  </div>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agreed_commission"
                      {...register("agreed_commission")}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      required
                    />
                    <Label
                      htmlFor="agreed_commission"
                      className="text-sm font-normal text-muted-foreground"
                    >
                      I agree to the platform commission structure of 10% per
                      sale.
                    </Label>
                    {errors.agreed_commission && (<p className="text-red-500 text-xs mt-1 w-full block">{errors.agreed_commission.message?.toString()}</p>)}
                  </div>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agreed_authenticity"
                      {...register("agreed_authenticity")}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      required
                    />
                    <Label
                      htmlFor="agreed_authenticity"
                      className="text-sm font-normal text-muted-foreground"
                    >
                      I certificate that all products listed will be 100%
                      authentic and original.
                    </Label>
                    {errors.agreed_authenticity && (<p className="text-red-500 text-xs mt-1 w-full block">{errors.agreed_authenticity.message?.toString()}</p>)}
                  </div>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agreed_return_policy"
                      {...register("agreed_return_policy")}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      required
                    />
                    <Label
                      htmlFor="agreed_return_policy"
                      className="text-sm font-normal text-muted-foreground"
                    >
                      I agree to follow the standard 7-day return policy for
                      customers.
                    </Label>
                    {errors.agreed_return_policy && (<p className="text-red-500 text-xs mt-1 w-full block">{errors.agreed_return_policy.message?.toString()}</p>)}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 mt-8"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting for Verification...
                    </>
                  ) : (
                    "Submit Profile for Approval"
                  )}
                </Button>
              </section>
            )}

            {isDisabled && (
              <div className="pt-6 border-t border-border mt-8">
                <p className="text-sm text-center text-muted-foreground flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  This information is currently under review and cannot be
                  edited.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
