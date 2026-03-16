import type { Chat } from "../interfaces/chat.interface";

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

export function ChatListItem({ chat, isActive, onClick }: ChatListItemProps) {
  const lastMessage = chat.messages[chat.messages.length - 1];

  return (
    <div
      onClick={onClick}
      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
        isActive ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-semibold text-gray-900 truncate flex-1">
          {chat.provider.title || chat.provider.fullName}
        </h3>
        {lastMessage && (
          <span className="text-xs text-gray-500 ml-2">
            {new Date(lastMessage.createdAt).toLocaleTimeString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      {lastMessage && (
        <p className="text-sm text-gray-600 truncate">
          {lastMessage.sender.email}: {lastMessage.text || "(adjunto)"}
        </p>
      )}

      {!lastMessage && (
        <p className="text-sm text-gray-400 italic">Sin mensajes</p>
      )}
    </div>
  );
}

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  isLoading?: boolean;
}

export function ChatList({
  chats,
  selectedChatId,
  onSelectChat,
  isLoading,
}: ChatListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Cargando chats...</div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No tienes conversaciones</p>
          <p className="text-sm">
            Los chats aparecerán aquí cuando tengas postulaciones
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isActive={selectedChatId === chat.id}
          onClick={() => onSelectChat(chat.id)}
        />
      ))}
    </div>
  );
}
