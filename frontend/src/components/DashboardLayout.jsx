import { useState } from "react";
import {
  LayoutDashboard, CreditCard, Users, Package, FileText,
  BarChart3, TrendingUp, ClipboardList, KeyRound, ScrollText,
  Webhook, Settings, BookOpen, LifeBuoy, Search, Bell,
  ChevronDown, ExternalLink, ChevronRight, ArrowUpRight,
  ArrowDownRight, CircleDot, Zap,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/* ── Data ─────────────────────────────────────────────────────── */
const revenueData = [
  { month: "Jan", revenue: 42000, target: 38000 },
  { month: "Feb", revenue: 47500, target: 42000 },
  { month: "Mar", revenue: 44200, target: 45000 },
  { month: "Apr", revenue: 53800, target: 48000 },
  { month: "May", revenue: 61200, target: 52000 },
  { month: "Jun", revenue: 58900, target: 55000 },
  { month: "Jul", revenue: 67400, target: 60000 },
  { month: "Aug", revenue: 72100, target: 65000 },
];

const channelData = [
  { channel: "Organic", value: 34 },
  { channel: "Paid",    value: 28 },
  { channel: "Referral",value: 19 },
  { channel: "Direct",  value: 12 },
  { channel: "Social",  value: 7  },
];

const activity = [
  { id: 1, name: "Amara Osei",         action: "Upgraded to Pro",          time: "2m ago",  initials: "AO", color: "bg-violet-100 text-violet-700" },
  { id: 2, name: "Liu Wei",            action: "New signup via referral",   time: "14m ago", initials: "LW", color: "bg-sky-100 text-sky-700" },
  { id: 3, name: "Fatima Al-Zahrawi", action: "Cancelled subscription",    time: "1h ago",  initials: "FA", color: "bg-rose-100 text-rose-600" },
  { id: 4, name: "Marcus Brennan",     action: "Reached 1k API calls",     time: "2h ago",  initials: "MB", color: "bg-emerald-100 text-emerald-700" },
  { id: 5, name: "Priya Nair",         action: "Submitted support ticket", time: "3h ago",  initials: "PN", color: "bg-amber-100 text-amber-700" },
];

const metrics = [
  { label: "Gross revenue", value: "$447,120", change: "+18.2%", up: true,  note: "vs last quarter" },
  { label: "Active users",  value: "24,381",   change: "+6.4%",  up: true,  note: "vs last month"   },
  { label: "Churn rate",    value: "2.8%",     change: "−0.4%",  up: false, note: "vs last month"   },
  { label: "Avg. LTV",      value: "$1,840",   change: "+11.7%", up: true,  note: "per customer"    },
];

const plans = [
  { label: "Enterprise", count: "48",    pct: 62,  cls: "bg-indigo-500" },
  { label: "Pro",        count: "214",   pct: 81,  cls: "bg-sky-400"    },
  { label: "Starter",    count: "891",   pct: 45,  cls: "bg-emerald-400"},
  { label: "Free",       count: "3,240", pct: 100, cls: "bg-muted"      },
];

const miniStats = [
  { label: "MRR",  value: "$58.4K"  },
  { label: "ARR",  value: "$700.8K" },
  { label: "NPS",  value: "72"      },
  { label: "CSAT", value: "94%"     },
];

/* ── Sidebar nav ──────────────────────────────────────────────── */
const navSections = [
  {
    heading: null,
    items: [
      { id: "home",     label: "Home",     icon: LayoutDashboard, shortcut: "H" },
    ],
  },
  {
    heading: "Manage",
    items: [
      { id: "payments",  label: "Payments",  icon: CreditCard,    badge: null      },
      { id: "customers", label: "Customers", icon: Users,         badge: "24.3k"   },
      { id: "products",  label: "Products",  icon: Package,       badge: null      },
      { id: "invoices",  label: "Invoices",  icon: FileText,      badge: "3"       },
    ],
  },
  {
    heading: "Analytics",
    items: [
      { id: "overview",  label: "Overview",  icon: BarChart3,     shortcut: "O" },
      { id: "revenue",   label: "Revenue",   icon: TrendingUp,    shortcut: null },
      { id: "reports",   label: "Reports",   icon: ClipboardList, shortcut: null },
    ],
  },
  {
    heading: "Developer",
    items: [
      { id: "api",      label: "API keys",  icon: KeyRound,  badge: null   },
      { id: "logs",     label: "Logs",      icon: ScrollText, badge: "Live" },
      { id: "webhooks", label: "Webhooks",  icon: Webhook,   badge: null   },
    ],
  },
];

/* ── Custom tooltip ───────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
          <span>{p.dataKey === "revenue" ? "Revenue" : "Target"}</span>
          <span className="font-medium text-foreground ml-auto pl-3">
            ${p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

const fmt = (v) => `$${(v / 1000).toFixed(0)}k`;

/* ── Dashboard ────────────────────────────────────────────────── */
export default function Dashboard() {
  const [active, setActive]     = useState("overview");
  const [orgOpen, setOrgOpen]   = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">

      {/* ════════════════════════════════ SIDEBAR ══ */}
      <aside className="w-[220px] shrink-0 flex flex-col border-r bg-background overflow-y-auto">

        {/* Org switcher */}
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
              {["Production","Staging","Development"].map((env) => (
                <button key={env} onClick={() => setOrgOpen(false)}
                  className="w-full text-left px-3 py-2 hover:bg-accent transition-colors flex items-center justify-between">
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

        {/* Nav */}
        <nav className="flex-1 px-2 pb-3 space-y-4">
          {navSections.map((section) => (
            <div key={section.heading ?? "__top"}>
              {section.heading && (
                <p className="px-2 mb-1 text-[10.5px] font-semibold text-muted-foreground uppercase tracking-widest">
                  {section.heading}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map(({ id, label, icon: Icon, badge, shortcut }) => {
                  const isActive = active === id;
                  return (
                    <button key={id} onClick={() => setActive(id)}
                      className={`w-full flex items-center gap-2.5 px-2 py-[6px] rounded-md text-[13px] transition-all group ${
                        isActive
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}>
                      <Icon size={15} className={`shrink-0 ${isActive ? "text-indigo-600" : "text-muted-foreground group-hover:text-foreground"}`} />
                      <span className="flex-1 text-left truncate">{label}</span>
                      {badge && (
                        <Badge variant={badge === "Live" ? "default" : "secondary"}
                          className={`text-[10px] px-1.5 py-0 h-4 ${badge === "Live" ? "bg-emerald-500 hover:bg-emerald-500 text-white" : ""}`}>
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

        {/* Bottom links */}
        <div className="px-2 py-3 space-y-0.5">
          {[{ label: "Docs", icon: BookOpen, external: true }, { label: "Support", icon: LifeBuoy, external: true }, { label: "Settings", icon: Settings }].map(({ label, icon: Icon, external }) => (
            <button key={label}
              className="w-full flex items-center gap-2.5 px-2 py-[6px] rounded-md text-[13px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Icon size={15} className="shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {external && <ExternalLink size={11} className="text-muted-foreground/40" />}
            </button>
          ))}

          {/* User */}
          <div className="pt-2 mt-1 border-t flex items-center gap-2 px-2 py-1.5">
            <Avatar className="w-6 h-6 shrink-0">
              <AvatarFallback className="text-[9px] font-bold bg-indigo-100 text-indigo-700">JD</AvatarFallback>
            </Avatar>
            <span className="text-[12px] font-medium flex-1 truncate">Jamie Dlamini</span>
            <CircleDot size={11} className="text-emerald-500 shrink-0" />
          </div>
        </div>
      </aside>

      {/* ════════════════════════════════ MAIN ══ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="border-b bg-background px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[13px]">
            <span className="text-muted-foreground">Overview</span>
            <ChevronRight size={13} className="text-muted-foreground/40" />
            <span className="font-medium">August 2024</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <Button variant="outline" size="sm" className="text-[12px] h-7">Export</Button>
            <Button size="sm" className="text-[12px] h-7 bg-indigo-600 hover:bg-indigo-700">+ New report</Button>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/30">

          {/* KPIs */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {metrics.map((m) => (
              <Card key={m.label} className="shadow-none border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[12px] text-muted-foreground font-medium">{m.label}</p>
                    <Badge variant="outline"
                      className={`text-[10px] px-1.5 h-4 font-semibold border-0 ${
                        m.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                      }`}>
                      {m.up ? <ArrowUpRight size={9} className="mr-0.5" /> : <ArrowDownRight size={9} className="mr-0.5" />}
                      {m.change}
                    </Badge>
                  </div>
                  <p className="text-[22px] font-semibold tracking-tight">{m.value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{m.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <Card className="xl:col-span-2 shadow-none border">
              <CardHeader className="px-5 pt-4 pb-0 flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-[13px] font-semibold">Revenue vs target</CardTitle>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Jan – Aug 2024</p>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />Revenue
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/20 inline-block" />Target
                  </span>
                </div>
              </CardHeader>
              <CardContent className="px-5 pt-3 pb-4">
                <ResponsiveContainer width="100%" height={185}>
                  <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gTgt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={fmt} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="target"  stroke="#94a3b8" strokeWidth={1.5} fill="url(#gTgt)" dot={false} />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2}   fill="url(#gRev)" dot={false} activeDot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-none border">
              <CardHeader className="px-5 pt-4 pb-0">
                <CardTitle className="text-[13px] font-semibold">Acquisition channels</CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">Traffic mix this month</p>
              </CardHeader>
              <CardContent className="px-5 pt-3 pb-4">
                <ResponsiveContainer width="100%" height={185}>
                  <BarChart data={channelData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                    <YAxis dataKey="channel" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={52} />
                    <Tooltip formatter={(v) => [`${v}%`, "Share"]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="value" fill="#6366f1" radius={[0, 3, 3, 0]} maxBarSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">

            {/* Activity */}
            <Card className="xl:col-span-2 shadow-none border">
              <CardHeader className="px-5 py-3.5 flex flex-row items-center justify-between border-b">
                <CardTitle className="text-[13px] font-semibold">Recent activity</CardTitle>
                <Button variant="link" className="text-[12px] h-auto p-0 text-indigo-600">View all →</Button>
              </CardHeader>
              <CardContent className="p-0">
                {activity.map((item, i) => (
                  <div key={item.id}
                    className={`flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors ${i < activity.length - 1 ? "border-b" : ""}`}>
                    <Avatar className="w-7 h-7 shrink-0">
                      <AvatarFallback className={`text-[10px] font-bold ${item.color}`}>{item.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{item.action}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground/50 shrink-0 tabular-nums">{item.time}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Plan breakdown */}
            <Card className="shadow-none border">
              <CardHeader className="px-5 py-3.5 border-b">
                <CardTitle className="text-[13px] font-semibold">Plan breakdown</CardTitle>
              </CardHeader>
              <CardContent className="px-5 py-4 space-y-3.5">
                {plans.map((plan) => (
                  <div key={plan.label}>
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="font-medium">{plan.label}</span>
                      <span className="text-muted-foreground tabular-nums">{plan.count} users</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ${plan.cls}`}
                        style={{ width: `${plan.pct}%` }} />
                    </div>
                  </div>
                ))}

                <Separator className="my-1" />

                <div className="grid grid-cols-2 gap-2">
                  {miniStats.map((s) => (
                    <div key={s.label} className="bg-muted/50 rounded-md px-3 py-2">
                      <p className="text-[10.5px] text-muted-foreground">{s.label}</p>
                      <p className="text-[14px] font-semibold mt-0.5">{s.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}