import Customer from "../models/customer.model.js";
import Transaction from "../models/transaction.model.js";

export const getCustomers = async (req, res) => {
  try {
    const { search, plan, status, page = 1, limit = 20 } = req.query;

    // build query filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (plan)   filter.plan   = plan;
    if (status) filter.status = status;

    // fetch paginated list + global summary stats in parallel
    const [customers, total, statsResult] = await Promise.all([
      Customer.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * parseInt(limit))
        .limit(parseInt(limit)),

      Customer.countDocuments(filter),

      Customer.aggregate([
        {
          $group: {
            _id:        null,
            totalAll:   { $sum: 1 },
            activeAll:  { $sum: { $cond: [{ $eq: ["$status", "active"]  }, 1, 0] } },
            churnedAll: { $sum: { $cond: [{ $eq: ["$status", "churned"] }, 1, 0] } },
            avgLtvAll:  { $avg: "$ltv" },
          },
        },
      ]),
    ]);

    const s = statsResult[0] ?? { totalAll: 0, activeAll: 0, churnedAll: 0, avgLtvAll: 0 };

    return res.status(200).json({
      success: true,
      data: {
        customers,
        total,
        page:  parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        stats: {
          total:   s.totalAll,
          active:  s.activeAll,
          churned: s.churnedAll,
          avgLtv:  Math.round(s.avgLtvAll ?? 0),
        },
      },
    });
  } catch (error) {
    console.log("getCustomers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { name, email, plan, acquisitionChannel } = req.body;

    // validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    // check for duplicate
    const existingCustomer = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "A customer with this email already exists",
      });
    }

    // create customer
    const customer = await Customer.create({ name, email, plan, acquisitionChannel });

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error) {
    console.log("createCustomer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create customer",
      error: error.message,
    });
  }
};

export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // grab their recent transactions too
    const transactions = await Transaction.find({ customer: req.params.id })
      .sort({ date: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      data: { ...customer.toObject(), transactions },
    });
  } catch (error) {
    console.log("getCustomer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
      error: error.message,
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Customer updated",
      data: customer,
    });
  } catch (error) {
    console.log("updateCustomer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update customer",
      error: error.message,
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Customer deleted",
    });
  } catch (error) {
    console.log("deleteCustomer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete customer",
      error: error.message,
    });
  }
};
