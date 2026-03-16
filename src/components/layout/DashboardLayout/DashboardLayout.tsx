import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Home,
  MessageCircle,
  UserPen,
  FileText,
  LogOut,
  Menu,
  X,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "CONTRACTOR" | "PROVIDER";
}

export const DashboardLayout = ({
  children,
  userType,
}: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    navigate("/");
  };
  const { user } = useAuth();
  const userName = localStorage.getItem("username");
  const contratadorLinks = [
    { to: "/contractor", icon: Home, label: "Home" },
    {
      to: "/contractor/posts",
      icon: FileText,
      label: "Posts",
    },
    { to: "/contractor/chats", icon: MessageCircle, label: "Chats" },
    { to: "/contractor/profile", icon: UserPen, label: "My profile" },
  ];

  const proveedorLinks = [
    { to: "/provider", icon: Home, label: "Home" },

    {
      to: "/provider/create-post",
      icon: PlusCircle,
      label: "Create post",
    },
    { to: "/provider/chats", icon: MessageCircle, label: "Chats" },
    { to: "/provider/profile", icon: UserPen, label: "Edit profile" },
  ];

  const links = userType === "CONTRACTOR" ? contratadorLinks : proveedorLinks;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar TABLET DESKTOP */}
      <aside
        className={cn(
          "hidden md:block fixed left-0 top-0 z-40 h-screen  bg-card border-r border-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-[75px]",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              {sidebarOpen && (
                <span className="text-lg font-bold">VideoJobs</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <link.icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && (
                    <span className="font-medium">{link.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            {sidebarOpen && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold">
                  {userName
                    ? userName.charAt(0).toUpperCase()
                    : user?.email
                      ? user?.email.charAt(0).toUpperCase()
                      : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {userName || user?.email || "?"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {userType === "PROVIDER" ? "Provider" : "Contractor"}
                  </p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3",
                !sidebarOpen && "justify-center",
              )}
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && "Log Out"}
            </Button>
          </div>
        </div>
      </aside>

      {/* NAVBAR MOBILE */}

      <aside
        className={cn(
          "md:hidden fixed  top-16 z-40 h-screen animate-slide-left   bg-card  transition-all duration-300",
          mobileSidebarOpen ? "w-75 " : `hidden`,
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gradient">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              {mobileSidebarOpen && (
                <span className="text-lg font-bold">VideoJobs</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col   h-[600px] p-4 space-y-10">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <link.icon className="w-5 h-5 shrink-0" />
                  {mobileSidebarOpen && (
                    <span className="font-medium">{link.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-border">
            {mobileSidebarOpen && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold">
                  {userName
                    ? userName.charAt(0).toUpperCase()
                    : user?.email
                      ? user?.email.charAt(0).toUpperCase()
                      : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate ">
                    {userName || user?.email || "?"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {userType === "PROVIDER" ? "Provider" : "Contractor"}
                  </p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3",
                !mobileSidebarOpen && "justify-center",
              )}
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 " />
              {mobileSidebarOpen && <span className="">Log Out</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? "md:ml-64" : "md:ml-20",
        )}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-card/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between h-full px-6">
            <Button
              className="hidden md:flex"
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
            <Button
              className="md:hidden"
              variant="ghost"
              size="icon"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              {mobileSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>

            <div className="flex items-center gap-4">
              <NotificationBell />
            </div>
          </div>
        </header>

        {/* Page content */}

        <main className={`p-2 ${mobileSidebarOpen ? "blur-2xl" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
