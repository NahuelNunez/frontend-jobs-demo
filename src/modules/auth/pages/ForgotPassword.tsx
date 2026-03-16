import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { authService } from "../services/auth.service";

interface ForgotPasswordData {
    email: string;
}

export const ForgotPassword = () => {
    const [sent, setSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordData>();

    const handleOnSubmit: SubmitHandler<ForgotPasswordData> = async (data) => {
        try {
            await authService.forgotPassword(data.email);
            setSent(true);
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Something went wrong. Please try again.";
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

                    {sent ? (
                        <div className="text-center space-y-4">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                            <h1 className="text-3xl font-bold">Check your email</h1>
                            <p className="text-muted-foreground">
                                If that email is registered, we've sent a link to reset your
                                password. Check your inbox (and spam folder).
                            </p>
                            <Link to="/login">
                                <Button variant="outline" className="mt-4">
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold mb-2">Forgot password?</h1>
                            <p className="text-muted-foreground mb-8">
                                Enter your email and we'll send you a reset link.
                            </p>

                            <form
                                onSubmit={handleSubmit(handleOnSubmit)}
                                className="space-y-6"
                            >
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
                                        <p className="text-sm text-red-500">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Sending..." : "Send reset link"}
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </form>

                            <p className="mt-8 text-center text-muted-foreground">
                                Remember your password?{" "}
                                <Link
                                    to="/login"
                                    className="text-primary font-semibold hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </>
                    )}
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
