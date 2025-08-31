import Transaction from "../models/Transaction.js";

export const getTransactionsByCompany = async (companyId, latest = false) => {
  if (!companyId) throw new Error("Company ID is required");

  let query = Transaction.find({ company: companyId })
    .sort({ createdAt: -1 })
    .populate("company")
    .populate("paymentProof");

  if (latest) {
    query = query.limit(5);
  }

  const transactions = await query;
  return transactions;
};

export const getAllTransactions = async (latest = false) => {
  const query = Transaction.find()
    .sort({ createdAt: -1 })
    .populate("company")
    .populate("paymentProof");

  // If latest=true → Limit to 5 transactions
  if (latest) {
    query.limit(5);
  }

  return await query.exec();
};

export const getInvoiceByTransactionId = async (transactionId) => {
  const transaction = await Transaction.findOne({ transactionId });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  if (!transaction.invoicePdf) {
    throw new Error("Invoice not found");
  }

  return transaction;
};
