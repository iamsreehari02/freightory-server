import mongoose from "mongoose";

const transactionCounterSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  lastNumber: {
    type: Number,
    default: 0,
  },
});

transactionCounterSchema.index({ companyId: 1 }, { unique: true });

export default mongoose.model("TransactionCounter", transactionCounterSchema);
