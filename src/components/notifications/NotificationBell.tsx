import { Bell, CheckCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSocketContext } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

function requestBrowserPermission() {
  if (
    "Notification" in window &&
    window.Notification.permission === "default"
  ) {
    window.Notification.requestPermission();
  }
}

export const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useSocketContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  const chatPath =
    user?.role === "PROVIDER" ? "/provider/chats" : "/contractor/chats";

  const handleNotificationClick = (id: string, chatId: string | null) => {
    markNotificationRead(id);
    if (chatId) {
      navigate(chatPath);
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && requestBrowserPermission()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-0.5">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                markAllNotificationsRead();
              }}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <CheckCheck className="w-3 h-3" />
              Mark all messages as read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[360px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
              <Bell className="w-8 h-8 opacity-30" />
              <p className="text-sm">Whitout notifications</p>
            </div>
          ) : (
            notifications.slice(0, 30).map((notification) => (
              <div
                key={notification.id}
                onClick={() =>
                  handleNotificationClick(notification.id, notification.chatId)
                }
                className={`flex items-start gap-3 px-4 py-3 border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/50 ${
                  !notification.isRead ? "bg-primary/5" : ""
                }`}
              >
                {/* Icon */}
                <div
                  className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    !notification.isRead
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium leading-tight truncate">
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {notification.body}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {new Date(notification.createdAt).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer hint for browser notifications */}
        {"Notification" in window &&
          window.Notification.permission === "default" && (
            <div className="px-4 py-2 border-t bg-muted/30">
              <p className="text-[11px] text-muted-foreground text-center">
                Turn on the notifications for alerts in real time real
              </p>
            </div>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
