import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  KeyRound,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ─────────────────────────────────────────
   ResetPassword
   Route: /reset-password/:token
   Store: resetPassword(token, { password, confirmPassword })
───────────────────────────────────────── */

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = [
  "",
  "bg-rose-400",
  "bg-amber-400",
  "bg-sky-400",
  "bg-emerald-500",
];
const strengthText = [
  "",
  "text-rose-500",
  "text-amber-500",
  "text-sky-500",
  "text-emerald-600",
];

export default function ResetPassword() {
  // ── Auth — matches your store signature exactly ───────────────
  const { resetPassword, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Token lives in the URL path: /reset-password/:token
  const { token } = useParams();

  // ── Local state ───────────────────────────────────────────────
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const strength = getStrength(password);
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Reset token is missing. Please request a new link.");
      return;
    }

    try {
      // Matches store: resetPassword(token, body)
      // backend only needs the new password value
      await resetPassword(token,password );
      setDone(true);
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Top accent */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-600" />

          <div className="p-8">
            {/* ── Success state ── */}
            {done ? (
              <div className="text-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} className="text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  Password reset!
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Your password has been updated. You can now sign in with your
                  new password.
                </p>
                <Button
                  className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                  onClick={() => navigate("/login")}
                >
                  Continue to login
                </Button>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5">
                  <KeyRound size={22} className="text-indigo-600" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-1">
                  Set new password
                </h1>
                <p className="text-slate-500 text-sm mb-7">
                  Choose a strong password you haven't used before.
                </p>

                {/* Missing token warning */}
                {!token && (
                  <div className="flex items-start gap-2 text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2.5 mb-5">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <p className="text-sm">
                      No reset token found. Please use the link from your email
                      or{" "}
                      <Link
                        to="/forgot-password"
                        className="underline font-medium"
                      >
                        request a new one
                      </Link>
                      .
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New password */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-700"
                    >
                      New password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPw ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        disabled={isLoading}
                        className="h-10 pr-10"
                        autoFocus
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Strength meter */}
                    {password.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i <= strength
                                  ? strengthColor[strength]
                                  : "bg-slate-100"
                              }`}
                            />
                          ))}
                        </div>
                        <p
                          className={`text-xs font-medium ${strengthText[strength]}`}
                        >
                          {strengthLabel[strength]}
                          {strength < 3 && (
                            <span className="text-slate-400 font-normal ml-1">
                              — try adding numbers, uppercase or symbols
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-slate-700"
                    >
                      Confirm password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError("");
                        }}
                        disabled={isLoading}
                        autoComplete="new-password"
                        className={`h-10 pr-10 ${
                          mismatch
                            ? "border-rose-400 focus-visible:ring-rose-300"
                            : ""
                        } ${
                          passwordsMatch
                            ? "border-emerald-400 focus-visible:ring-emerald-300"
                            : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        tabIndex={-1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {passwordsMatch && (
                      <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                        <ShieldCheck size={13} /> Passwords match
                      </p>
                    )}
                    {mismatch && (
                      <p className="text-xs text-rose-500 mt-1">
                        Passwords do not match.
                      </p>
                    )}
                  </div>

                  {/* Error banner */}
                  {error && (
                    <div className="flex items-start gap-2 text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2.5">
                      <AlertCircle size={15} className="mt-0.5 shrink-0" />
                      <p className="text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isLoading || !token}
                    className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={15} className="mr-2 animate-spin" />
                        Resetting password…
                      </>
                    ) : (
                      "Reset password"
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
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          Didn't request this?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
