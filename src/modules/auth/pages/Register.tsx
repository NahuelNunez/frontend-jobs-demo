import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Mail, Lock, ArrowRight, Users, Wrench } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import type { RegisterData } from "../services/auth.service";

export const Register = () => {
  const [searchParams] = useSearchParams();
  const defaultTipo = searchParams.get("tipo") as
    | "CONTRACTOR"
    | "PROVIDER"
    | null;

  const [tipoUsuario, setTipoUsuario] = useState<"CONTRACTOR" | "PROVIDER">(
    defaultTipo || "CONTRACTOR",
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    defaultValues: {
      role: "CONTRACTOR",
    },
  });

  const handleOnSubmit: SubmitHandler<RegisterData> = async (data) => {
    setIsLoading(true);

    try {
      await registerUser(data.email, data.password, tipoUsuario);
      toast.success("Account created successfully");
      navigate("/register/verifyEmail");
    } catch (error: any) {
      console.error("Register error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to register. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Decoration */}
      <div className="hidden lg:flex flex-1 bg-gradient-hero items-center justify-center p-12">
        <div className="text-primary-foreground text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">Start connecting today</h2>
          <p className="text-primary-foreground/80">
            Create your free account and access thousands of job opportunities
            or find the best professionals for your projects.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">VideoJobs</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-8">
            Select your account type and complete your information
          </p>

          {/* Account type selector */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setTipoUsuario("CONTRACTOR")}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-300",
                tipoUsuario === "CONTRACTOR"
                  ? "border-primary bg-blue-50 shadow-md"
                  : "border-border hover:border-primary/50",
              )}
            >
              <Users
                className={cn(
                  "w-8 h-8 mx-auto mb-2",
                  tipoUsuario === "CONTRACTOR"
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              />
              <p
                className={cn(
                  "font-semibold",
                  tipoUsuario === "CONTRACTOR"
                    ? "text-primary"
                    : "text-foreground",
                )}
              >
                Contractor
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Looking for professionals
              </p>
            </button>
            <button
              type="button"
              onClick={() => setTipoUsuario("PROVIDER")}
              className={cn(
                "p-4 rounded-xl border-2 transition-all duration-300",
                tipoUsuario === "PROVIDER"
                  ? "border-primary bg-blue-50 shadow-md"
                  : "border-border hover:border-primary/50",
              )}
            >
              <Wrench
                className={cn(
                  "w-8 h-8 mx-auto mb-2",
                  tipoUsuario === "PROVIDER"
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              />
              <p
                className={cn(
                  "font-semibold",
                  tipoUsuario === "PROVIDER"
                    ? "text-primary"
                    : "text-foreground",
                )}
              >
                Provider
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                I offer services
              </p>
            </button>
          </div>

          <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@email.com"
                  className="pl-10"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Must be a valid email",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  className="pl-10"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must have at least 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message:
                        "Password must contain at least one uppercase letter, one lowercase letter and one number",
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
