import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    captureId: {
      type: String, // from PayPal capture response
    },
    payerEmail: {
      type: String,
    },
    payerName: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    status: {
      type: String,
      enum: ["CREATED", "COMPLETED", "FAILED", "REFUNDED"],
      default: "CREATED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
