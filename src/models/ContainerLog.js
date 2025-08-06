import mongoose from "mongoose";

const containerLogSchema = new mongoose.Schema(
  {
    containerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Container",
      required: true,
    },
    action: {
      type: String, // "created", "updated", "status-change", "deleted"
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const ContainerLog =
  mongoose.models.ContainerLog ||
  mongoose.model("ContainerLog", containerLogSchema);
