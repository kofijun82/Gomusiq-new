import { create } from 'zustand';
import { mockNotifications } from './mockData';
import { logger } from './logger';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  created_at: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  subscribeToNotifications: () => void;
  unsubscribeFromNotifications: () => void;
}

export const useNotifications = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock notifications
      const unreadCount = mockNotifications.filter(n => !n.read).length;
      set({ notifications: mockNotifications, unreadCount });
      
      logger.info('Notifications fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch notifications', error as Error);
      set({ error: 'Failed to fetch notifications' });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      // Update local state
      set(state => ({
        notifications: state.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      }));
      
      logger.info('Notification marked as read', { notificationId });
    } catch (error) {
      logger.error('Failed to mark notification as read', error as Error);
      set({ error: 'Failed to mark notification as read' });
    }
  },

  markAllAsRead: async () => {
    try {
      // Update local state
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      }));
      
      logger.info('All notifications marked as read');
    } catch (error) {
      logger.error('Failed to mark all notifications as read', error as Error);
      set({ error: 'Failed to mark all notifications as read' });
    }
  },

  subscribeToNotifications: () => {
    // In a real app, this would set up a WebSocket or polling
    logger.info('Subscribed to notifications');
  },

  unsubscribeFromNotifications: () => {
    // In a real app, this would clean up the subscription
    logger.info('Unsubscribed from notifications');
  },
}));