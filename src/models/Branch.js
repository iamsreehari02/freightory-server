import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema(
    {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    renewalDate: { type: Date, required: true }

  },
  { timestamps: true }
);

export const Branch = mongoose.model("Branch", BranchSchema);

