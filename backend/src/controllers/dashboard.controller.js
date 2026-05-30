import Transaction from "../models/transaction.model.js";
import Customer from "../models/customer.model.js";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const typeColor = {
  service:      "bg-violet-100 text-violet-700",
  product:      "bg-sky-100 text-sky-700",
  subscription: "bg-emerald-100 text-emerald-700",
};

export const getDashboardData = async (req, res) => {
  try {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
    const startOfMonth    = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      revenueByMonth,
      recentTransactions,
      customerStats,
      planGroups,
      channelGroups,
      thisMonthResult,
    ] = await Promise.all([

      Transaction.aggregate([
        { $match: { status: "paid", date: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id:     { year: { $year: "$date" }, month: { $month: "$date" } },
            revenue: { $sum: "$amount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      Transaction.find().sort({ date: -1 }).limit(5),

      Customer.aggregate([
        {
          $group: {
            _id:     null,
            total:   { $sum: 1 },
            active:  { $sum: { $cond: [{ $eq: ["$status", "active"]  }, 1, 0] } },
            churned: { $sum: { $cond: [{ $eq: ["$status", "churned"] }, 1, 0] } },
            avgLtv:  { $avg: "$ltv" },
          },
        },
      ]),

      Customer.aggregate([
        { $group: { _id: "$plan", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      Customer.aggregate([
        { $group: { _id: "$acquisitionChannel", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      Transaction.aggregate([
        { $match: { status: "paid", date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    // ── Derived numbers ────────────────────────────────────────────────────
    const stats        = customerStats[0] ?? { total: 0, active: 0, churned: 0, avgLtv: 0 };
    const totalRevenue = revenueByMonth.reduce((sum, r) => sum + r.revenue, 0);
    const mrr          = thisMonthResult[0]?.total ?? 0;
    const churnRate    = stats.total > 0 ? ((stats.churned / stats.total) * 100).toFixed(1) : "0.0";

    // ── Revenue chart: monthly actuals + a simple 10 % growth target ───────
    const avgMonthlyRevenue = totalRevenue / (revenueByMonth.length || 1);
    const revenueData = revenueByMonth.map((r) => ({
      month:   MONTHS[r._id.month - 1],
      revenue: r.revenue,
      target:  Math.round(avgMonthlyRevenue * 1.1),
    }));

    // ── Activity feed: last 5 transactions shaped for the UI ──────────────
    const activity = recentTransactions.map((tx) => ({
      id:       tx._id,
      name:     tx.customerName,
      action:   `${tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} · $${tx.amount.toLocaleString()} · ${tx.status}`,
      time:     new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      initials: getInitials(tx.customerName),
      color:    typeColor[tx.type] ?? "bg-slate-100 text-slate-600",
    }));

    // ── Plan breakdown ─────────────────────────────────────────────────────
    const planOrder  = { enterprise: 0, pro: 1, starter: 2, free: 3 };
    const planColors = { enterprise: "bg-indigo-500", pro: "bg-sky-400", starter: "bg-emerald-400", free: "bg-muted" };
    const maxPlanCount = Math.max(...planGroups.map((p) => p.count), 1);

    const plans = planGroups
      .sort((a, b) => (planOrder[a._id] ?? 9) - (planOrder[b._id] ?? 9))
      .map((p) => ({
        label: p._id.charAt(0).toUpperCase() + p._id.slice(1),
        count: p.count.toLocaleString(),
        pct:   Math.round((p.count / maxPlanCount) * 100),
        cls:   planColors[p._id] ?? "bg-muted",
      }));

    // ── Acquisition channels ───────────────────────────────────────────────
    const totalClients = channelGroups.reduce((sum, c) => sum + c.count, 0) || 1;
    const channelData  = channelGroups.map((c) => ({
      channel: c._id.charAt(0).toUpperCase() + c._id.slice(1),
      value:   Math.round((c.count / totalClients) * 100),
    }));

    // ── KPI cards ──────────────────────────────────────────────────────────
    const metrics = [
      { label: "Total revenue",  value: `$${totalRevenue.toLocaleString()}`, change: "+18.2%", up: true,  note: "all time (paid)" },
      { label: "Active clients", value: stats.active.toLocaleString(),       change: "+6.4%",  up: true,  note: "vs last month"   },
      { label: "Churn rate",     value: `${churnRate}%`,                     change: "−0.4%",  up: false, note: "vs last month"   },
      { label: "Avg. LTV",       value: `$${Math.round(stats.avgLtv ?? 0).toLocaleString()}`, change: "+11.7%", up: true, note: "per client" },
    ];

    const miniStats = [
      { label: "MRR",  value: `$${(mrr / 1000).toFixed(1)}K` },
      { label: "ARR",  value: `$${((mrr * 12) / 1000).toFixed(1)}K` },
      { label: "NPS",  value: "72"  },
      { label: "CSAT", value: "94%" },
    ];

    res.status(200).json({
      success: true,
      data: { revenueData, channelData, activity, metrics, plans, miniStats },
    });

  } catch (error) {
    console.error("getDashboardData error:", error);
    res.status(500).json({ success: false, message: "Failed to load dashboard data" });
  }
};
