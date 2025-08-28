import Transaction from "../models/Transaction.js";

export const getTransactionsByCompany = async (companyId) => {
  if (!companyId) throw new Error("Company ID is required");

  const transactions = await Transaction.find({ company: companyId }).sort({
    createdAt: -1,
  });

  return transactions;
};

export const getAllTransactions = async () => {
  const transactions = await Transaction.find()
    .sort({ createdAt: -1 })
    .populate("company", "companyName");
  return transactions;
};
