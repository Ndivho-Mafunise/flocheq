import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Button }    from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const REPORTS_URL = import.meta.env.VITE_REPORTS_URL;

// type → colour for the breakdown table dot
const typeColor = {
  service:      "bg-indigo-500",
  product:      "bg-sky-400",
  subscription: "bg-violet-500",
};

const currentYear = new Date().getFullYear();
const yearOptions = [currentYear, currentYear - 1, currentYear - 2];

export default function Reports() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [period,  setPeriod]  = useState("monthly");
  const [year,    setYear]    = useState(currentYear);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ period, year });
        const res    = await fetch(`${REPORTS_URL}?${params}`, { credentials: "include" });
        const json   = await res.json();
        if (json.success) setData(json.data);
      } catch (error) {
        console.error("Failed to load reports:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [period, year]);

  const byPeriod = data?.byPeriod ?? [];
  const byType   = data?.byType   ?? [];
  const total    = data?.totalRevenue      ?? 0;
  const txCount  = data?.totalTransactions ?? 0;

  return (
    <>
      {/* Header */}
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-[13px]">
          <span className="text-muted-foreground">Analytics</span>
          <ChevronRight size={13} className="text-muted-foreground/40" />
          <span className="font-medium">Reports</span>
        </div>
        <Button variant="outline" size="sm" className="text-[12px] h-7">Export CSV</Button>
      </header>

      <main className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/30">

        {/* Controls */}
        <div className="flex items-center gap-3">

          {/* Period toggle */}
          <div className="flex items-center rounded-md border bg-background overflow-hidden">
            {["monthly", "quarterly"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-[12px] font-medium transition-colors ${
                  period === p
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>

          {/* Year selector */}
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="px-3 py-1.5 text-[12px] rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">Loading…</div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="shadow-none border">
                <CardContent className="p-4">
                  <p className="text-[12px] text-muted-foreground font-medium">Total revenue — {year}</p>
                  <p className="text-[22px] font-semibold tracking-tight mt-1">${total.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card className="shadow-none border">
                <CardContent className="p-4">
                  <p className="text-[12px] text-muted-foreground font-medium">Total transactions — {year}</p>
                  <p className="text-[22px] font-semibold tracking-tight mt-1">{txCount.toLocaleString()}</p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue chart */}
            <Card className="shadow-none border">
              <CardHeader className="px-5 pt-4 pb-0">
                <CardTitle className="text-[13px] font-semibold">
                  Revenue by {period === "quarterly" ? "quarter" : "month"}
                </CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">{year} · paid transactions only</p>
              </CardHeader>
              <CardContent className="px-5 pt-3 pb-4">
                {byPeriod.length === 0 ? (
                  <div className="flex items-center justify-center h-[200px] text-sm text-muted-foreground">
                    No data for {year}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={byPeriod} margin={{ top: 0, right: 0, left: -22, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="period" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
                        contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      />
                      <Bar dataKey="revenue" fill="#6366f1" radius={[3, 3, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Breakdown by income type */}
            <Card className="shadow-none border">
              <CardHeader className="px-5 py-3.5 border-b">
                <CardTitle className="text-[13px] font-semibold">Revenue breakdown by type</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {byType.length === 0 ? (
                  <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                    No data for {year}
                  </div>
                ) : (
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="border-b">
                        <th className="px-5 py-2.5 text-left   text-[11px] font-medium text-muted-foreground">Type</th>
                        <th className="px-5 py-2.5 text-right  text-[11px] font-medium text-muted-foreground">Transactions</th>
                        <th className="px-5 py-2.5 text-right  text-[11px] font-medium text-muted-foreground">Revenue</th>
                        <th className="px-5 py-2.5 text-right  text-[11px] font-medium text-muted-foreground">Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byType.map((row) => {
                        const share = total > 0 ? Math.round((row.revenue / total) * 100) : 0;
                        return (
                          <tr key={row.type} className="border-b last:border-0 hover:bg-muted/40 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${typeColor[row.type] ?? "bg-muted"}`} />
                                <span className="capitalize font-medium">{row.type}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">{row.count}</td>
                            <td className="px-5 py-3 text-right font-medium tabular-nums">${row.revenue.toLocaleString()}</td>
                            <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${share}%` }} />
                                </div>
                                <span className="w-8 text-right">{share}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
