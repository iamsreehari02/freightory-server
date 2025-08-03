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
