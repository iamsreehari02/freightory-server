import { getAllBranchLogsService } from "../services/branchLog.js";

export const handleGetAllBranchLogs = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const logs = await getAllBranchLogsService(companyId);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch branch logs" });
  }
};
