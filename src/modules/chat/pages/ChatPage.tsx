import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout/DashboardLayout";
import type { Chat } from "@/modules/chat/interfaces/chat.interface";
import { ChatList } from "@/modules/chat/pages/ChatList";
import { ChatWindow } from "@/modules/chat/pages/ChatWindow";
import { useChatSocket } from "@/modules/chat/hooks/useSocket";
import {
  useChatsUsuario,
  useObtenerOCrearChat,
} from "@/modules/chat/hooks/useChatsQuery";
import { useChatSocketSync } from "@/modules/chat/hooks/useChatSocketSync";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useSocketContext } from "@/context/SocketContext";
import { Card } from "@/components/ui/card";

interface ChatPageProps {
  userType: "CONTRACTOR" | "PROVIDER";
}

export const ChatPage = ({ userType }: ChatPageProps) => {
  const [searchParams] = useSearchParams();
  const postulacionId = searchParams.get("postulacion");
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // React Query hooks
  const { data: chatsData, isLoading } = useChatsUsuario();
  const crearChatMutation = useObtenerOCrearChat();

  const chats = chatsData?.data || [];

  // Usar el socket global del contexto (una sola conexión para toda la app)
  const { socket, isConnected } = useSocketContext();

  // Sincronizar mensajes recibidos por socket con React Query cache
  useChatSocketSync(selectedChatId, socket);

  // Configurar socket para el chat seleccionado (typing indicators)
  const { isTyping, emitTyping, emitStopTyping } = useChatSocket(
    selectedChatId,
    socket
  );

  // Manejar parámetro de postulación para crear/abrir chat (solo para contratador)
  useEffect(() => {
    if (
      postulacionId &&
      !isLoading &&
      chats.length >= 0 &&
      userType === "CONTRACTOR"
    ) {
      startChatWithApplication(postulacionId);
    }
  }, [postulacionId, isLoading, userType]);

  // Update selected chat when chat list changes
  useEffect(() => {
    if (selectedChatId && chats.length > 0) {
      const updatedChat = chats.find((c) => c.id === selectedChatId);
      if (updatedChat) {
        setSelectedChat(updatedChat);
      }
    }
  }, [chats, selectedChatId]);

  const startChatWithApplication = async (postId: string) => {
    try {
      const response = await crearChatMutation.mutateAsync(postId);
      const newChat = response.data;

      // Select the chat
      setSelectedChatId(newChat.id);
      setSelectedChat(newChat);

      toast.success("Chat opened successfully");
    } catch (error: any) {
      console.error("Error creating/opening chat:", error);
      // The error is already shown in the hook
    }
  };

  const handleSelectChat = async (chatId: string) => {
    setSelectedChatId(chatId);
    const chat = chats.find((c) => c.id === chatId);

    if (chat) {
      setSelectedChat(chat);
    }
  };

  return (
    <DashboardLayout userType={userType}>
      <div className="h-[calc(100vh-8rem)]">
        <Card className="h-full flex overflow-hidden flex-row">
          {/* Chat list */}
          <div className="w-80 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-bold mb-2">💬 Chats</h2>
              {isConnected ? (
                <p className="text-xs text-green-600 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Connected
                </p>
              ) : (
                <p className="text-xs text-red-600 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  Disconnected
                </p>
              )}
            </div>
            <ChatList
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
              isLoading={isLoading}
            />
          </div>

          {/* Main area - Chat */}
          <div className="flex-1">
            <ChatWindow
              chat={selectedChat}
              currentUserId={user?.id || ""}
              socket={socket}
              isTyping={isTyping}
              onTyping={emitTyping}
              onStopTyping={emitStopTyping}
            />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};
