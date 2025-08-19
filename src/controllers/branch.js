import mongoose from "mongoose";
import { Branch } from "../models/Branch.js";
import {
    createBranch, deleteBranch,
    getBranchById,
    getBranchesByCompany,
    getLatestBranchesByCompany,
    getUpcomingRenewals,
} from "../services/branch.js";


export async function createBranchController(req, res) {
    try {
        // Use the companyId from the authenticated user
        const companyId = req.user.companyId;
        if (!companyId) throw new Error("User has no associated company");

        const data = {
            ...req.body,
            companyId, // enforce the branch is linked to user's company
        };

        const branch = await createBranch(data);
        res.status(201).json(branch);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


export async function deleteBranchController(req, res) {
    try {
        const branchId = req.params.id;
        const branch = await Branch.findById(branchId);

        if (!branch) throw new Error("Branch not found");

        // Only allow deletion if branch belongs to the authenticated user's company
        if (branch.companyId.toString() !== req.user.companyId) {
            return res.status(403).json({ error: "Forbidden: Cannot delete this branch" });
        }

        await deleteBranch(branchId);
        res.json({ message: "Branch deleted successfully" });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}


// Get Branch by ID
export async function getBranchByIdController(req, res) {
    try {
        const branch = await getBranchById(req.params.id);
        res.json(branch);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export async function getBranchesByCompanyController(req, res) {
  try {
    const companyId = req.user.companyId;
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ error: "Invalid company ID" });
    }
    const branches = await getBranchesByCompany(companyId);
    res.json(branches);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getLatestBranch(req, res) {
  try {
    const companyId = req.user.companyId;
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ error: "Invalid company ID" });
    }
    const branch = await getLatestBranchesByCompany(companyId);
    res.json(branch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export const getUpcomingRenewalsController = async (req, res) => {
  try {
    const companyId = req.user.companyId; 
    const data = await getUpcomingRenewals(companyId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};