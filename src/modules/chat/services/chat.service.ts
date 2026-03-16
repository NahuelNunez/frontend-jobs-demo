import { api } from "@/lib/api";
import type {
  ChatListResponse,
  ChatResponse,
  MessagesResponse,
  SendMessageData,
} from "../interfaces/chat.interface";

export const chatService = {
  obtenerChatsUsuario: async (): Promise<ChatListResponse> => {
    const response = await api.get<ChatListResponse>("/chat");
    return response.data;
  },

  obtenerOCrearChat: async (postulacionId: string): Promise<ChatResponse> => {
    const response = await api.get<ChatResponse>(
      `/chat/postulacion/${postulacionId}`
    );
    return response.data;
  },

  obtenerMensajes: async (chatId: string): Promise<MessagesResponse> => {
    const response = await api.get<MessagesResponse>(
      `/chat/${chatId}/messages`
    );
    return response.data;
  },

  enviarMensaje: async (
    chatId: string,
    data: SendMessageData
  ): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>(
      `/chat/${chatId}/messages`,
      data
    );
    return response.data;
  },
};
