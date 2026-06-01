import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="relative">
      <Link to="/" className="fixed top-4 left-6 z-50 flex items-center rounded-xl px-3 py-1.5" style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 75%)" }}>
        <img src="/flocheq-logo-v2.png" alt="Flocheq" className="h-16 w-auto" />
      </Link>
      <Outlet />
    </div>
  );
}
