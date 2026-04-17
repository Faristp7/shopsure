import { apiService } from './api';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TicketType = 'DISPUTE' | 'PAYMENT' | 'RETURN' | 'LISTING' | 'SHIPPING' | 'OTHER';

export interface TicketMessage {
  id: string;
  authorName: string;
  isSupport: boolean;
  body: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  type: TicketType;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketInput {
  subject: string;
  type: TicketType;
  priority: TicketPriority;
  message: string;
}

export interface ReplyTicketInput {
  message: string;
}

const SELLER_BASE = 'v1/seller/support/tickets';
const ADMIN_BASE = 'v1/admin/support/tickets';

export const supportService = {
  // Seller
  getTickets(page = 1, status?: TicketStatus): Promise<{ data: Ticket[]; total: number }> {
    const q = new URLSearchParams({ page: String(page) });
    if (status) q.set('status', status);
    return apiService.get(`${SELLER_BASE}?${q}`);
  },
  getTicket(ticketId: string): Promise<Ticket> {
    return apiService.get(`${SELLER_BASE}/${ticketId}`);
  },
  createTicket(input: CreateTicketInput): Promise<Ticket> {
    return apiService.post(SELLER_BASE, input);
  },
  replyToTicket(ticketId: string, input: ReplyTicketInput): Promise<Ticket> {
    return apiService.post(`${SELLER_BASE}/${ticketId}/reply`, input);
  },
  closeTicket(ticketId: string): Promise<Ticket> {
    return apiService.post(`${SELLER_BASE}/${ticketId}/close`);
  },

  // Admin
  getAllTickets(page = 1, status?: TicketStatus): Promise<{ data: Ticket[]; total: number; totalPages: number }> {
    const q = new URLSearchParams({ page: String(page) });
    if (status) q.set('status', status);
    return apiService.get(`${ADMIN_BASE}?${q}`);
  },
  adminReplyToTicket(ticketId: string, message: string): Promise<Ticket> {
    return apiService.post(`${ADMIN_BASE}/${ticketId}/reply`, { message });
  },
  resolveTicket(ticketId: string): Promise<Ticket> {
    return apiService.post(`${ADMIN_BASE}/${ticketId}/resolve`);
  },
};
