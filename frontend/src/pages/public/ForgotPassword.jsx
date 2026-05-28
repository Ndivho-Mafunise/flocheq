import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ─────────────────────────────────────────
   ForgotPassword
   Mirrors your auth pattern:
     useAuthStore  →  forgotPassword(email)
     useNavigate   →  back to /login
───────────────────────────────────────── */
export default function ForgotPassword() {
  const { forgotPassword, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!email.trim()) {
      setFormError("Please enter your email address.");
      return;
    }

    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      // authStore.error is already managed by the store
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-black via-slate-800 to-black" />

          <div className="p-8">
            {/* ── Sent state ── */}
            {sent ? (
              <div className="text-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  Check your email
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  We sent a password reset link to{" "}
                  <span className="font-medium text-slate-700">{email}</span>.
                  It may take a minute to arrive.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/login")}
                >
                  <ArrowLeft size={15} className="mr-2" />
                  Back to login
                </Button>
                <p className="text-xs text-slate-400 mt-4">
                  Didn't receive it?{" "}
                  <button
                    onClick={() => {
                      setSent(false);
                      setFormError("");
                    }}
                    className="text-black hover:underline font-medium"
                  >
                    Try again
                  </button>
                </p>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                {/* Icon */}
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-5">
                  <Mail size={22} className="text-black" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  Forgot password?
                </h1>
                <p className="text-slate-500 text-sm mb-7">
                  No worries — enter your email and we'll send you a reset link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email field */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFormError("");
                      }}
                      disabled={isLoading}
                      className={`h-10 ${formError || error ? "border-rose-400 focus-visible:ring-rose-300" : ""}`}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>

                  {/* Error message */}
                  {(formError || error) && (
                    <div className="flex items-start gap-2 text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2.5">
                      <AlertCircle size={15} className="mt-0.5 shrink-0" />
                      <p className="text-sm">{formError || error}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-10 bg-black hover:bg-slate-800 text-white font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={15} className="mr-2 animate-spin" />
                        Sending link…
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>
                </form>

                {/* Back to login */}
                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Back to login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-5">
          Remember your password?{" "}
          <Link to="/login" className="text-black hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
