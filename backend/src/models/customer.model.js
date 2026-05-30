import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    plan: {
      type: String,
      enum: ["enterprise", "pro", "starter", "free"],
      default: "free",
    },
    status: {
      type: String,
      enum: ["active", "churned"],
      default: "active",
    },
    acquisitionChannel: {
      type: String,
      enum: ["organic", "paid", "referral", "direct", "social"],
    },
    ltv: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Customer", customerSchema);
