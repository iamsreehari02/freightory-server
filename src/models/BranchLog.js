import mongoose from "mongoose";

const branchLogSchema = new mongoose.Schema(
  {
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    action: {
      type: String, // "created", "updated", "deleted"
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    
  },
  { timestamps: true }
);

export const BranchLog =
  mongoose.models.BranchLog || mongoose.model("BranchLog", branchLogSchema);
