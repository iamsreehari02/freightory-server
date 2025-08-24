// services/bank.js
import Bank from "../models/Bank.js";

/** Add bank details - Only Admin */
export const addBankDetails = async (bankData) => {
  const existing = await Bank.findOne();
  if (existing)
    throw new Error("Bank details already exist. Please update instead.");

  const bank = await Bank.create(bankData);
  return bank;
};

/** Update bank details - Only Admin */
export const updateBankDetails = async (bankData) => {
  const bank = await Bank.findOneAndUpdate(
    {},
    { $set: bankData },
    { new: true, runValidators: true }
  );
  if (!bank) throw new Error("Bank details not found");
  return bank;
};

/** Get bank details - For all users */
export const getBankDetails = async () => {
  const bank = await Bank.findOne().lean();
  if (!bank) throw new Error("Bank details not found");
  return bank;
};
