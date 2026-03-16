import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { LoginData } from "../services/auth.service";

export const Login = () => {
  const { login, isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const handleOnSubmit: SubmitHandler<LoginData> = async (data) => {
    const { email, password } = data;

    try {
      const user = await login(email, password);
      toast.success("Log in successful");
      if (user.role === "CONTRACTOR" && user.isVerified === true) {
        navigate("/contractor");
      } else if (user.role === "PROVIDER" && user.isVerified === true) {
        navigate("/provider");
      } else {
        navigate("/register/verifyEmail");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to log in. Please try again.";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>

            <span className="text-xl font-bold">VideoJobs</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Welcome</h1>
          <p className="text-muted-foreground mb-8">Sign in to your account.</p>

          <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  autoFocus
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
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
              disabled={isLoadingAuth}
            >
              {isLoadingAuth ? "Signing in..." : "Sign In"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <p className="mt-8 text-center text-muted-foreground">
            Dont have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decoration */}
      <div className="hidden lg:flex flex-1 bg-gradient-hero items-center justify-center p-12">
        <div className="text-primary-foreground text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">
            Connect with the best professionals
          </h2>
          <p className="text-primary-foreground/80">
            Thousands of contractors & providers trust in VideoJobs to find the
            best opportunities.
          </p>
        </div>
      </div>
    </div>
  );
};
