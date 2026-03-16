import { api } from "@/lib/api";
import type {
  Notification,
  NotificationsResponse,
} from "../interfaces/notification.interface";

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get<NotificationsResponse>("/notifications");
    return response.data.data;
  },

  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await api.patch("/notifications/read-all");
  },
};
