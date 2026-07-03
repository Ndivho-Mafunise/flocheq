import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../hooks/useTheme";

import {
  LayoutDashboard,
  CreditCard,
  Users,
  Package,
  FileText,
  BarChart3,
  ClipboardList,
  KeyRound,
  ScrollText,
  Webhook,
  Settings,
  BookOpen,
  LifeBuoy,
  Search,
  ChevronDown,
  ExternalLink,
  CircleDot,
  Zap,
  LogOut,
  Sun,
  Moon,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string | null;
  badge?: string;
  shortcut?: string;
}

interface NavSection {
  heading: string | null;
  items: NavItem[];
}

import { Badge }      from "@/components/ui/badge";
import { Separator }  from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ─────────────────────────────────────────────────────────────────────────────
// Maps each nav item id → the route it navigates to.
// Items with path: null are placeholders (not yet built).
// ─────────────────────────────────────────────────────────────────────────────
const navSections: NavSection[] = [
  {
    heading: null,
    items: [
      { id: "home",      label: "Home",      icon: LayoutDashboard, path: "/dashboard" },
    ],
  },
  {
    heading: "Manage",
    items: [
      { id: "payments",  label: "Payments",  icon: CreditCard,   path: "/payments" },
      { id: "customers", label: "Customers", icon: Users,        path: "/customers" },
      { id: "products",  label: "Products",  icon: Package,      path: null },
      { id: "invoices",  label: "Invoices",  icon: FileText,     path: null, badge: "3" },
    ],
  },
  {
    heading: "Analytics",
    items: [
      { id: "insights",  label: "Insights",  icon: BarChart3,    path: "/insights",  shortcut: "I" },
      { id: "reports",   label: "Reports",   icon: ClipboardList, path: "/reports" },
    ],
  },
  {
    heading: "Developer",
    items: [
      { id: "api",       label: "API keys",  icon: KeyRound,    path: null },
      { id: "logs",      label: "Logs",      icon: ScrollText,  path: null, badge: "Live" },
      { id: "webhooks",  label: "Webhooks",  icon: Webhook,     path: null },
    ],
  },
];

// derive the active sidebar id from the current URL
const pathToId: Record<string, string> = {
  "/dashboard": "home",
  "/payments":  "payments",
  "/customers": "customers",
  "/insights":  "insights",
  "/reports":   "reports",
};

function getInitials(name?: string) {
  if (!name) return "??";
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const { dark, toggle: toggleTheme } = useTheme();
  const [orgOpen, setOrgOpen] = useState(false);

  const active = pathToId[location.pathname] || "home";

  const handleNavClick = (path: string | null) => {
    if (path) navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userInitials = getInitials(user?.name);

  return (
    <div className={`flex h-screen bg-background text-foreground overflow-hidden font-sans${dark ? " dark" : ""}`}>

      {/* ══════════════════ SIDEBAR ══════════════════ */}
      <aside className="w-[220px] shrink-0 flex flex-col border-r bg-background overflow-y-auto">

        {/* Org / environment switcher */}
        <div className="px-3 pt-4 pb-3 border-b">
          <button
            onClick={() => setOrgOpen(!orgOpen)}
            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-accent transition-colors group"
          >
            <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center shrink-0">
              <Zap size={11} className="text-white" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[13px] font-semibold truncate leading-tight">SaaSboard Inc.</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Development</p>
            </div>
            <ChevronDown size={13} className="text-muted-foreground shrink-0" />
          </button>

          {orgOpen && (
            <div className="mt-1 rounded-md border bg-popover shadow-md overflow-hidden text-[12px]">
              {["Production", "Staging", "Development"].map((env) => (
                <button
                  key={env}
                  onClick={() => setOrgOpen(false)}
                  className="w-full text-left px-3 py-2 hover:bg-accent transition-colors flex items-center justify-between"
                >
                  <span>{env}</span>
                  {env === "Development" && <CircleDot size={11} className="text-emerald-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="px-3 py-2.5">
          <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md border bg-muted/40 hover:bg-muted transition-colors text-muted-foreground">
            <Search size={13} />
            <span className="text-[12px] flex-1 text-left">Search…</span>
            <kbd className="text-[10px] bg-background border rounded px-1 py-0.5 font-mono text-muted-foreground">/</kbd>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 pb-3 space-y-4">
          {navSections.map((section) => (
            <div key={section.heading ?? "__top"}>
              {section.heading && (
                <p className="px-2 mb-1 text-[10.5px] font-semibold text-muted-foreground uppercase tracking-widest">
                  {section.heading}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map(({ id, label, icon: Icon, badge, shortcut, path }) => {
                  const isActive = active === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleNavClick(path)}
                      className={`w-full flex items-center gap-2.5 px-2 py-[6px] rounded-md text-[13px] transition-all group ${
                        isActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      } ${!path ? "opacity-50 cursor-default" : ""}`}
                    >
                      <Icon
                        size={15}
                        className={`shrink-0 ${isActive ? "text-indigo-600" : "text-muted-foreground group-hover:text-foreground"}`}
                      />
                      <span className="flex-1 text-left truncate">{label}</span>
                      {badge && (
                        <Badge
                          variant={badge === "Live" ? "default" : "secondary"}
                          className={`text-[10px] px-1.5 py-0 h-4 ${badge === "Live" ? "bg-emerald-500 hover:bg-emerald-500 text-white" : ""}`}
                        >
                          {badge}
                        </Badge>
                      )}
                      {shortcut && !badge && (
                        <kbd className="text-[10px] font-mono text-muted-foreground/60">{shortcut}</kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <Separator />

        {/* Bottom links + logout + user */}
        <div className="px-2 py-3 space-y-0.5">
          {[
            { label: "Docs",     icon: BookOpen, external: true,  path: null         },
            { label: "Support",  icon: LifeBuoy, external: true,  path: null         },
            { label: "Settings", icon: Settings, external: false, path: "/settings"  },
          ].map(({ label, icon: Icon, external, path }) => (
            <button
              key={label}
              onClick={() => path && navigate(path)}
              className="w-full flex items-center gap-2.5 px-2 py-[6px] rounded-md text-[13px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Icon size={15} className="shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {external && <ExternalLink size={11} className="text-muted-foreground/40" />}
            </button>
          ))}

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2.5 px-2 py-[6px] rounded-md text-[13px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {dark ? <Sun size={15} className="shrink-0" /> : <Moon size={15} className="shrink-0" />}
            <span className="flex-1 text-left">{dark ? "Light mode" : "Dark mode"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-2 py-[6px] rounded-md text-[13px] text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={15} className="shrink-0" />
            <span className="flex-1 text-left">Log out</span>
          </button>

          <Separator className="my-1" />

          <div className="flex items-center gap-2 px-2 py-1.5">
            <Avatar className="w-6 h-6 shrink-0">
              <AvatarFallback className="text-[9px] font-bold bg-indigo-100 text-indigo-700">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium truncate">{user?.name || "User"}</p>
              {user?.email && (
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              )}
            </div>
            <CircleDot size={11} className="text-emerald-500 shrink-0" />
          </div>
        </div>
      </aside>

      {/* ══════════════════ PAGE CONTENT ══════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
