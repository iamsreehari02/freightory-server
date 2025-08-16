import { getAllBranchLogsService } from "../services/branchLog.js";

export const handleGetAllBranchLogs = async (req, res) => {
  try {
    const logs = await getAllBranchLogsService();
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch branch logs" });
  }
};