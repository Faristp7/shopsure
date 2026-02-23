'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { adminSellerService } from "@/services/admin-seller";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Phone, MapPin, Landmark, FileText, CheckCircle2, Store } from "lucide-react";

interface SellerDetailsModalProps {
    id: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function SellerDetailsModal({ id, isOpen, onClose }: SellerDetailsModalProps) {
    const { data: seller, isLoading, isError } = useQuery({
        queryKey: ['admin-seller', id],
        queryFn: () => id ? adminSellerService.getSellerById(id) : null,
        enabled: !!id && isOpen,
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b bg-muted/20">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Store className="w-6 h-6 text-primary" />
                        Seller Details
                    </DialogTitle>
                    {seller && (
                        <Badge className="ml-4 px-3 py-1" variant={
                            seller.status === 'APPROVED' ? "default" :
                                seller.status === 'PENDING_ADMIN_APPROVAL' ? "outline" :
                                    seller.status === 'ONBOARDING_INCOMPLETE' ? "outline" : "destructive"
                        }>
                            {seller.status.replace(/_/g, ' ')}
                        </Badge>
                    )}
                </DialogHeader>

                <div className="flex-1 p-6 overflow-y-auto min-h-[50vh]">
                    {isLoading ? (
                        <div className="space-y-6">
                            <Skeleton className="h-32 w-full rounded-xl" />
                            <div className="grid grid-cols-2 gap-6">
                                <Skeleton className="h-64 w-full rounded-xl" />
                                <Skeleton className="h-64 w-full rounded-xl" />
                            </div>
                        </div>
                    ) : isError ? (
                        <div className="text-center text-destructive py-12 flex flex-col items-center justify-center">
                            <span className="text-lg font-medium">Failed to load seller details.</span>
                            <span className="text-sm text-muted-foreground mt-2">Please try again later.</span>
                        </div>
                    ) : !seller ? (
                        <div className="text-center text-muted-foreground py-12">No data available.</div>
                    ) : (
                        <div className="space-y-8 pb-6">
                            {/* Top Level Account Info */}
                            <div className="bg-muted/30 p-5 rounded-xl border flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">{seller.name}</h2>
                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {seller.email}</span>
                                        {seller.mobile && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {seller.mobile}</span>}
                                    </div>
                                </div>
                                <div className="text-sm text-right">
                                    <p className="text-muted-foreground">Account Created</p>
                                    <p className="font-medium">{format(new Date(seller.createdAt), 'MMM dd, yyyy h:mm a')}</p>
                                </div>
                            </div>

                            {seller.onboarding ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Brand Information */}
                                    <section className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                                            <Building2 className="w-5 h-5 text-primary" />
                                            <h3 className="text-lg font-semibold">Brand Information</h3>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <DetailRow label="Brand Name" value={seller.onboarding.brandName} />
                                            <DetailRow label="Brand Description" value={seller.onboarding.brandDescription} />
                                            {seller.onboarding.instagramUrl && (
                                                <DetailRow label="Instagram" value={<a href={seller.onboarding.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{seller.onboarding.instagramUrl}</a>} />
                                            )}
                                            <DetailRow label="Public Email" value={seller.onboarding.publicEmail} />
                                            <DetailRow label="Public Phone" value={seller.onboarding.publicPhone} />
                                        </div>
                                    </section>

                                    {/* Business & Legal Information */}
                                    <section className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                                            <FileText className="w-5 h-5 text-primary" />
                                            <h3 className="text-lg font-semibold">Business Details</h3>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <DetailRow label="Business Type" value={seller.onboarding.businessType.replace(/_/g, ' ')} />
                                            <DetailRow label="Legal Name" value={seller.onboarding.legalBusinessName} />
                                            <DetailRow label="PAN Number" value={seller.onboarding.panNumber} />
                                            <DetailRow label="GST Registered" value={seller.onboarding.gstRegistered ? "Yes" : "No"} />
                                            {seller.onboarding.gstNumber && <DetailRow label="GST Number" value={seller.onboarding.gstNumber} />}
                                            {seller.onboarding.businessRegistrationNumber && <DetailRow label="Registration No" value={seller.onboarding.businessRegistrationNumber} />}
                                        </div>
                                    </section>

                                    {/* Pickup Address */}
                                    <section className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            <h3 className="text-lg font-semibold">Pickup Address</h3>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <DetailRow label="Address Line 1" value={seller.onboarding.pickupAddressLine1} />
                                            {seller.onboarding.pickupAddressLine2 && <DetailRow label="Address Line 2" value={seller.onboarding.pickupAddressLine2} />}
                                            {seller.onboarding.pickupLandmark && <DetailRow label="Landmark" value={seller.onboarding.pickupLandmark} />}
                                            <DetailRow label="City & Pincode" value={`${seller.onboarding.pickupCity} - ${seller.onboarding.pickupPincode}`} />
                                            <DetailRow label="State & Country" value={`${seller.onboarding.pickupState}, ${seller.onboarding.pickupCountry}`} />
                                        </div>
                                    </section>

                                    {/* Bank Details */}
                                    <section className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                                            <Landmark className="w-5 h-5 text-primary" />
                                            <h3 className="text-lg font-semibold">Bank Details</h3>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <DetailRow label="Account Holder" value={seller.onboarding.accountHolderName} />
                                            <DetailRow label="Bank Name" value={seller.onboarding.bankName} />
                                            <DetailRow label="Account Number" value={seller.onboarding.bankAccountNumber} />
                                            <DetailRow label="IFSC Code" value={seller.onboarding.ifscCode} />
                                            {seller.onboarding.upiId && <DetailRow label="UPI ID" value={seller.onboarding.upiId} />}
                                        </div>
                                    </section>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                                    <p>This seller has not submitted their onboarding details yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function DetailRow({ label, value }: { label: string, value: React.ReactNode }) {
    if (!value) return null;
    return (
        <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-white/5 last:border-0">
            <span className="text-muted-foreground min-w-[140px]">{label}</span>
            <span className="font-medium text-right">{value}</span>
        </div>
    )
}
