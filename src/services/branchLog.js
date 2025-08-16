import { BranchLog } from "../models/BranchLog.js";

export const getAllBranchLogsService = async () => {
  const logs = await BranchLog.find()
    .populate("branchId", "name country city") // branch info
    .sort({ createdAt: -1 }); // newest first

  return logs;
};