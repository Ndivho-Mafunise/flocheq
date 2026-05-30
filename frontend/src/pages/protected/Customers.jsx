import { useState, useEffect } from "react";
import { ChevronRight, Search } from "lucide-react";

import { Badge }     from "@/components/ui/badge";
import { Button }    from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CUSTOMERS_URL = import.meta.env.VITE_CUSTOMERS_URL;

// plan → badge colours
const planCls = {
  enterprise: "bg-indigo-50 text-indigo-700",
  pro:        "bg-sky-50    text-sky-700",
  starter:    "bg-emerald-50 text-emerald-700",
  free:       "bg-slate-100 text-slate-600",
};

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}

export default function Customers() {
  const [data,       setData]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [page,       setPage]       = useState(1);

  // debounce the search so we don't fire on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit: 20 });
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (planFilter)      params.set("plan",   planFilter);

        const res  = await fetch(`${CUSTOMERS_URL}?${params}`, { credentials: "include" });
        const json = await res.json();

        if (json.success) setData(json.data);
      } catch (error) {
        console.error("Failed to load customers:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [debouncedSearch, planFilter, page]);

  const customers = data?.customers ?? [];
  const stats     = data?.stats     ?? {};
  const pages     = data?.pages     ?? 1;

  return (
    <>
      {/* Header */}
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-[13px]">
          <span className="text-muted-foreground">Manage</span>
          <ChevronRight size={13} className="text-muted-foreground/40" />
          <span className="font-medium">Customers</span>
        </div>
        <Button size="sm" className="text-[12px] h-7 bg-indigo-600 hover:bg-indigo-700">
          + Add customer
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/30">

        {/* Summary cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { label: "Total customers", value: (stats.total   ?? 0).toLocaleString() },
            { label: "Active",          value: (stats.active  ?? 0).toLocaleString() },
            { label: "Churned",         value: (stats.churned ?? 0).toLocaleString() },
            { label: "Avg. LTV",        value: `$${(stats.avgLtv ?? 0).toLocaleString()}` },
          ].map((card) => (
            <Card key={card.label} className="shadow-none border">
              <CardContent className="p-4">
                <p className="text-[12px] text-muted-foreground font-medium">{card.label}</p>
                <p className="text-[22px] font-semibold tracking-tight mt-1">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Customers table card */}
        <Card className="shadow-none border">
          <CardHeader className="px-5 pt-4 pb-3 border-b">
            <div className="flex items-center justify-between gap-4">

              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search customers…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-8 pr-3 py-1.5 text-[12px] rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Plan filter pills */}
              <div className="flex items-center gap-1">
                {["", "enterprise", "pro", "starter", "free"].map((p) => (
                  <button
                    key={p || "all-plan"}
                    onClick={() => { setPlanFilter(p); setPage(1); }}
                    className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                      planFilter === p
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {p ? p.charAt(0).toUpperCase() + p.slice(1) : "All plans"}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">Loading…</div>
            ) : customers.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">No customers found</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="border-b">
                        {["Customer", "Plan", "LTV", "Status", "Channel", "Joined"].map((h) => (
                          <th
                            key={h}
                            className={`px-5 py-2.5 text-[11px] font-medium text-muted-foreground ${
                              h === "LTV" ? "text-right" : "text-left"
                            }`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((c) => (
                        <tr key={c._id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">

                          {/* Customer name + email */}
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="w-6 h-6 shrink-0">
                                <AvatarFallback className="text-[9px] font-bold bg-indigo-100 text-indigo-700">
                                  {getInitials(c.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-medium truncate max-w-[140px]">{c.name}</p>
                                <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">{c.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Plan */}
                          <td className="px-5 py-3">
                            <Badge className={`text-[10px] px-1.5 h-4 border-0 ${planCls[c.plan] ?? ""}`}>
                              {c.plan}
                            </Badge>
                          </td>

                          {/* LTV */}
                          <td className="px-5 py-3 text-right font-medium tabular-nums">
                            ${c.ltv.toLocaleString()}
                          </td>

                          {/* Status dot + label */}
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  c.status === "active" ? "bg-emerald-500" : "bg-rose-400"
                                }`}
                              />
                              <span className="text-[12px] capitalize">{c.status}</span>
                            </div>
                          </td>

                          {/* Acquisition channel */}
                          <td className="px-5 py-3 text-muted-foreground capitalize">
                            {c.acquisitionChannel || "—"}
                          </td>

                          {/* Joined date */}
                          <td className="px-5 py-3 text-muted-foreground tabular-nums">
                            {formatDate(c.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-between px-5 py-3 border-t">
                    <span className="text-[12px] text-muted-foreground">Page {page} of {pages}</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-[12px] h-7" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" className="text-[12px] h-7" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
