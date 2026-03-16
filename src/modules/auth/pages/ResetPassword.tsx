import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useForm, type SubmitHandler } from "react-hook-form";
import { authService } from "../services/auth.service";

interface ResetPasswordData {
    newPassword: string;
    confirmPassword: string;
}

export const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") ?? "";
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordData>();

    const handleOnSubmit: SubmitHandler<ResetPasswordData> = async (data) => {
        if (!token) {
            toast.error("Invalid or missing reset token.");
            return;
        }

        try {
            await authService.resetPassword(token, data.newPassword);
            toast.success("Password reset successfully! Please sign in.");
            navigate("/login");
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Invalid or expired link. Please request a new one.";
            toast.error(errorMessage);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Invalid link</h1>
                    <p className="text-muted-foreground">
                        This reset link is invalid or has expired.
                    </p>
                    <Link to="/forgot-password">
                        <Button>Request a new link</Button>
                    </Link>
                </div>
            </div>
        );
    }

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

                    <h1 className="text-3xl font-bold mb-2">Set new password</h1>
                    <p className="text-muted-foreground mb-8">
                        Choose a strong password for your account.
                    </p>

                    <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    autoFocus
                                    id="newPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    {...register("newPassword", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must have at least 6 characters",
                                        },
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                            message:
                                                "Must contain at least one uppercase letter, one lowercase letter and one number",
                                        },
                                    })}
                                />
                            </div>
                            {errors.newPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.newPassword.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-10"
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: (value) =>
                                            value === watch("newPassword") ||
                                            "Passwords do not match",
                                    })}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save new password"}
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </form>
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
