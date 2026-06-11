import mongoose, { Schema } from "mongoose";

const invoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customer:      { type: Schema.Types.ObjectId, ref: "Customer" },
    customerName:  { type: String, required: true },
    customerEmail: { type: String, default: "" },
    amount:        { type: Number, required: true },
    status: {
      type:    String,
      enum:    ["draft", "sent", "paid", "overdue", "cancelled"],
      default: "draft",
    },
    issueDate: { type: Date, default: Date.now },
    dueDate:   { type: Date, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Invoice", invoiceSchema);
