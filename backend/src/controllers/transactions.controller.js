import Transaction from "../models/transaction.model.js";
import Customer from "../models/customer.model.js";

export const getTransactions = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;

    // build query filter from optional params
    const filter = {};
    if (status) filter.status = status;
    if (type)   filter.type   = type;

    // fetch paginated transactions + global summary in parallel
    const [transactions, total, summaryResult] = await Promise.all([
      Transaction.find(filter)
        .sort({ date: -1 })
        .skip((page - 1) * parseInt(limit))
        .limit(parseInt(limit)),

      Transaction.countDocuments(filter),

      Transaction.aggregate([
        {
          $group: {
            _id:           null,
            totalRevenue:  { $sum: { $cond: [{ $eq: ["$status", "paid"]    }, "$amount", 0] } },
            pendingAmount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] } },
            paidCount:     { $sum: { $cond: [{ $eq: ["$status", "paid"]    }, 1, 0] } },
            totalCount:    { $sum: 1 },
          },
        },
      ]),
    ]);

    const raw = summaryResult[0] ?? { totalRevenue: 0, pendingAmount: 0, paidCount: 0, totalCount: 0 };

    return res.status(200).json({
      success: true,
      data: {
        transactions,
        total,
        page:  parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        summary: {
          totalRevenue:  raw.totalRevenue,
          pendingAmount: raw.pendingAmount,
          totalCount:    raw.totalCount,
          successRate:   raw.totalCount > 0 ? Math.round((raw.paidCount / raw.totalCount) * 100) : 0,
        },
      },
    });
  } catch (error) {
    console.log("getTransactions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { customerId, amount, type, status, description, date } = req.body;

    // validation
    if (!customerId || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: "Customer, amount, and type are required",
      });
    }

    // check customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // create transaction
    const txStatus = status || "paid";
    const transaction = await Transaction.create({
      customer:     customerId,
      customerName: customer.name,
      amount,
      type,
      status:      txStatus,
      description: description || "",
      date:        date ? new Date(date) : new Date(),
    });

    // update customer lifetime value when payment is collected
    if (txStatus === "paid") {
      await Customer.findByIdAndUpdate(customerId, { $inc: { ltv: amount } });
    }

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    console.log("createTransaction error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create transaction",
      error: error.message,
    });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    // fetch original so we can detect status changes
    const prev = await Transaction.findById(req.params.id);
    if (!prev) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    // keep customer LTV in sync when payment status changes
    const wasPaid = prev.status === "paid";
    const nowPaid = transaction.status === "paid";

    if (!wasPaid && nowPaid) {
      await Customer.findByIdAndUpdate(transaction.customer, { $inc: { ltv: transaction.amount } });
    } else if (wasPaid && !nowPaid) {
      await Customer.findByIdAndUpdate(transaction.customer, { $inc: { ltv: -prev.amount } });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction updated",
      data: transaction,
    });
  } catch (error) {
    console.log("updateTransaction error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update transaction",
      error: error.message,
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Transaction deleted",
    });
  } catch (error) {
    console.log("deleteTransaction error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete transaction",
      error: error.message,
    });
  }
};
