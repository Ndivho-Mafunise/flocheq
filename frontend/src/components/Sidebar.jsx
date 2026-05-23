import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CircleDollarSign,
  CreditCard,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Payments",
    icon: CircleDollarSign,
    path: "/payments",
  },
  {
    label: "Billing",
    icon: CreditCard,
    path: "/billing",
  },
  {
    label: "Invoices",
    icon: ReceiptText,
    path: "/invoices",
  },
  {
    label: "Customers",
    icon: Users,
    path: "/customers",
  },
  {
    label: "Subscriptions",
    icon: BarChart3,
    path: "/subscriptions",
  },
  {
    label: "Payment Methods",
    icon: ShieldCheck,
    path: "/payment-methods",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, isLoading } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(15,23,42,0.92))] px-4 pb-4 pt-5 backdrop-blur-xl md:w-80">
      <div className="rounded-[28px] border border-white/10 bg-white/[0.03] px-4 py-4 shadow-[0_24px_80px_rgba(15,23,42,0.45)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 text-white shadow-[0_16px_40px_rgba(99,102,241,0.35)]">
            <Sparkles size={20} />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-violet-200/80">
              AdFlux
            </p>
            <h1 className="text-lg font-semibold text-white">
              Marketing Dashboard
            </h1>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-violet-400/20 bg-violet-500/10 px-3 py-3">
          <div className="flex items-center justify-between text-sm text-slate-200">
            <span>Growth score</span>
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-emerald-200">
              +18%
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-white">84.2%</p>
          <p className="mt-1 text-xs text-slate-300">
            Campaign performance is trending above target.
          </p>
        </div>
      </div>

      <nav className="mt-6 flex-1 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-violet-600 text-white shadow-[0_12px_30px_rgba(139,92,246,0.35)]"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-[24px] border border-white/10 bg-white/[0.03] px-4 py-4">
        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
          Team snapshot
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-white">24 active</p>
            <p className="text-sm text-slate-300">campaigns this week</p>
          </div>
          <div className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs text-emerald-200">
            live
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-950/80 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name || "Your account"}
            </p>
            <p className="truncate text-xs text-slate-400">
              {user?.email || "Manage your workspace"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          <LogOut size={18} />
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}
