import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    contactPerson: { type: String, required: true },
    companyName: { type: String, required: true },
    website: { type: String, default: "" },
    headOfficeAddress: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: String, required: true },
    freightType: {
      type: String,
      enum: ["freight_forwarder", "nvocc"],
      required: true,
    },
    costPerBranch: {
      type: Number,
      default: 50, // USD
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    baseRegistrationFee: Number,
    // Optional for reporting
    totalRegistrationCost: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
