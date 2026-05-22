import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./../../store/authStore";

export default function VerifyEmail() {
  const [code, setCode] = useState("");

  const navigate = useNavigate();

  const { verifyCode, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await verifyCode(code);
    if (res.success === true) {
      alert("email verified successfully");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-3xl
          shadow-xl
          border
          border-slate-200
          p-8
        "
      >
        {/* TITLE */}
        <div className="text-center mt-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Verify Your Email
          </h1>

          <p className="mt-3 text-slate-500 text-sm leading-relaxed">
            Enter the 6-digit verification code sent to your email address.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div
            className="
              mt-6
              bg-red-100
              border
              border-red-200
              text-red-600
              text-sm
              px-4
              py-3
              rounded-xl
            "
          >
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-8">
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            className="
              w-full
              text-center
              text-2xl
              font-semibold
              tracking-[10px]

              placeholder:text-base
              placeholder:font-normal
              placeholder:tracking-normal

              px-4
              py-4
              rounded-2xl
              border
              border-slate-300

              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
            "
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full
              mt-6
              bg-indigo-600
              hover:bg-indigo-700
              disabled:opacity-70

              text-white
              font-semibold
              py-3
              rounded-2xl
              transition
            "
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* BACK */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/login")}
            className="
              text-sm
              text-slate-500
              hover:text-slate-700
            "
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
