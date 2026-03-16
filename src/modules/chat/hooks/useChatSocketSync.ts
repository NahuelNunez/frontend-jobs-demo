import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Socket } from "socket.io-client";
import type { Message } from "../interfaces/chat.interface";
import { chatKeys } from "./useChatsQuery";

/**
 * Hook que sincroniza los mensajes recibidos por Socket.IO con el cache de React Query
 * Esto asegura que React Query sea la fuente única de verdad
 */
export function useChatSocketSync(
  chatId: string | null,
  socket: Socket | null
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket || !chatId) return;

    const handleNewMessage = (newMessage: Message) => {
      // Solo procesar mensajes del chat actual
      if (newMessage.chatId !== chatId) return;

      // Actualizar el cache de mensajes del chat
      queryClient.setQueryData<{ success: boolean; data: Message[] }>(
        chatKeys.messages(chatId),
        (oldData) => {
          if (!oldData) {
            return { success: true, data: [newMessage] };
          }

          // Verificar si el mensaje ya existe (evitar duplicados)
          const messageExists = oldData.data.some(
            (msg) => msg.id === newMessage.id
          );
          if (messageExists) {
            return {
              ...oldData,
              data: oldData.data.map((msg) =>
                msg.id === newMessage.id ? newMessage : msg
              ),
            };
          }

          // Si hay mensajes temporales (optimistas), reemplazar el último temporal
          // con el mensaje real si coincide por contenido y remitente
          const messagesWithoutTemp = oldData.data.filter(
            (msg) => !msg.id.startsWith("temp-")
          );
          const lastTemp = oldData.data.find((msg) =>
            msg.id.startsWith("temp-")
          );

          if (
            lastTemp &&
            lastTemp.text === newMessage.text &&
            lastTemp.senderId === newMessage.senderId
          ) {
            return {
              ...oldData,
              data: [...messagesWithoutTemp, newMessage],
            };
          }

          return {
            ...oldData,
            data: [...oldData.data, newMessage],
          };
        }
      );

      // Actualizar también la lista de chats para reflejar el último mensaje
      queryClient.setQueryData<{ success: boolean; data: any[] }>(
        chatKeys.lists(),
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((chat) => {
              if (chat.id === chatId) {
                return {
                  ...chat,
                  messages: [...(chat.messages || []), newMessage],
                };
              }
              return chat;
            }),
          };
        }
      );
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, chatId, queryClient]);
}
