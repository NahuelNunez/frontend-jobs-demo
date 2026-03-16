import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

export function useSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Crear conexión al socket
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
    });

    newSocket.on("connect", () => {
      console.log("Conectado a Socket.IO");
      setIsConnected(true);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Error de conexión:", error.message);
      setIsConnected(false);
    });

    newSocket.on("disconnect", () => {
      console.log("Desconectado de Socket.IO");
      setIsConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  return { socket, isConnected };
}

export function useChatSocket(chatId: string | null, socket: Socket | null) {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  useEffect(() => {
    if (!socket || !chatId) return;

    // Unirse al chat
    socket.emit("join_chat", chatId);

    // Escuchar cuando alguien está escribiendo
    const handleUserTyping = (data: { userId: string; chatId: string }) => {
      if (data.chatId === chatId) {
        setTypingUser(data.userId);
        setIsTyping(true);
      }
    };

    const handleUserStopTyping = (data: { userId: string; chatId: string }) => {
      if (data.chatId === chatId) {
        setIsTyping(false);
        setTypingUser(null);
      }
    };

    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);

    return () => {
      socket.emit("leave_chat", chatId);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
    };
  }, [socket, chatId]);

  const emitTyping = () => {
    if (socket && chatId) {
      socket.emit("typing", { chatId });
    }
  };

  const emitStopTyping = () => {
    if (socket && chatId) {
      socket.emit("stop_typing", { chatId });
    }
  };

  return { isTyping, typingUser, emitTyping, emitStopTyping };
}
