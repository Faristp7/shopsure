import { apiService } from './api';

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  gstRate: string;
  lineTotal: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  status: string;
  paymentMethod: string;
  currency: string;
  couponCode: string | null;
  discountAmount: string;
  shippingAddress: ShippingAddress | null;
  subtotalAmount: string;
  shippingAmount: string;
  taxAmount: string;
  totalAmount: string;
  commissionAmount: string;
  sellerPayableAmount: string;
  items: OrderItem[];
  placedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummary {
  id: string;
  status: string;
  paymentMethod: string;
  couponCode: string | null;
  totalAmount: string;
  currency: string;
  itemCount: number;
  items: { productTitle: string; quantity: number }[];
  placedAt: string | null;
  createdAt: string;
}

export interface CreateOrderInput {
  shippingName: string;
  shippingPhone: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  paymentMethod?: 'COD' | 'PREPAID';
  couponCode?: string;
}

const BUYER_BASE = 'v1/buyer/orders';
const SELLER_BASE = 'v1/seller/orders';
const ADMIN_BASE = 'v1/admin/orders';

export const ordersService = {
  createOrder(input: CreateOrderInput): Promise<Order> {
    return apiService.post<Order>(BUYER_BASE, input);
  },

  getBuyerOrders(): Promise<OrderSummary[]> {
    return apiService.get<OrderSummary[]>(BUYER_BASE);
  },

  getBuyerOrder(orderId: string): Promise<Order> {
    return apiService.get<Order>(`${BUYER_BASE}/${orderId}`);
  },

  cancelOrder(orderId: string): Promise<Order> {
    return apiService.post<Order>(`${BUYER_BASE}/${orderId}/cancel`);
  },

  getSellerOrders(): Promise<any[]> {
    return apiService.get<any[]>(SELLER_BASE);
  },

  getSellerOrder(orderId: string): Promise<any> {
    return apiService.get<any>(`${SELLER_BASE}/${orderId}`);
  },

  confirmOrder(orderId: string): Promise<any> {
    return apiService.post<any>(`${SELLER_BASE}/${orderId}/confirm`);
  },

  shipOrder(orderId: string): Promise<any> {
    return apiService.post<any>(`${SELLER_BASE}/${orderId}/ship`);
  },

  deliverOrder(orderId: string): Promise<any> {
    return apiService.post<any>(`${SELLER_BASE}/${orderId}/deliver`);
  },

  getAdminOrders(page = 1, limit = 20): Promise<{ data: any[]; total: number; totalPages: number }> {
    return apiService.get<any>(`${ADMIN_BASE}?page=${page}&limit=${limit}`);
  },
};
