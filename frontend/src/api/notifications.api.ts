import api from './axios';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  link?: string;
}

export const getNotifications = (params?: Record<string, string | number>) =>
  api.get<{ data: Notification[]; total: number; unread_count: number }>('/notifications', { params });

export const markNotificationRead = (id: string) =>
  api.put<Notification>(`/notifications/${id}/read`);

export const markAllNotificationsRead = () =>
  api.put('/notifications/read-all');

export const deleteNotification = (id: string) =>
  api.delete(`/notifications/${id}`);
