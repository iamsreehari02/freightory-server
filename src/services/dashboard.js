import mongoose from "mongoose";
import { Branch } from "../models/Branch.js";
import { Container } from "../models/Container.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getDashboardStats = async () => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    const [members, pendingPayments, availableContainers, upcomingRenewals] =
      await Promise.all([
        User.countDocuments({
          role: { $ne: "admin" },
          isDeleted: false,
        }),
        Transaction.countDocuments({ status: "pending" }),

        Container.countDocuments({ status: "available", isDeleted: false }),

        Branch.countDocuments({
          renewalDate: { $gte: startOfMonth, $lte: endOfMonth },
        }),
      ]);

    return {
      members,
      pendingPayments,
      availableContainers,
      upcomingRenewals,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard stats");
  }
};

export const getNvoccDashboardStats = async (companyId) => {
  const companyObjectId = new mongoose.Types.ObjectId(companyId);

  const queryBase = {
    companyId: companyObjectId,
    isDeleted: { $ne: true },
  };

  const totalContainers = await Container.countDocuments(queryBase);

  const availableContainers = await Container.countDocuments({
    ...queryBase,
    status: "available",
  });

  const lastUpdatedContainer = await Container.findOne(queryBase)
    .sort({ updatedAt: -1 })
    .populate("port", "name")
    .lean();

  const lastUpdatedPort = lastUpdatedContainer?.port?.name || "—";

  const recentActivitiesCount = await Container.countDocuments({
    ...queryBase,
    updatedAt: { $gte: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
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
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );

  const renewalsThisMonthCount = await Branch.countDocuments({
    companyId,
    renewalDate: { $gte: startOfMonth, $lte: endOfMonth },
  });

  const totalTransactions = await Transaction.countDocuments({
    company: companyId,
  });

  return {
    totalBranches,
    membershipStatus,
    upcomingRenewals: `${renewalsThisMonthCount} this month`,
    totalTransactions,
  };
};
