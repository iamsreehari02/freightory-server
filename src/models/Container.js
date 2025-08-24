import mongoose from "mongoose";

const containerSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    containerId: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    port: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Port",
      required: true,
    },
    unitsAvailable: {
      type: Number,
      required: true,
    },
    availableFrom: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "in-use", "maintenance"],
      default: "available",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialRate: {
      type: String,
    },
    agentDetails: {
      type: String,
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

containerSchema.index({ companyId: 1, containerId: 1 }, { unique: true });

export const Container =
  mongoose.models.Container || mongoose.model("Container", containerSchema);
