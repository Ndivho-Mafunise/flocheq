import Transaction from "../models/transaction.model.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const getReports = async (req, res) => {
  try {
    const { period = "monthly", year = new Date().getFullYear() } = req.query;
    const y = parseInt(year);

    // ── Step 1: Set up date range and grouping key ─────────────────────────
    const matchDate = {
      $gte: new Date(y, 0, 1),
      $lt:  new Date(y + 1, 0, 1),
    };

    // group by month or by quarter depending on the period param
    const groupBy = period === "quarterly"
      ? { year: { $year: "$date" }, quarter: { $ceil: { $divide: [{ $month: "$date" }, 3] } } }
      : { year: { $year: "$date" }, month: { $month: "$date" } };


    // ── Step 2: Fetch all report data in parallel ──────────────────────────
    const [byPeriod, byType] = await Promise.all([

      Transaction.aggregate([
        { $match: { status: "paid", date: matchDate } },
        { $group: { _id: groupBy, revenue: { $sum: "$amount" }, count: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.quarter": 1 } },
      ]),

      Transaction.aggregate([
        { $match: { status: "paid", date: matchDate } },
        { $group: { _id: "$type", revenue: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
    ]);


    // ── Step 3: Format period labels ───────────────────────────────────────
    const byPeriodFormatted = byPeriod.map((r) => ({
      period:  period === "quarterly" ? `Q${r._id.quarter}` : MONTHS[r._id.month - 1],
      year:    r._id.year,
      revenue: r.revenue,
      count:   r.count,
    }));

    const totalRevenue      = byPeriod.reduce((sum, r) => sum + r.revenue, 0);
    const totalTransactions = byPeriod.reduce((sum, r) => sum + r.count,   0);


    // ── Step 4: Send the response ──────────────────────────────────────────
    return res.status(200).json({
      success: true,
      data: {
        period,
        year: y,
        totalRevenue,
        totalTransactions,
        byPeriod: byPeriodFormatted,
        byType: byType.map((r) => ({
          type:    r._id,
          revenue: r.revenue,
          count:   r.count,
        })),
      },
    });
  } catch (error) {
    console.log("getReports error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load reports",
      error: error.message,
    });
  }
};
