import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Logo from "./Logo";

export default function Navbar() {
  const { isAuthenticated, logout, user, isLoading } = useAuthStore();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#E9E5DC] bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-10">
          {[
            { label: "Home", path: "/" },
            { label: "About", path: "/about" },
            { label: "Pricing", path: "/pricing" },
            isAuthenticated
              ? { label: "Dashboard", path: "/dashboard" }
              : { label: "Login", path: "/login" },
          ].map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`text-[10.5px] uppercase tracking-[0.2em] transition-colors ${
                pathname === path
                  ? "font-semibold text-ink"
                  : "text-[#A6A49C] hover:text-ink"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* USER NAME */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-ink">
                  {user?.name || "User"}
                </span>

                <span className="text-xs text-[#A6A49C]">{user?.email}</span>
              </div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="inline-flex h-11 items-center rounded-full border border-brand-400 bg-white px-6 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-ink hover:bg-brand-400 disabled:opacity-70 transition"
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <Link
              to="/register"
              className="inline-flex h-11 items-center rounded-full border border-brand-400 bg-brand-400 px-6 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-ink hover:bg-brand-500 transition"
            >
              Sign up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
