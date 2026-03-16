import { DashboardLayout } from "@/components/layout/DashboardLayout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  FileText,
  MessageCircle,
  Users,
  TrendingUp,
  ArrowRight,
  Clock,
  Star,
} from "lucide-react";
import { usePostulaciones } from "./hooks/usePostulaciones";

export const ContratadorHome = () => {
  const { data: postulacionesData } = usePostulaciones();
  const stats = [
    {
      label: "Applications viewed",
      value: "124",
      icon: FileText,
      color: "text-blue-500",
    },
    {
      label: "Active chats",
      value: "8",
      icon: MessageCircle,
      color: "text-cyan-500",
    },
    {
      label: "Providers contacted",
      value: "32",
      icon: Users,
      color: "text-green-500",
    },
    {
      label: "This month",
      value: "+15%",
      icon: TrendingUp,
      color: "text-purple-500",
    },
  ];

  return (
    <DashboardLayout userType="CONTRACTOR">
      <div className="space-y-8">
        {/* Welcome section */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's a summary of your recent activity
          </p>
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
                      stat.color
                    )}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent postulations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent applications</CardTitle>
            <Link to="/contractor/postulaciones">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {postulacionesData?.data?.map((postulacion) => (
                <div
                  key={postulacion.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                      {postulacion.fullName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{postulacion.fullName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {postulacion.trade}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {postulacion.experience} years experience
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {postulacion.trade}
                    </div>
                    <Link to={`/contractor/chats`}>
                      <Button size="sm">Contact</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
