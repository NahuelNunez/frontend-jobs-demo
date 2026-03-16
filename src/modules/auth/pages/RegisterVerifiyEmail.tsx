import { useAuth } from "@/context/AuthContext";
import { CircleQuestionMark, Mail, SquareArrowOutUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { authService } from "../services/auth.service";
import { toast } from "sonner";

export const RegisterVerifiyEmail = () => {
  const { user } = useAuth();

  const handleResendVerifyEmail = async (email: string) => {
    try {
      const response = await authService.resendVerifyEmail(email);

      if (response) {
        toast.success("Verification Email sent successfully");
      }
    } catch (error: any) {
      const errorMesagge =
        error.response?.data?.error || error.response?.data?.message;
      console.log(error);
      toast.error(errorMesagge);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="bg-gradient-hero md:w-1/2   flex-1 flex  items-center justify-center p-8">
        <div className="max-w-xs space-y-5 p-2 ">
          <h1 className="text-4xl text-white leading-tight">
            You're almost there!
          </h1>
          <p className="text-blue-100 text-sm">
            Join thousands of professionals and start your journey today.
          </p>
          <div className="  justify-between items-center hidden md:flex">
            <div>
              <span className="text-white font-bold text-lg">10k+</span>
              <p className="text-blue-100 text-xs">Active Users</p>
            </div>
            <div>
              <span className="text-white font-bold text-lg">4.9/5</span>
              <p className="text-blue-100 text-xs">Rating</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex md:w-1/2 flex-col justify-center items-center p-8">
        <div className="max-w-sm w-full p-5 space-y-5">
          <div className="flex flex-col gap-1">
            <div className="w-14 h-14 flex justify-center items-center rounded-full bg-blue-50 ">
              <Mail className="text-blue-700 " />
            </div>
            <h1 className="text-2xl">Check your email</h1>
            <span className="text-muted-foreground text-sm">
              We've sent a verification link to{" "}
            </span>
            <span className="font-semibold text-black text-sm">
              {user?.email}
            </span>
          </div>
          <Link
            to={`https://mail.google.com/mail`}
            className="bg-blue-600 w-full flex justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 cursor-pointer transition-all items-center gap-1 text-white p-3 rounded-md"
          >
            <h2 className="text-xs font-semibold">Open Email App</h2>
            <SquareArrowOutUpRight className="w-[17px] h-[17px]" />
          </Link>
          <div className="flex flex-col text-xs gap-2 ">
            <span className="text-muted-foreground">
              Didn't receive the email?
            </span>
            <button
              onClick={() => handleResendVerifyEmail(user?.email ?? "")}
              className="text-blue-700 font-semibold cursor-pointer hover:text-blue-600 transition-all hover:underline"
            >
              Resend verification link
            </button>
          </div>

          <div className="flex items-center justify-between border-t-[0.2px]   border-t-gray-200">
            <div className="text-muted-foreground flex items-center mt-10 gap-2 text-xs">
              <CircleQuestionMark className="w-4 h-4" />{" "}
              <span className="text-xs">Contact Support</span>
            </div>
            <div className="text-muted-foreground  flex items-center mt-10 gap-2">
              <span className="text-xs">Privacy Policy</span>
              <span className="text-xs">Terms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
