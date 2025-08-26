import PaymentProof from "../models/PaymentProof.js";
import Company from "../models/Company.js";
import cloudinary from "../config/cloudinary.js";

export const uploadPaymentProofService = async (
  companyId,
  transactionId,
  notes,
  filePath
) => {
  // Upload to Cloudinary
  const uploadResult = await cloudinary.uploader.upload(filePath, {
    folder: "payment_proofs",
  });

  const company = await Company.findById(companyId);
  if (!company) throw new Error("Company not found");

  const proof = await PaymentProof.create({
    companyId,
    transactionId,
    notes,
    amount: company.totalRegistrationCost, // in paisa
    proofUrl: uploadResult.secure_url,
  });

  return proof;
};

export const getAllPaymentProofsService = async () => {
  return PaymentProof.find()
    .populate("companyId", "companyName")
    .sort({ createdAt: -1 });
};

export const updatePaymentProofStatusService = async (
  proofId,
  status,
  remarks
) => {
  const proof = await PaymentProof.findByIdAndUpdate(
    proofId,
    { status, remarks },
    { new: true }
  );
  if (!proof) throw new Error("Payment proof not found");
  return proof;
};
