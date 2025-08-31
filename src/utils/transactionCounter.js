import TransactionCounter from "../models/TransactionCounter.js";

export async function getNextTransactionNumber(increment = false) {
  const result = await TransactionCounter.findOneAndUpdate(
    {}, // Remove companyId filter - this makes it global
    increment ? { $inc: { lastNumber: 1 } } : {},
    { upsert: true, new: true }
  );

  const number = increment ? result.lastNumber : result.lastNumber + 1;

  // Format with prefix and leading zeros, e.g., TXN-001
  const paddedNumber = String(number).padStart(3, "0");
  return `TXN-${paddedNumber}`;
}
