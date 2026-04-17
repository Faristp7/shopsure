import { apiService } from './api';

export interface AuditLog {
  id: string;
  action: string;
  actorName: string;
  actorRole: string;
  targetType: string;
  targetId: string;
  targetLabel: string;
  ipAddress: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

const BASE = 'v1/admin/audit-logs';

export const auditService = {
  getLogs(page = 1, search?: string, action?: string): Promise<{ data: AuditLog[]; total: number; totalPages: number }> {
    const q = new URLSearchParams({ page: String(page) });
    if (search) q.set('search', search);
    if (action) q.set('action', action);
    return apiService.get(`${BASE}?${q}`);
  },
};
