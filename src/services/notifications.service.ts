import { apiService } from './api';

export type NotificationType = 'ORDER' | 'PAYOUT' | 'SUPPORT' | 'ANNOUNCEMENT' | 'RETURN' | 'SYSTEM';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  isRead: boolean;
  linkUrl: string | null;
  createdAt: string;
}

export interface NotificationPreferences {
  newOrderAlerts: boolean;
  payoutUpdates: boolean;
  supportUpdates: boolean;
  marketing: boolean;
}

const BASE = 'v1/seller/notifications';

export const notificationsService = {
  getNotifications(page = 1): Promise<{ data: Notification[]; total: number; unreadCount: number }> {
    return apiService.get(`${BASE}?page=${page}`);
  },

  markAsRead(notificationId: string): Promise<void> {
    return apiService.patch(`${BASE}/${notificationId}/read`);
  },

  markAllAsRead(): Promise<void> {
    return apiService.post(`${BASE}/mark-all-read`);
  },

  getPreferences(): Promise<NotificationPreferences> {
    return apiService.get(`${BASE}/preferences`);
  },

  updatePreferences(prefs: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    return apiService.put(`${BASE}/preferences`, prefs);
  },
};
