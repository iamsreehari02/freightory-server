import {
  getAllCompanies,
  getCompanyById,
  getPaymentSummaryService,
} from "../services/company.js";

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

export const getPaymentSummary = async (req, res) => {
  try {
    const companyId = req.query.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID missing from session",
      });
    }

    const paymentSummary = await getPaymentSummaryService(companyId);

    return res.status(200).json({
      success: true,
      data: paymentSummary,
    });
  } catch (error) {
    console.error("❌ Error in getPaymentSummary:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching payment summary",
    });
  }
};
