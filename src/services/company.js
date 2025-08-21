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
