import mongoose from "mongoose";

const containerCounterSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  lastNumber: {
    type: Number,
    default: 0,
  },
});

containerCounterSchema.index(
  { companyId: 1, countryCode: 1 },
  { unique: true }
);

export default mongoose.model("ContainerCounter", containerCounterSchema);
