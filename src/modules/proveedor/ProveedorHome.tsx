import { DashboardLayout } from "@/components/layout/DashboardLayout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Eye,
  FileText,
  MessageCircle,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  postulacionesService,
  type PostulacionesResponse,
} from "../contratador/services/postulaciones.service";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const ProveedorHome = () => {
  const [misPostulaciones, setMisPostulaciones] = useState<
    PostulacionesResponse[]
  >([]);
  const [, setIsLoading] = useState(false);
  const stats = [
    {
      label: "My Applications",
      value: "5",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      label: "Active Chats",
      value: "12",
      icon: MessageCircle,
      color: "text-cyan-500",
    },
    {
      label: "Profile Views",
      value: "89",
      icon: Eye,
      color: "text-green-500",
    },
    {
      label: "This Month",
      value: "+28%",
      icon: TrendingUp,
      color: "text-purple-500",
    },
  ];

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await postulacionesService.getPostulaciones();
        if (response) {
          setMisPostulaciones(response.data);
        }
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message || error.response?.data?.error;

        toast.error(errorMessage);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getPost();
  }, []);

  return (
    <DashboardLayout userType="PROVIDER">
      <div className="space-y-8">
        {/* Welcome section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="p-4">
            <h1 className="text-3xl font-bold mb-2">Hello, Provider!</h1>
            <p className="text-muted-foreground">
              Here's a summary of your activity
            </p>
          </div>
          <Link to="/provider/create-post">
            <Button size="lg">
              <PlusCircle className="w-5 h-5 mr-2" />
              New Application
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center",
                      stat.color,
                    )}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My postulations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Applications</CardTitle>
            <Link to="/dashboard/proveedor/mis-postulaciones">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {misPostulaciones.map((postulacion) => (
                <div
                  key={postulacion.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50"
                >
                  <div>
                    <h4 className="font-semibold">{postulacion.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {(postulacion as any).views || 4} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {postulacion.contacts || 2}
                      </span>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      postulacion.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700",
                    )}
                  >
                    {postulacion.status === "ACTIVE" ? "Actived" : "Paused"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Messages</CardTitle>
            <Link to="/proveedor/chats">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  nombre: "John Smith",
                  mensaje: "Hi, I need a quote",
                  hora: "5 min ago",
                },
                {
                  nombre: "Sarah Johnson",
                  mensaje: "Are you available tomorrow?",
                  hora: "20 min ago",
                },
                {
                  nombre: "Michael Brown",
                  mensaje: "Thank you for the excellent work",
                  hora: "1 hour ago",
                },
              ].map((msg, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center text-accent-foreground font-bold">
                    {msg.nombre.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{msg.nombre}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {msg.mensaje}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {msg.hora}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
