import { BranchLog } from "../models/BranchLog.js";

export const getAllBranchLogsService = async (companyId) => {
  const logs = await BranchLog.find({ companyId }) // filter by company
    .populate("branchId", "name country city") // branch info
    .sort({ createdAt: -1 }); // newest first

  return logs;
};
