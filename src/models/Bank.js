import mongoose from "mongoose";

const bankSchema = new mongoose.Schema(
  {
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    // companyId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Company",
    //   required: true,
    // },

    accountHolderName: { type: String, required: true, trim: true },
    bankName: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    branchName: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("BankDetails", bankSchema);
