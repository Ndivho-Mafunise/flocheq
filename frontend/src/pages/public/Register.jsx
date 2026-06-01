import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SignupForm } from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Brand panel */}
      <div
        className="hidden md:flex w-[44%] shrink-0 relative flex-col items-start justify-center p-12"
        style={{ background: "linear-gradient(155deg, #1e1b4b 0%, #312e81 55%, #4338ca 100%)" }}
      >
        {/* Copy — vertically centered */}
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em" }}>
            Payments infrastructure
          </p>
          <h1 className="text-[40px] font-bold leading-[1.08] mb-4" style={{ letterSpacing: "-0.025em", color: "#fff" }}>
            Start in minutes.<br />
            <span style={{ color: "#a5b4fc" }}>Scale forever.</span>
          </h1>
          <p className="text-[15px] leading-relaxed max-w-[360px]" style={{ color: "rgba(255,255,255,0.7)" }}>
            No setup fees, no hidden complexity. Plug into your app and get paid globally.
          </p>
        </div>

        {/* Stats — pinned to bottom */}
        <div className="absolute bottom-12 left-12 flex gap-9">
          <div>
            <p className="text-[26px] font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Free</p>
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.6)" }}>to get started</p>
          </div>
          <div>
            <p className="text-[26px] font-bold text-white" style={{ letterSpacing: "-0.02em" }}>2 min</p>
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.6)" }}>average integration</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 relative flex items-center justify-center bg-white p-10 overflow-y-auto">
        <Link to="/" className="absolute top-8 left-10 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={14} />
          Back to home
        </Link>
        <div className="w-full max-w-[380px]">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
