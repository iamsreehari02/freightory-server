import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  transactionNumber: { type: String },
  transactionId: { type: String, required: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  country: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMode: { type: String, enum: ["online", "offline"], required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "rejected"],
    default: "pending",
  },
  invoiceFileName: { type: String },
  invoicePdf: { type: Buffer },
  createdAt: { type: Date, default: Date.now },
  paymentProof: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PaymentProof",
  },
});

export default mongoose.model("Transaction", transactionSchema);
