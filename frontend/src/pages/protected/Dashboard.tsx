import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import type { DashboardData } from "@/types/api";
import type { TooltipContentProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

import {
  ChevronRight,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { Badge }     from "@/components/ui/badge";
import { Button }    from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL;

function ChartTooltip({ active, payload, label }: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((point) => (
        <div key={String(point.dataKey)} className="flex items-center gap-2 text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: point.color }} />
          <span>{point.dataKey === "revenue" ? "Revenue" : "Target"}</span>
          <span className="font-medium text-foreground ml-auto pl-3">
            ${Number(point.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

const formatYAxis = (value: number) => `$${(value / 1000).toFixed(0)}k`;

export default function Dashboard() {
  const { user } = useAuthStore();

  const [dashData,    setDashData]    = useState<DashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch(DASHBOARD_URL, { credentials: "include" });
        const json     = await response.json();
        if (json.success) setDashData(json.data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setDataLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const revenueData = dashData?.revenueData ?? [];
  const channelData = dashData?.channelData ?? [];
  const activity    = dashData?.activity    ?? [];
  const metrics     = dashData?.metrics     ?? [];
  const plans       = dashData?.plans       ?? [];
  const miniStats   = dashData?.miniStats   ?? [];

  return (
    <>
      {/* Top bar */}
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-[13px]">
          <span className="text-muted-foreground">Overview</span>
          <ChevronRight size={13} className="text-muted-foreground/40" />
          <span className="font-medium">
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-muted-foreground hidden sm:block">
            Welcome back,{" "}
            <span className="font-medium text-foreground">{user?.name || "User"}</span>
          </span>
          <Separator orientation="vertical" className="h-5 hidden sm:block" />
          <Button variant="ghost" size="icon" className="relative h-8 w-8">
            <Bell size={16} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <Button variant="outline" size="sm" className="text-[12px] h-7">Export</Button>
          <Button size="sm" className="text-[12px] h-7 bg-indigo-600 hover:bg-indigo-700">
            + New report
          </Button>
        </div>
      </header>

      {/* Scrollable page body */}
      <main className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/30">

        {dataLoading && (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            Loading…
          </div>
        )}

        {!dataLoading && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {metrics.map((metric) => (
                <Card key={metric.label} className="shadow-none border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[12px] text-muted-foreground font-medium">{metric.label}</p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 h-4 font-semibold border-0 flex items-center gap-0.5 ${
                          metric.up ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                        }`}
                      >
                        {metric.up ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
                        {metric.change}
                      </Badge>
                    </div>
                    <p className="text-[22px] font-semibold tracking-tight">{metric.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{metric.note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">

              {/* Revenue vs Target area chart */}
              <Card className="xl:col-span-2 shadow-none border">
                <CardHeader className="px-5 pt-4 pb-0 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-[13px] font-semibold">Revenue vs target</CardTitle>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Jan – Aug 2024</p>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Revenue
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/20 inline-block" /> Target
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pt-3 pb-4">
                  <ResponsiveContainer width="100%" height={185}>
                    <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -22, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gTgt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#94a3b8" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <Tooltip content={ChartTooltip} />
                      <Area type="monotone" dataKey="target"  stroke="#94a3b8" strokeWidth={1.5} fill="url(#gTgt)" dot={false} />
                      <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2}   fill="url(#gRev)" dot={false} activeDot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Acquisition channels bar chart */}
              <Card className="shadow-none border">
                <CardHeader className="px-5 pt-4 pb-0">
                  <CardTitle className="text-[13px] font-semibold">Acquisition channels</CardTitle>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Traffic mix this month</p>
                </CardHeader>
                <CardContent className="px-5 pt-3 pb-4">
                  <ResponsiveContainer width="100%" height={185}>
                    <BarChart data={channelData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
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

              {/* Recent activity */}
              <Card className="xl:col-span-2 shadow-none border">
                <CardHeader className="px-5 py-3.5 flex flex-row items-center justify-between border-b">
                  <CardTitle className="text-[13px] font-semibold">Recent activity</CardTitle>
                  <Button variant="link" className="text-[12px] h-auto p-0 text-indigo-600">View all →</Button>
                </CardHeader>
                <CardContent className="p-0">
                  {activity.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors ${
                        index < activity.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <Avatar className="w-7 h-7 shrink-0">
                        <AvatarFallback className={`text-[10px] font-bold ${item.color}`}>
                          {item.initials}
                        </AvatarFallback>
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

              {/* Plan breakdown + mini stats */}
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
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${plan.cls}`}
                          style={{ width: `${plan.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <Separator className="my-1" />
                  <div className="grid grid-cols-2 gap-2">
                    {miniStats.map((stat) => (
                      <div key={stat.label} className="bg-muted/50 rounded-md px-3 py-2">
                        <p className="text-[10.5px] text-muted-foreground">{stat.label}</p>
                        <p className="text-[14px] font-semibold mt-0.5">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </>
  );
}
