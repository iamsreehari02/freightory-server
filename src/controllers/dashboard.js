import {
  getDashboardStats,
  getFreightForwarderDashboardStats,
  getNvoccDashboardStats,
} from "../services/dashboard.js";

export const fetchDashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};

export const fetchNvoccDashboardStats = async (req, res) => {
  try {
    const stats = await getNvoccDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching NVOCC dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch NVOCC dashboard stats" });
  }
};


export const getFreightForwarderStatsController = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const stats = await getFreightForwarderDashboardStats(companyId);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching freight-forwarder stats:", error);
    res.status(500).json({ error: error.message });
  }
};