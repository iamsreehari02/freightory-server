import { Branch } from "../models/Branch.js";
import Company from "../models/Company.js";
import { Container } from "../models/Container.js";

export async function getAllCompanies() {
  try {
    const companies = await Company.find().sort({
      createdAt: -1,
    });
    return companies;
  } catch (error) {
    throw new Error("Failed to fetch companies: " + error.message);
  }
}

export async function getCompanyById(id) {
  try {
    const company = await Company.findOne({ _id: id, isDeleted: false });
    if (!company) throw new Error("Company not found");

    let details = [];

    console.log("companuy", company);

    if (company.freightType === "freight_forwarder") {
      details = await Branch.find({ companyId: id }).sort({ createdAt: -1 });
    } else if (company.freightType === "nvocc") {
      details = await Container.find({ companyId: id }).sort({ createdAt: -1 });
    }

    return {
      ...company.toObject(),
      details,
    };
  } catch (error) {
    throw new Error("Failed to fetch company: " + error.message);
  }
}

export const getPaymentSummaryService = async (companyId) => {
  // Get company details
  const company = await Company.findById(companyId);

  if (!company) {
    throw new Error("Company not found");
  }

  // Calculate total cost dynamically if not stored
  const branchCount = company.branchCount || 0;
  const totalCost =
    company.baseRegistrationFee + branchCount * company.costPerBranch;

  // If `totalRegistrationCost` isn't saved, save it once
  if (
    !company.totalRegistrationCost ||
    company.totalRegistrationCost !== totalCost
  ) {
    company.totalRegistrationCost = totalCost;
    await company.save();
  }

  return {
    companyId: company._id,
    companyName: company.companyName,
    currency: company.currency,
    baseRegistrationFee: company.baseRegistrationFee,
    costPerBranch: company.costPerBranch,
    branchCount,
    totalCost,
    paymentStatus: company.paymentStatus,
    paymentDetails: company.paymentDetails || {},
  };
};
