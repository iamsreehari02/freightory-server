import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

export const Branch = mongoose.model("Branch", BranchSchema);
