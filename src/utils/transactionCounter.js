import TransactionCounter from "../models/TransactionCounter.js";

export async function getNextTransactionNumber(companyId, increment = false) {
  const result = await TransactionCounter.findOneAndUpdate(
    { companyId },
    increment ? { $inc: { lastNumber: 1 } } : {},
    { upsert: true, new: true }
  );

  const number = increment ? result.lastNumber : result.lastNumber + 1;

  // Format with prefix and leading zeros, e.g., TXN-001
  const paddedNumber = String(number).padStart(3, "0");
  return `TXN-${paddedNumber}`;
}
