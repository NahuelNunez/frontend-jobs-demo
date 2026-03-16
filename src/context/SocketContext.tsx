import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { notificationService } from "../modules/notifications/services/notification.service";
import type { Notification } from "../modules/notifications/interfaces/notification.interface";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: Notification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<Socket | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Load initial notifications from REST API when user authenticates
  useEffect(() => {
    if (!token) {
      setNotifications([]);
      return;
    }
    notificationService
      .getNotifications()
      .then(setNotifications)
      .catch(console.error);
  }, [token]);

  // Manage socket connection lifecycle
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

    const newSocket = io(SOCKET_URL, {
      auth: { token },
    });

    newSocket.on("connect", () => setIsConnected(true));

    newSocket.on("connect_error", () => setIsConnected(false));

    newSocket.on("disconnect", () => setIsConnected(false));

    // Real-time notification from server
    newSocket.on("new_notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);

      // Show browser notification only when the page is not visible
      if (
        document.hidden &&
        "Notification" in window &&
        window.Notification.permission === "granted"
      ) {
        new window.Notification(notification.title, {
          body: notification.body,
          icon: "/favicon.ico",
          tag: notification.id,
        });
      }
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const markNotificationRead = useCallback((id: string) => {
    // Optimistic update in UI
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    // Persist via REST (fire and forget; socket emit also accepted by backend)
    notificationService.markAsRead(id).catch(() => {
      // Rollback on error
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    // Optimistic update in UI
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    // Persist via REST
    notificationService.markAllAsRead().catch(() => {
      // Reload from API on error
      notificationService
        .getNotifications()
        .then(setNotifications)
        .catch(console.error);
    });
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        notifications,
        unreadCount,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error("useSocketContext debe usarse dentro de SocketProvider");
  }
  return ctx;
};
