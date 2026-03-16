import { useState, useRef, useEffect } from "react";
import type { Chat, Message } from "../interfaces/chat.interface";
import { Socket } from "socket.io-client";
import { useEnviarMensaje, useMensajesChat } from "../hooks/useChatsQuery";
import { useChatSocketSync } from "../hooks/useChatSocketSync";

interface MessageBubbleProps {
  mensaje: Message;
  isOwnMessage: boolean;
}

function MessageBubble({ mensaje, isOwnMessage }: MessageBubbleProps) {
  return (
    <div
      className={`flex items-center ${
        isOwnMessage ? "justify-end" : "justify-start"
      } mb-3 px-2 animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-3 shadow-sm ${
          isOwnMessage
            ? "bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
            : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
        }`}
      >
        {!isOwnMessage && (
          <p className="text-xs font-semibold mb-1.5 text-blue-600">
            {mensaje.sender.email}
          </p>
        )}

        {mensaje.text && (
          <p className="text-sm leading-relaxed wrap-break-word">
            {mensaje.text}
          </p>
        )}

        {mensaje.attachmentUrl && (
          <div className="mt-2">
            {mensaje.attachmentType?.startsWith("image/") ? (
              <img
                src={mensaje.attachmentUrl}
                alt="Adjunto"
                className="max-w-full rounded-lg"
              />
            ) : (
              <a
                href={mensaje.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs underline ${
                  isOwnMessage ? "text-blue-100" : "text-blue-600"
                }`}
              >
                📎 Ver adjunto
              </a>
            )}
          </div>
        )}

        <p
          className={`text-[10px] mt-1.5 ${
            isOwnMessage ? "text-blue-100 text-right" : "text-gray-400"
          }`}
        >
          {new Date(mensaje.createdAt).toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

interface ChatWindowProps {
  chat: Chat | null;
  currentUserId: string;
  socket: Socket | null;
  isTyping: boolean;
  onTyping: () => void;
  onStopTyping: () => void;
}

export function ChatWindow({
  chat,
  currentUserId,
  socket,
  isTyping,
  onTyping,
  onStopTyping,
}: ChatWindowProps) {
  const [mensaje, setMensaje] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const enviarMensajeMutation = useEnviarMensaje();

  // Usar React Query como fuente única de verdad para los mensajes
  const { data: mensajesData } = useMensajesChat(chat?.id || null);
  const mensajes = mensajesData?.data || [];

  // Sincronizar mensajes recibidos por socket con React Query cache
  useChatSocketSync(chat?.id || null, socket);

  useEffect(() => {
    // Scroll al último mensaje cuando cambien los mensajes
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const handleMensajeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMensaje(e.target.value);

    // Emitir evento de "escribiendo"
    onTyping();

    // Cancelar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Establecer nuevo timeout para "dejó de escribir"
    typingTimeoutRef.current = setTimeout(() => {
      onStopTyping();
    }, 1000);
  };

  const handleEnviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mensaje.trim() || !chat || enviarMensajeMutation.isPending) return;

    try {
      onStopTyping();

      // Enviar mensaje mediante hook (con actualización optimista)
      await enviarMensajeMutation.mutateAsync({
        chatId: chat.id,
        data: { text: mensaje },
        currentUserId,
      });

      // El mensaje se agregará automáticamente:
      // 1. Optimísticamente en onMutate
      // 2. Vía Socket.IO cuando el servidor lo emita
      // 3. El hook useChatSocketSync actualizará el cache de React Query

      setMensaje("");
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      // El error ya se muestra en el hook
    }
  };

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg">Selecciona una conversación</p>
          <p className="text-sm">para empezar a chatear</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h2 className="font-semibold text-lg text-gray-900">
          {chat.provider.title || chat.provider.fullName}
        </h2>
        <p className="text-sm text-gray-500">
          {chat.provider.category || "Sin categoría"}
        </p>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {mensajes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md bg-white rounded-2xl shadow-md p-8">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-700 font-medium mb-2 text-lg">
                Inicia la conversación
              </p>
              <p className="text-gray-500 text-sm">
                Puedes preguntar sobre el servicio, disponibilidad, precios o
                cualquier detalle que necesites.
              </p>
            </div>
          </div>
        ) : (
          <>
            {mensajes.map((msg) => (
              <MessageBubble
                key={msg.id}
                mensaje={msg}
                isOwnMessage={msg.senderId === currentUserId}
              />
            ))}
            {isTyping && (
              <div className="flex justify-start mb-3 px-2">
                <div className="bg-white text-gray-600 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input de mensaje */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
        <form onSubmit={handleEnviarMensaje} className="flex gap-3">
          <input
            type="text"
            value={mensaje}
            onChange={handleMensajeChange}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={enviarMensajeMutation.isPending}
          />
          <button
            type="submit"
            disabled={!mensaje.trim() || enviarMensajeMutation.isPending}
            className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            {enviarMensajeMutation.isPending ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}
