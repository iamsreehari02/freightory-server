// controllers/bank.js
import {
  addBankDetails,
  getBankDetails,
  updateBankDetails,
} from "../services/bank.js";

/** POST /api/bank-details → Add bank details (Admin only) */
export const handleAddBankDetails = async (req, res) => {
  try {
    const bank = await addBankDetails(req.body);

    res.status(201).json({
      success: true,
      message: "Bank details added successfully",
      bankDetails: bank,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/** PATCH /api/bank-details → Update bank details (Admin only) */
export const handleUpdateBankDetails = async (req, res) => {
  try {
    const bank = await updateBankDetails(req.body);

    res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      bankDetails: bank,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/** GET /api/bank-details → Fetch bank details (All users) */
export const handleGetBankDetails = async (_req, res) => {
  try {
    const bankDetails = await getBankDetails();

    res.status(200).json({ success: true, bankDetails });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
