import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services/chat.service";
import { toast } from "sonner";
import type { SendMessageData, Message } from "../interfaces/chat.interface";

// Query keys
export const chatKeys = {
  all: ["chats"] as const,
  lists: () => [...chatKeys.all, "list"] as const,
  details: () => [...chatKeys.all, "detail"] as const,
  detail: (id: string) => [...chatKeys.details(), id] as const,
  messages: (id: string) => [...chatKeys.detail(id), "messages"] as const,
};

// Hook para obtener todos los chats del usuario
export const useChatsUsuario = () => {
  return useQuery({
    queryKey: chatKeys.lists(),
    queryFn: chatService.obtenerChatsUsuario,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });
};

// Hook para obtener o crear un chat desde una postulación
export const useObtenerOCrearChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postulacionId: string) =>
      chatService.obtenerOCrearChat(postulacionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al abrir el chat");
    },
  });
};

// Hook para obtener mensajes de un chat específico
export const useMensajesChat = (chatId: string | null) => {
  return useQuery({
    queryKey: chatKeys.messages(chatId || ""),
    queryFn: () => chatService.obtenerMensajes(chatId!),
    enabled: !!chatId,
    staleTime: 1000 * 10,
    refetchInterval: (query) => {
      return query.state.data && chatId ? 1000 * 30 : false;
    },
    gcTime: 1000 * 60 * 10,
  });
};

// Hook para enviar un mensaje con actualización optimista
export const useEnviarMensaje = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chatId,
      data,
    }: {
      chatId: string;
      data: SendMessageData;
      currentUserId: string;
    }) => chatService.enviarMensaje(chatId, data),
    onMutate: async ({ chatId, data, currentUserId }) => {
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(chatId) });

      const previousMessages = queryClient.getQueryData<{
        success: boolean;
        data: Message[];
      }>(chatKeys.messages(chatId));

      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        chatId,
        senderId: currentUserId,
        text: data.text,
        attachmentUrl: data.attachmentUrl,
        attachmentType: data.attachmentType,
        createdAt: new Date().toISOString(),
        sender: {
          id: currentUserId,
          email: "",
          role: "CONTRACTOR",
        },
      };

      queryClient.setQueryData<{ success: boolean; data: Message[] }>(
        chatKeys.messages(chatId),
        (old) => {
          if (!old) {
            return { success: true, data: [optimisticMessage] };
          }
          return { ...old, data: [...old.data, optimisticMessage] };
        }
      );

      return { previousMessages };
    },
    onError: (error: any, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messages(variables.chatId),
          context.previousMessages
        );
      }
      toast.error(error.message || "Error al enviar el mensaje");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(variables.chatId),
      });
      queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(variables.chatId),
      });
    },
  });
};
