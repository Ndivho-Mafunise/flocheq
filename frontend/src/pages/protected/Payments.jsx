import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

import { Badge }     from "@/components/ui/badge";
import { Button }    from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const TRANSACTIONS_URL = import.meta.env.VITE_TRANSACTIONS_URL;

// status → badge colours
const statusCls = {
  paid:     "bg-emerald-50 text-emerald-700",
  pending:  "bg-amber-50  text-amber-700",
  failed:   "bg-rose-50   text-rose-600",
  refunded: "bg-slate-100 text-slate-600",
};

// type → badge colours
const typeCls = {
  service:      "bg-indigo-50 text-indigo-700",
  product:      "bg-sky-50    text-sky-700",
  subscription: "bg-violet-50 text-violet-700",
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

export default function Payments() {
  const [data,         setData]         = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter,   setTypeFilter]   = useState("");
  const [page,         setPage]         = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit: 20 });
        if (statusFilter) params.set("status", statusFilter);
        if (typeFilter)   params.set("type",   typeFilter);

        const res  = await fetch(`${TRANSACTIONS_URL}?${params}`, { credentials: "include" });
        const json = await res.json();

        if (json.success) setData(json.data);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [statusFilter, typeFilter, page]);

  const transactions = data?.transactions ?? [];
  const summary      = data?.summary      ?? {};
  const pages        = data?.pages        ?? 1;

  return (
    <>
      {/* Header */}
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-[13px]">
          <span className="text-muted-foreground">Manage</span>
          <ChevronRight size={13} className="text-muted-foreground/40" />
          <span className="font-medium">Payments</span>
        </div>
        <Button size="sm" className="text-[12px] h-7 bg-indigo-600 hover:bg-indigo-700">
          + New payment
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-5 space-y-4 bg-muted/30">

        {/* Summary cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { label: "Total received", value: `$${(summary.totalRevenue  ?? 0).toLocaleString()}` },
            { label: "Pending",        value: `$${(summary.pendingAmount ?? 0).toLocaleString()}` },
            { label: "Success rate",   value: `${summary.successRate ?? 0}%` },
            { label: "Transactions",   value: (summary.totalCount ?? 0).toLocaleString() },
          ].map((card) => (
            <Card key={card.label} className="shadow-none border">
              <CardContent className="p-4">
                <p className="text-[12px] text-muted-foreground font-medium">{card.label}</p>
                <p className="text-[22px] font-semibold tracking-tight mt-1">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Transactions table card */}
        <Card className="shadow-none border">
          <CardHeader className="px-5 pt-4 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[13px] font-semibold">Transactions</CardTitle>

              {/* Type filter pills */}
              <div className="flex items-center gap-1">
                {["", "service", "product", "subscription"].map((t) => (
                  <button
                    key={t || "all-type"}
                    onClick={() => { setTypeFilter(t); setPage(1); }}
                    className={`px-2.5 py-1 text-[11px] rounded-md transition-colors ${
                      typeFilter === t
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {t ? t.charAt(0).toUpperCase() + t.slice(1) : "All types"}
                  </button>
                ))}
              </div>
            </div>

            {/* Status filter tabs */}
            <div className="flex items-center gap-0 mt-3 border-b">
              {["", "paid", "pending", "failed", "refunded"].map((s) => (
                <button
                  key={s || "all-status"}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`px-3 py-2 text-[12px] font-medium -mb-px transition-colors ${
                    statusFilter === s
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">Loading…</div>
            ) : transactions.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">No transactions found</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="border-b">
                        {["Customer", "Type", "Description", "Amount", "Status", "Date"].map((h) => (
                          <th
                            key={h}
                            className={`px-5 py-2.5 text-[11px] font-medium text-muted-foreground ${
                              h === "Amount" || h === "Date" ? "text-right" : "text-left"
                            }`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx._id} className="border-b last:border-0 hover:bg-muted/40 transition-colors">

                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="w-6 h-6 shrink-0">
                                <AvatarFallback className="text-[9px] font-bold bg-indigo-100 text-indigo-700">
                                  {getInitials(tx.customerName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium truncate max-w-[120px]">{tx.customerName}</span>
                            </div>
                          </td>

                          <td className="px-5 py-3">
                            <Badge className={`text-[10px] px-1.5 h-4 border-0 ${typeCls[tx.type] ?? ""}`}>
                              {tx.type}
                            </Badge>
                          </td>

                          <td className="px-5 py-3 text-muted-foreground">
                            <span className="truncate block max-w-[180px]">{tx.description || "—"}</span>
                          </td>

                          <td className="px-5 py-3 text-right font-medium tabular-nums">
                            ${tx.amount.toLocaleString()}
                          </td>

                          <td className="px-5 py-3">
                            <Badge className={`text-[10px] px-1.5 h-4 border-0 ${statusCls[tx.status] ?? ""}`}>
                              {tx.status}
                            </Badge>
                          </td>

                          <td className="px-5 py-3 text-right text-muted-foreground tabular-nums">
                            {formatDate(tx.date)}
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
