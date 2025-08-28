import {
  getTransactionsByCompany,
  getAllTransactions,
} from "../services/transactions.js";

export const getTransactionsForCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const transactions = await getTransactionsByCompany(companyId);
    return res.json({ success: true, transactions });
  } catch (err) {
    console.error("Error fetching company transactions:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

// GET /transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await getAllTransactions();
    return res.json({ success: true, transactions });
  } catch (err) {
    console.error("Error fetching all transactions:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};
