import { getAllCompanies, getCompanyById } from "../services/company.js";

export async function fetchCompanies(req, res) {
  try {
    const companies = await getAllCompanies();
    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch companies",
      error: error.message,
    });
  }
}

export async function fetchCompanyById(req, res) {
  const { id } = req.params;

  try {
    const company = await getCompanyById(id);
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch company",
      error: error.message,
    });
  }
}
