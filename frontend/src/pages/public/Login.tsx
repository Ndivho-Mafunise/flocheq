import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";

const lightPanel = {
  background: `
    radial-gradient(ellipse 70% 50% at 50% -5%, rgba(124,58,237,0.10) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 90% 90%, rgba(124,58,237,0.06) 0%, transparent 55%),
    #F5F3FF
  `,
};

const dotGrid = {
  backgroundImage: "radial-gradient(circle, rgba(124,58,237,0.07) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

export default function LoginPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Brand panel */}
      <div
        className="hidden md:flex w-[44%] shrink-0 relative flex-col items-start justify-center p-12 overflow-hidden border-r border-[#E5E7EB]"
        style={lightPanel}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.6]" style={dotGrid} />

        {/* Logo — pinned to top */}
        <Link to="/" className="absolute top-10 left-12">
          <img src="/flocheq-logo-v2.png" alt="Flocheq" className="h-8 w-auto brightness-0 opacity-75" />
        </Link>

        {/* Copy — vertically centered */}
        <div className="relative">
          <p className="text-[10.5px] font-semibold uppercase tracking-widest mb-3 text-[#9CA3AF]" style={{ letterSpacing: "0.12em" }}>
            Payments infrastructure
          </p>
          <h1 className="text-[40px] font-bold leading-[1.08] mb-4 text-[#111111]" style={{ letterSpacing: "-0.025em" }}>
            Collect payments.<br />
            <span className="text-brand-600">Grow faster.</span>
          </h1>
          <p className="text-[15px] leading-relaxed max-w-[360px] text-[#4B5563]">
            Build, scale, and manage payments with a clean developer-first platform.
          </p>
          <ul className="mt-8 space-y-3">
            {["PCI DSS Level 1 certified", "135+ currencies supported", "Free 14-day trial"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-[13px] text-[#374151]">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600/10 border border-brand-600/20">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 2.5" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Stats — pinned to bottom */}
        <div className="absolute bottom-12 left-12 flex gap-9">
          <div>
            <p className="text-[26px] font-bold text-[#111111]" style={{ letterSpacing: "-0.02em" }}>$447K</p>
            <p className="text-[12px] text-[#9CA3AF]">tracked this quarter</p>
          </div>
          <div>
            <p className="text-[26px] font-bold text-[#111111]" style={{ letterSpacing: "-0.02em" }}>1,284</p>
            <p className="text-[12px] text-[#9CA3AF]">active clients</p>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 relative flex items-center justify-center bg-white p-10 overflow-y-auto">
        <Link to="/" className="absolute top-8 left-10 inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111111] transition-colors">
          <ArrowLeft size={14} />
          Back to home
        </Link>
        <div className="w-full max-w-[380px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
