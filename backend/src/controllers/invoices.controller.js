import Invoice from "../models/invoice.model.js";

export const getInvoices = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const [invoices, total, summaryResult] = await Promise.all([
      Invoice.find(filter)
        .sort({ issueDate: -1 })
        .skip((page - 1) * parseInt(limit))
        .limit(parseInt(limit)),

      Invoice.countDocuments(filter),

      Invoice.aggregate([
        {
          $group: {
            _id:           null,
            totalAmount:   { $sum: "$amount" },
            paidAmount:    { $sum: { $cond: [{ $eq: ["$status", "paid"]    }, "$amount", 0] } },
            overdueCount:  { $sum: { $cond: [{ $eq: ["$status", "overdue"] }, 1, 0] } },
            outstandingAmount: {
              $sum: {
                $cond: [
                  { $in: ["$status", ["sent", "overdue"]] },
                  "$amount",
                  0,
                ],
              },
            },
          },
        },
      ]),
    ]);

    const raw = summaryResult[0] ?? {
      totalAmount: 0,
      paidAmount: 0,
      overdueCount: 0,
      outstandingAmount: 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        invoices,
        total,
        page:  parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        summary: {
          totalAmount:       raw.totalAmount,
          paidAmount:        raw.paidAmount,
          overdueCount:      raw.overdueCount,
          outstandingAmount: raw.outstandingAmount,
        },
      },
    });
  } catch (error) {
    console.error("getInvoices error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch invoices" });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const { customerName, customerEmail, customerId, amount, status, issueDate, dueDate, description } = req.body;

    if (!customerName || !amount || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Customer name, amount, and due date are required",
      });
    }

    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-${String(count + 1001).padStart(4, "0")}`;

    const invoice = await Invoice.create({
      invoiceNumber,
      customer:      customerId || undefined,
      customerName,
      customerEmail: customerEmail || "",
      amount,
      status:        status || "draft",
      issueDate:     issueDate ? new Date(issueDate) : new Date(),
      dueDate:       new Date(dueDate),
      description:   description || "",
    });

    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    console.error("createInvoice error:", error);
    res.status(500).json({ success: false, message: "Failed to create invoice" });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    return res.status(200).json({ success: true, message: "Invoice updated", data: invoice });
  } catch (error) {
    console.error("updateInvoice error:", error);
    res.status(500).json({ success: false, message: "Failed to update invoice" });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }
    return res.status(200).json({ success: true, message: "Invoice deleted" });
  } catch (error) {
    console.error("deleteInvoice error:", error);
    res.status(500).json({ success: false, message: "Failed to delete invoice" });
  }
};
