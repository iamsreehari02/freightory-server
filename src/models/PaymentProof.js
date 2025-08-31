import mongoose from "mongoose";

const paymentProofSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true, // in paisa, same format as payments
    },
    proofUrl: {
      type: String,
      required: true, // Cloudinary URL of uploaded file
    },
    notes: {
      type: String, // optional user notes
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    remarks: {
      type: String, // admin notes on rejection
    },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentProof", paymentProofSchema);
