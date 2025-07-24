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
      enum: ["Freight Forwarder", "NVOCC"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
