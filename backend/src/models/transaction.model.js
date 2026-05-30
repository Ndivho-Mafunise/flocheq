import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    customer:     { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    customerName: { type: String, required: true },
    amount:       { type: Number, required: true },
    type: {
      type: String,
      enum: ["service", "product", "subscription"],
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "pending", "failed", "refunded"],
      default: "paid",
    },
    description: { type: String, default: "" },
    date:        { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("Transaction", transactionSchema);
