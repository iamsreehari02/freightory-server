import { Branch } from "../models/Branch.js";
import Company from "../models/Company.js";

// Create Branch
export async function createBranch(data) {
  const company = await Company.findById(data.companyId);
  if (!company) throw new Error("Company not found");

  // Count existing branches
  const currentBranchCount = await Branch.countDocuments({ companyId: data.companyId });

  // Create branch
  const branch = await Branch.create(data);

  // Only increment branchCount if actual branches exceed the stored count
  if (currentBranchCount + 1 > company.branchCount) {
    await Company.findByIdAndUpdate(data.companyId, { $inc: { branchCount: 1 } });
  }

  return branch;
}

// Delete Branch
export async function deleteBranch(branchId) {
  const branch = await Branch.findById(branchId);
  if (!branch) throw new Error("Branch not found");

  await Branch.findByIdAndDelete(branchId);
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
