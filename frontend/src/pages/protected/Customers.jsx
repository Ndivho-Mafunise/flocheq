import { useState, useEffect } from "react";
import { ChevronRight, Search, Bell } from "lucide-react";

import { Button }    from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CUSTOMERS_URL = import.meta.env.VITE_CUSTOMERS_URL;

const PLAN_COLOR = {
  enterprise: "#6366f1",
  pro:        "#38bdf8",
  starter:    "#34d399",
  free:       "#94a3b8",
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
        <div className="flex items-center gap-2.5">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-foreground">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
          </button>
          <span className="w-px h-5 bg-border" />
          <Button variant="outline" size="sm" className="text-[12px] h-7">Import</Button>
          <Button size="sm" className="text-[12px] h-7 bg-indigo-600 hover:bg-indigo-700">
            + Add client
          </Button>
        </div>
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
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 px-5 py-3 border-b flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 px-3 h-8 border border-border rounded-md text-muted-foreground min-w-[240px] focus-within:border-indigo-600 focus-within:ring-[3px] focus-within:ring-indigo-600/[0.18] transition-all">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search clients…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="border-0 outline-0 bg-transparent text-[13px] text-foreground w-full placeholder:text-muted-foreground"
              />
            </div>
            {/* Plan pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {["", "enterprise", "pro", "starter", "free"].map((p) => (
                <button
                  key={p || "all-plan"}
                  onClick={() => { setPlanFilter(p); setPage(1); }}
                  className={`px-3 py-1 text-[12px] border rounded-full transition-colors ${
                    planFilter === p
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                  }`}
                >
                  {p ? p.charAt(0).toUpperCase() + p.slice(1) : "All"}
                </button>
              ))}
            </div>
          </div>

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
                            <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PLAN_COLOR[c.plan] }} />
                              <span className="capitalize">{c.plan}</span>
                            </span>
                          </td>

                          {/* LTV */}
                          <td className="px-5 py-3 text-right font-medium tabular-nums">
                            ${c.ltv.toLocaleString()}
                          </td>

                          {/* Status pill */}
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              c.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-600"
                            }`}>
                              {c.status === "active" ? "Active" : "Churned"}
                            </span>
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
