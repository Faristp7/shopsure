import { apiService } from './api';

export interface EarningsChartPoint {
  period: string;
  revenue: number;
  commission: number;
  net: number;
}

export interface PayoutSummary {
  totalRevenue: number;
  totalCommission: number;
  netEarnings: number;
  pendingPayout: number;
  paidOut: number;
  nextPayoutDate: string | null;
}

export interface Payout {
  id: string;
  initiatedAt: string;
  completedAt: string | null;
  gross: number;
  commission: number;
  net: number;
  status: 'PROCESSING' | 'PAID' | 'FAILED';
  orders: PayoutOrder[];
}

export interface PayoutOrder {
  orderId: string;
  orderValue: number;
  commission: number;
  net: number;
  paymentMethod: string;
  txnRef: string;
}

export interface Transaction {
  orderId: string;
  buyerName: string;
  orderDate: string;
  deliveryDate: string | null;
  value: number;
  platformFee: number;
  gatewayFee: number;
  net: number;
  settlement: 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED';
  settlementDate: string | null;
}

export interface BankAccount {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string | null;
}

const SELLER_BASE = 'v1/seller/payments';
const ADMIN_BASE = 'v1/admin/payments';

export const paymentsService = {
  // Seller
  getSummary(days = 30): Promise<PayoutSummary> {
    return apiService.get<PayoutSummary>(`${SELLER_BASE}/summary?days=${days}`);
  },
  getEarningsChart(days = 30, groupBy = 'daily'): Promise<EarningsChartPoint[]> {
    return apiService.get<EarningsChartPoint[]>(`${SELLER_BASE}/chart?days=${days}&groupBy=${groupBy}`);
  },
  getPayouts(page = 1): Promise<{ data: Payout[]; total: number }> {
    return apiService.get<{ data: Payout[]; total: number }>(`${SELLER_BASE}/payouts?page=${page}`);
  },
  getPayout(payoutId: string): Promise<Payout> {
    return apiService.get<Payout>(`${SELLER_BASE}/payouts/${payoutId}`);
  },
  getTransactions(page = 1, status?: string, search?: string): Promise<{ data: Transaction[]; total: number }> {
    const q = new URLSearchParams({ page: String(page) });
    if (status) q.set('status', status);
    if (search) q.set('search', search);
    return apiService.get<{ data: Transaction[]; total: number }>(`${SELLER_BASE}/transactions?${q}`);
  },
  getBankAccount(): Promise<BankAccount> {
    return apiService.get<BankAccount>(`${SELLER_BASE}/bank-account`);
  },
  updateBankAccount(data: Partial<BankAccount>): Promise<BankAccount> {
    return apiService.put<BankAccount>(`${SELLER_BASE}/bank-account`, data);
  },

  // Admin
  getAdminSummary(): Promise<{ totalSettled: number; totalPending: number; totalRefunds: number }> {
    return apiService.get(`${ADMIN_BASE}/summary`);
  },
  getAdminPayouts(page = 1): Promise<{ data: Payout[]; total: number; totalPages: number }> {
    return apiService.get(`${ADMIN_BASE}/payouts?page=${page}`);
  },
  processSellerPayout(sellerId: string): Promise<void> {
    return apiService.post(`${ADMIN_BASE}/sellers/${sellerId}/payout`);
  },

  // Buyer
  initiatePayment(orderId: string): Promise<{
    paymentId: string;
    providerOrderId: string;
    amount: number;
    currency: string;
    keyId: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    isMock: boolean;
  }> {
    return apiService.post(`v1/buyer/payments/${orderId}/initiate`);
  },
  verifyPayment(input: {
    orderId: string;
    providerOrderId: string;
    providerPaymentId: string;
    signature: string;
    isMock?: boolean;
  }): Promise<any> {
    return apiService.post('v1/buyer/payments/verify', input);
  },
};
