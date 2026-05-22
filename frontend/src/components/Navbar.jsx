import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Navbar() {
  const { isAuthenticated, logout, user, isLoading } = useAuthStore();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* LOGO */}
        <Link
          to="/"
          className="
            flex
            items-center
            gap-2
            text-xl
            font-semibold
            tracking-tight
            text-slate-900
          "
        >
          <div className="w-7 h-7 rounded-full bg-indigo-600"></div>
          PayLa
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <Link to="/payments" className="hover:text-slate-900 transition">
           Payments
          </Link>

          {isAuthenticated && (
            <Link to="/dashboard" className="hover:text-slate-900 transition">
              Dashboard
            </Link>
          )}

          {!isAuthenticated && (
            <>
              <Link to="/login" className="hover:text-slate-900 transition">
                Login
              </Link>

              <Link to="/register" className="hover:text-slate-900 transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* USER NAME */}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-medium text-slate-800">
                  {user?.name || "User"}
                </span>

                <span className="text-xs text-slate-500">{user?.email}</span>
              </div>

              {/* LOGOUT */}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="
                  px-5
                  py-2
                  rounded-full
                  bg-red-600
                  text-white
                  text-sm
                  font-medium
                  hover:bg-red-700
                  disabled:opacity-70
                  transition
                "
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <Link
              to="/register"
              className="
                px-5
                py-2
                rounded-full
                bg-slate-900
                text-white
                text-sm
                font-medium
                hover:bg-slate-800
                transition
              "
            >
              Sign up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
