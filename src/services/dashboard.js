import { Branch } from "../models/Branch.js";
import { Container } from "../models/Container.js";
import User from "../models/User.js";

export const getDashboardStats = async () => {
  const members = await User.countDocuments(); // real dynamic data

  // The rest are static for now
  return {
    members,
    pendingPayments: 128,
    availableContainers: 824,
    upcomingRenewals: 12,
  };
};

export const getNvoccDashboardStats = async () => {
  const totalContainers = await Container.countDocuments();
  const availableContainers = await Container.countDocuments({
    status: "available",
  });

   const lastUpdatedContainer = await Container.findOne()
    .sort({ updatedAt: -1 })
    .populate("port", "name") 
    .lean();

  const lastUpdatedPort = lastUpdatedContainer?.port.name || "—";

  const recentActivitiesCount = await Container.countDocuments({
    updatedAt: { $gte: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) }, // last 10 days
  });

  return {
    totalContainers,
    availableContainers,
    lastUpdatedPort,
    recentActivitiesCount,
  };
};



export const getFreightForwarderDashboardStats = async (companyId) => {
  const totalBranches = await Branch.countDocuments({ companyId });
  const membershipStatus = "Active";

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const renewalsThisMonthCount = await Branch.countDocuments({
    companyId,
    renewalDate: { $gte: startOfMonth, $lte: endOfMonth },
  });

  return {
    totalBranches,
    membershipStatus,
    upcomingRenewals: `${renewalsThisMonthCount} this month`, 
  };
};
