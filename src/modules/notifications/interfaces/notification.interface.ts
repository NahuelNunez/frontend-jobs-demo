export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  chatId: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: Notification[];
}

export interface UnreadCountResponse {
  success: boolean;
  data: { count: number };
}
