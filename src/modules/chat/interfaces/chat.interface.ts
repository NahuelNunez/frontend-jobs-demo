export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "CONTRACTOR" | "PROVIDER";
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text?: string;
  attachmentUrl?: string;
  attachmentType?: string;
  createdAt: string;
  sender: User;
}

export interface Provider {
  id: string;
  title: string | null;
  fullName: string;
  description?: string;
  category?: string;
  estimatedPrice?: number;
  status?: "ACTIVE" | "PAUSED" | "FINISHED";
}

export interface Chat {
  id: string;
  providerId: string;
  createdAt: string;
  provider: Provider;
  messages: Message[];
}

export interface ChatListResponse {
  success: boolean;
  data: Chat[];
}

export interface ChatResponse {
  success: boolean;
  data: Chat;
}

export interface MessagesResponse {
  success: boolean;
  data: Message[];
}

export interface SendMessageData {
  text?: string;
  attachmentUrl?: string;
  attachmentType?: string;
}

export interface SocketEvents {
  join_chat: (chatId: string) => void;
  leave_chat: (chatId: string) => void;
  typing: (data: { chatId: string }) => void;
  stop_typing: (data: { chatId: string }) => void;
  new_message: (message: Message) => void;
  user_typing: (data: { userId: string; chatId: string }) => void;
  user_stop_typing: (data: { userId: string; chatId: string }) => void;
}
