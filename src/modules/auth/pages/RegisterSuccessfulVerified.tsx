import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { authService } from "../services/auth.service";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle, PartyPopper } from "lucide-react";

export const RegisterSuccessfulVerified = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const token = searchParams.get("token");

  useEffect(() => {
    HandleVerifyEmail();
  }, []);

  const HandleVerifyEmail = async () => {
    setIsLoading(true);

    try {
      const response = await authService.verifyEmail(token!);
      if (response.data) {
        toast.success("Your account has been verified.");
      }
    } catch (error: any) {
      const msgError =
        error.response?.data?.error || error.response?.data?.message;
      console.error(error);
      toast.error(msgError);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen justify-center items-center">
        <Spinner></Spinner>
      </div>
    );
  }

  if (isLoading === false) {
    return (
      <div className="w-full min-h-screen flex flex-col md:flex-row">
        <div className="flex-1 bg-gradient-hero flex justify-center items-center">
          <div className="max-w-sm flex justify-center items-center flex-col text-center gap-3">
            <div className="w-14 h-14 flex justify-center text-white items-center rounded-full backdrop-blur-lg shadow-lg bg-white/5 border border-white/20">
              <PartyPopper />
            </div>
            <h1 className="text-white text-5xl font-extrabold">
              Welcome to the Team!
            </h1>
            <p className="text-gray-300 text-sm">
              Your journey starts here. Join our community of professionals and
              discover your next big opportunity today.
            </p>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="max-w-xs w-full text-center flex flex-col justify-center items-center gap-5">
            <div className="flex flex-col justify-center items-center gap-3">
              <div className="w-14 h-14 shadow-2xl  bg-green-100 flex justify-center items-center rounded-full ">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              </div>
              <h1 className="text-2xl">Account Verified!</h1>
              <p className="text-gray-500">
                Congratulations! Your email has been successfully verified.
                You're all set to start using VideoJobs.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer transition-all text-white text-xs p-5 rounded-sm font-semibold"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/login"
                className="bg-gray-200 hover:bg-gray-300 text-xs text-black font-semibold cursor-pointer transition-all p-5 rounded-sm"
              >
                Complete Your Profile
              </Link>
            </div>
            <div>
              <span className="text-xs text-gray-500">
                Having trouble?{" "}
                <span className="text-blue-700 text-xs">Contact Support</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
