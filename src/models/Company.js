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
    currency: {
      type: String,
      required: true, // e.g., "INR", "USD"
    },
    costPerBranch: {
      type: Number, // in minor units like paise or cents
      default: 5000, // e.g. 5000 paise = ₹50.00
      required: true,
    },
    baseRegistrationFee: {
      type: Number, // in minor units
      required: true,
    },
    totalRegistrationCost: {
      type: Number, // in minor units
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
