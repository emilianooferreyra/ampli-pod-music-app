import { create } from "zustand";

export type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (
    message: string,
    type: NotificationType,
    duration?: number
  ) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (message, type, duration = 3000) => {
    const id = Date.now().toString();
    const notification: Notification = {
      id,
      message,
      type,
      duration,
    };

    set((state) => ({
      notifications: [...state.notifications, notification],
    }));

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  removeNotification: (id: string) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),
}));
