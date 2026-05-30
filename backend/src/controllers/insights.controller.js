import Transaction from "../models/transaction.model.js";
import Customer from "../models/customer.model.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const getInsights = async (req, res) => {
  try {
    // ── Step 1: Define time ranges we'll query against ─────────────────────
    const now            = new Date();
    const startOfMonth   = new Date(now.getFullYear(), now.getMonth(), 1);
    const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endLastMonth   = new Date(now.getFullYear(), now.getMonth(), 0);
    const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);

    // ── Step 2: Run all aggregations in parallel ───────────────────────────
    const [
      revenueByType,  // service vs product vs subscription breakdown
      monthlyRevenue, // 12-month trend
      topCustomers,   // top 5 by revenue paid
      thisMonthArr,   // this month's total
      lastMonthArr,   // last month's total for growth calc
      totalCustomers,
      newThisMonth,
    ] = await Promise.all([

      Transaction.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),

      Transaction.aggregate([
        { $match: { status: "paid", date: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id:     { year: { $year: "$date" }, month: { $month: "$date" } },
            revenue: { $sum: "$amount" },
            count:   { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      Transaction.aggregate([
        { $match: { status: "paid" } },
        {
          $group: {
            _id:   { id: "$customer", name: "$customerName" },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 5 },
      ]),

      Transaction.aggregate([
        { $match: { status: "paid", date: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      Transaction.aggregate([
        { $match: { status: "paid", date: { $gte: startLastMonth, $lte: endLastMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      Customer.countDocuments(),
      Customer.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ]);


    // ── Step 3: Calculate derived numbers ─────────────────────────────────
    const thisMonthTotal = thisMonthArr[0]?.total ?? 0;
    const lastMonthTotal = lastMonthArr[0]?.total ?? 0;
    const revenueGrowth  = lastMonthTotal > 0
      ? parseFloat(((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1))
      : 0;


    // ── Step 4: Shape the data for the frontend ────────────────────────────
    const monthlyData = monthlyRevenue.map((m) => ({
      month:   MONTHS[m._id.month - 1],
      year:    m._id.year,
      revenue: m.revenue,
      count:   m.count,
    }));

    const topCustomersList = topCustomers.map((c) => ({
      id:    c._id.id,
      name:  c._id.name,
      total: c.total,
      count: c.count,
    }));

    const revenueByTypeList = revenueByType.map((r) => ({
      type:  r._id,
      total: r.total,
      count: r.count,
    }));

    const allTypeRevenue = revenueByTypeList.reduce((sum, r) => sum + r.total, 0) || 1;
    const revenueByTypeWithPct = revenueByTypeList.map((r) => ({
      ...r,
      pct: Math.round((r.total / allTypeRevenue) * 100),
    }));


    // ── Step 5: Send the response ──────────────────────────────────────────
    return res.status(200).json({
      success: true,
      data: {
        revenueByType:   revenueByTypeWithPct,
        monthlyRevenue:  monthlyData,
        topCustomers:    topCustomersList,
        summary: {
          thisMonthRevenue:     thisMonthTotal,
          lastMonthRevenue:     lastMonthTotal,
          revenueGrowth,
          totalCustomers,
          newCustomersThisMonth: newThisMonth,
        },
      },
    });
  } catch (error) {
    console.log("getInsights error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load insights",
      error: error.message,
    });
  }
};
