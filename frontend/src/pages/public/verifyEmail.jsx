import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "./../../store/authStore";
import { MailCheck, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { verifyCode, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await verifyCode(code);
    if (res?.success === true) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-1 bg-indigo-600" />

          <div className="p-8">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5">
              <MailCheck size={22} className="text-indigo-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-1">
              Verify your email
            </h1>
            <p className="text-slate-500 text-sm mb-7">
              Enter the 6-digit code we sent to your email address.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="code" className="text-sm font-medium text-slate-700">
                  Verification code
                </Label>
                <Input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="text-center text-xl font-semibold tracking-[0.4em] h-12"
                  autoFocus
                  required
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2.5">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || code.length < 6}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="mr-2 animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Verify email"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft size={14} />
                Back to login
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          Didn't receive a code?{" "}
          <Link to="/register" className="text-black hover:underline font-medium">
            Re-register
          </Link>
        </p>
      </div>
    </div>
  );
}
