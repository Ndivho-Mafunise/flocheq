import { useState, useEffect } from "react";
import { ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";

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
  Cell,
} from "recharts";

import { Badge }     from "@/components/ui/badge";
import { Button }    from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const INSIGHTS_URL = import.meta.env.VITE_INSIGHTS_URL;

// colour for each income type bar
const typeColor = {
  service:      "#6366f1",
  product:      "#38bdf8",
  subscription: "#8b5cf6",
};

function formatYAxis(value) {
  return `$${(value / 1000).toFixed(0)}k`;
}

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function Insights() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch(INSIGHTS_URL, { credentials: "include" });
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch (error) {
        console.error("Failed to load insights:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const summary       = data?.summary        ?? {};
  const monthlyData   = data?.monthlyRevenue ?? [];
  const topCustomers  = data?.topCustomers   ?? [];
  const revenueByType = data?.revenueByType  ?? [];

  // build horizontal bar data for income type chart
  const typeChartData = revenueByType.map((r) => ({
    type:  r.type.charAt(0).toUpperCase() + r.type.slice(1),
    value: r.pct,
    raw:   r.total,
  }));

  const growth     = summary.revenueGrowth ?? 0;
  const growthUp   = growth >= 0;
  const growthText = `${growthUp ? "+" : ""}${growth}%`;

  return (
    <>
      {/* Header */}
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-[13px]">
          <span className="text-muted-foreground">Analytics</span>
          <ChevronRight size={13} className="text-muted-foreground/40" />
          <span className="font-medium">Insights</span>
        </div>
        <Button variant="outline" size="sm" className="text-[12px] h-7">Export</Button>
      </header>

      <main className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/30">

        {loading ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">Loading…</div>
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              <Card className="shadow-none border">
                <CardContent className="p-4">
                  <p className="text-[12px] text-muted-foreground font-medium">This month</p>
                  <p className="text-[22px] font-semibold tracking-tight mt-1">
                    ${(summary.thisMonthRevenue ?? 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-none border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[12px] text-muted-foreground font-medium">MoM growth</p>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 h-4 font-semibold border-0 flex items-center gap-0.5 ${
                        growthUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                      }`}
                    >
                      {growthUp ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
                      {growthText}
                    </Badge>
                  </div>
                  <p className="text-[22px] font-semibold tracking-tight">
                    ${(summary.lastMonthRevenue ?? 0).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">last month</p>
                </CardContent>
              </Card>

              <Card className="shadow-none border">
                <CardContent className="p-4">
                  <p className="text-[12px] text-muted-foreground font-medium">Total customers</p>
                  <p className="text-[22px] font-semibold tracking-tight mt-1">
                    {(summary.totalCustomers ?? 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-none border">
                <CardContent className="p-4">
                  <p className="text-[12px] text-muted-foreground font-medium">New this month</p>
                  <p className="text-[22px] font-semibold tracking-tight mt-1">
                    {(summary.newCustomersThisMonth ?? 0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">

              {/* Monthly revenue trend */}
              <Card className="xl:col-span-2 shadow-none border">
                <CardHeader className="px-5 pt-4 pb-0">
                  <CardTitle className="text-[13px] font-semibold">Revenue trend</CardTitle>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Last 12 months (paid only)</p>
                </CardHeader>
                <CardContent className="px-5 pt-3 pb-4">
                  {monthlyData.length === 0 ? (
                    <div className="flex items-center justify-center h-[185px] text-sm text-muted-foreground">
                      No data yet
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={185}>
                      <AreaChart data={monthlyData} margin={{ top: 0, right: 0, left: -22, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gInsights" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                        <Tooltip
                          formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
                          contentStyle={{ fontSize: 12, borderRadius: 8 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#6366f1"
                          strokeWidth={2}
                          fill="url(#gInsights)"
                          dot={false}
                          activeDot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Revenue by income type */}
              <Card className="shadow-none border">
                <CardHeader className="px-5 pt-4 pb-0">
                  <CardTitle className="text-[13px] font-semibold">Income by type</CardTitle>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Service · Product · Subscription</p>
                </CardHeader>
                <CardContent className="px-5 pt-3 pb-4">
                  {typeChartData.length === 0 ? (
                    <div className="flex items-center justify-center h-[185px] text-sm text-muted-foreground">
                      No data yet
                    </div>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={130}>
                        <BarChart data={typeChartData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                          <YAxis dataKey="type" type="category" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={72} />
                          <Tooltip
                            formatter={(v, _name, props) => [
                              `$${props.payload.raw.toLocaleString()} (${v}%)`,
                              props.payload.type,
                            ]}
                            contentStyle={{ fontSize: 12, borderRadius: 8 }}
                          />
                          <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={12}>
                            {typeChartData.map((entry) => (
                              <Cell key={entry.type} fill={typeColor[entry.type.toLowerCase()] ?? "#6366f1"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>

                      {/* Type legend with dollar amounts */}
                      <div className="mt-3 space-y-1.5">
                        {revenueByType.map((r) => (
                          <div key={r.type} className="flex items-center justify-between text-[12px]">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ background: typeColor[r.type] ?? "#6366f1" }}
                              />
                              <span className="capitalize text-muted-foreground">{r.type}</span>
                            </div>
                            <span className="font-medium tabular-nums">${r.total.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Top customers */}
            <Card className="shadow-none border">
              <CardHeader className="px-5 py-3.5 border-b">
                <CardTitle className="text-[13px] font-semibold">Top customers by revenue</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {topCustomers.length === 0 ? (
                  <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">No data yet</div>
                ) : (
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="border-b">
                        <th className="px-5 py-2.5 text-left text-[11px] font-medium text-muted-foreground">Customer</th>
                        <th className="px-5 py-2.5 text-right text-[11px] font-medium text-muted-foreground">Transactions</th>
                        <th className="px-5 py-2.5 text-right text-[11px] font-medium text-muted-foreground">Total paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCustomers.map((c, i) => (
                        <tr key={c.id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <span className="text-[11px] text-muted-foreground w-4 tabular-nums">{i + 1}</span>
                              <Avatar className="w-6 h-6 shrink-0">
                                <AvatarFallback className="text-[9px] font-bold bg-indigo-100 text-indigo-700">
                                  {getInitials(c.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">{c.count}</td>
                          <td className="px-5 py-3 text-right font-medium tabular-nums">${c.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </>
  );
}
