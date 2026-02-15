export enum SellerStatus {
    PENDING_EMAIL_VERIFICATION = 'PENDING_EMAIL_VERIFICATION',
    ONBOARDING_INCOMPLETE = 'ONBOARDING_INCOMPLETE',
    PENDING_ADMIN_APPROVAL = 'PENDING_ADMIN_APPROVAL',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export interface Seller {
    id: string;
    name: string;
    email: string;
    mobile?: string | null;
    emailVerified: boolean;
    mobileVerified: boolean;
    status: SellerStatus;
    rejectionReason?: string | null;
    createdAt: string;
    updatedAt: string;
    onboarding?: {
        businessName: string;
        submittedAt: string;
    } | null;
}

export interface ListSellersQuery {
    status?: SellerStatus;
    search?: string;
    page?: number;
    limit?: number;
}

export interface ListSellersResponse {
    items: Seller[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
