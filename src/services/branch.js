import { Branch } from "../models/Branch.js";
import { BranchLog } from "../models/BranchLog.js";
import Company from "../models/Company.js";

// Create Branch
const addBranchLog = async ({ branchId, action, message, userId }) => {
  return await BranchLog.create({ branchId, action, message });
};

// Create Branch with log
export async function createBranch(data, userId) {

  const company = await Company.findById(data.companyId);
  if (!company) throw new Error("Company not found");

  // Count existing branches
  const currentBranchCount = await Branch.countDocuments({ companyId: data.companyId });

  // Set renewalDate 1 year from now
  const renewalDate = new Date();
  renewalDate.setFullYear(renewalDate.getFullYear() + 1);

  // Create branch
  const branch = await Branch.create({ ...data, renewalDate });

  // Increment branchCount if needed
  if (currentBranchCount + 1 > company.branchCount) {
    await Company.findByIdAndUpdate(data.companyId, { $inc: { branchCount: 1 } });
  }

  // Log branch creation
  await addBranchLog({
    branchId: branch._id,
    action: "created",
    message: `Branch "${branch.name}" created`,
    userId,
  });

  return branch;
}

// Delete Branch with log
export async function deleteBranch(branchId, userId) {
  const branch = await Branch.findById(branchId);
  if (!branch) throw new Error("Branch not found");

  await Branch.findByIdAndDelete(branchId);

  // Log branch deletion
  await addBranchLog({
    branchId,
    action: "deleted",
    message: `Branch "${branch.name}" deleted`,
    userId,
  });

  return { message: "Branch deleted successfully" };
}
// Get Branch by ID
export async function getBranchById(branchId) {
  const branch = await Branch.findById(branchId).populate("companyId", "companyName");
  if (!branch) throw new Error("Branch not found");
  return branch;
}

// Get all branches by Company
export async function getBranchesByCompany(companyId) {
  return await Branch.find({ companyId }).sort({ createdAt: -1 });
}


export async function getLatestBranchesByCompany(companyId) {
  return await Branch.find({ companyId })
    .sort({ createdAt: -1 })
    .limit(10);
}

export const getUpcomingRenewals = async (companyId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const renewalsThisMonthCount = await Branch.countDocuments({
    companyId,
    renewalDate: { $gte: startOfMonth, $lte: endOfMonth },
  });

  const latestRenewals = await Branch.find({
    companyId,
    renewalDate: { $gte: startOfMonth, $lte: endOfMonth },
  })
    .sort({ renewalDate: 1 }) // earliest first, or -1 for latest first
    .limit(10)
    .lean();

  return {
    count: renewalsThisMonthCount,
    display: `${renewalsThisMonthCount} this month`,
    latest: latestRenewals,
  };
};