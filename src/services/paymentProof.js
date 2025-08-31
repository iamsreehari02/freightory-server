import PaymentProof from "../models/PaymentProof.js";
import Company from "../models/Company.js";
import cloudinary from "../config/cloudinary.js";
import { getNextTransactionNumber } from "../utils/transactionCounter.js";
import Transaction from "../models/Transaction.js";
import { generatePDFBuffer } from "../utils/pdfGenerator.js";
import User from "../models/User.js";
import { sendEmailTemplate } from "./email.js";
import mongoose from "mongoose";
import { formatCurrencyFromSmallestUnit } from "../utils/currency.js";

// export const uploadPaymentProofService = async (
//   companyId,
//   transactionId,
//   notes,
//   filePath
// ) => {
//   const uploadResult = await cloudinary.uploader.upload(filePath, {
//     folder: "payment_proofs",
//   });

//   const company = await Company.findById(companyId);
//   if (!company) throw new Error("Company not found");

//   const proof = await PaymentProof.create({
//     companyId,
//     transactionId,
//     notes,
//     amount: company.totalRegistrationCost, // in paisa
//     proofUrl: uploadResult.secure_url,
//   });

//   return proof;
// };

export const uploadPaymentProofService = async (
  companyId,
  transactionId,
  notes,
  filePath
) => {
  const existingProof = await PaymentProof.findOne({ transactionId });
  if (existingProof) {
    const error = new Error(
      "A payment proof with this transaction ID already exists."
    );
    error.statusCode = 400;
    throw error;
  }

  const uploadResult = await cloudinary.uploader.upload(filePath, {
    folder: "payment_proofs",
  });

  const company = await Company.findById(companyId);
  if (!company) throw new Error("Company not found");

  const transactionNumber = await getNextTransactionNumber(true);

  const companyCurrency = company.currency || "USD";
  const formattedAmount = formatCurrencyFromSmallestUnit(
    company.totalRegistrationCost,
    companyCurrency
  );

  const proof = await PaymentProof.create({
    companyId,
    transactionId,
    notes,
    amount: company.totalRegistrationCost,
    proofUrl: uploadResult.secure_url,
    status: "pending",
  });

  const transaction = await Transaction.create({
    transactionNumber,
    transactionId,
    company: companyId,
    country: company.country,
    amount: company.totalRegistrationCost,
    paymentMode: "offline",
    status: "pending",
    paymentProof: proof._id,
    createdAt: new Date(),
  });

  const invoiceData = {
    companyName: company.companyName,
    transactionNumber,
    transactionId,
    amount: company.totalRegistrationCost,
    currency: company.currency,
    country: company.country,
    headOfficeAddress: company.headOfficeAddress,
    pinCode: company.pinCode,
    website: company.website,
    date: new Date().toLocaleDateString(),
    baseRegistrationFee: company.baseRegistrationFee || 0,
    branchCount: company.branchCount || 0,
    costPerBranch: company.costPerBranch || 0,
    totalRegistrationCost: company.totalRegistrationCost || 0,
  };

  let pdfBuffer = await generatePDFBuffer(invoiceData);
  if (!(pdfBuffer instanceof Buffer)) pdfBuffer = Buffer.from(pdfBuffer);
  transaction.invoicePdf = pdfBuffer;
  await transaction.save();

  const user = await User.findOne({ companyId }).select("email name");
  if (user) {
    await sendEmailTemplate({
      to: user.email,
      subject: "Your Payment Proof Received",
      htmlTemplate: `
        <p>Hi ${user.name || company.companyName},</p>
        <p>We received your payment proof for <strong>${formattedAmount}</strong>.</p>
        <p>You can download your invoice here:</p>
        <a href="${process.env.BACKEND_URL}/api/transactions/${transaction.transactionId}/invoice">
          Download Invoice
        </a>
        <br/><br/>
        <p>Regards,<br/>INDLOG NETWORK</p>
      `,
    });
  }

  return transaction;
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

export const approvePaymentProofService = async (proofId, adminRemarks) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const proof = await PaymentProof.findById(proofId).session(session);
    if (!proof) throw new Error("Payment proof not found");

    proof.status = "approved";
    proof.remarks = adminRemarks || "";
    await proof.save({ session });

    const transaction = await Transaction.findOne({
      paymentProof: proof._id,
    }).session(session);
    if (transaction) {
      transaction.status = "completed";
      await transaction.save({ session });
    }

    const company = await Company.findById(proof.companyId).session(session);
    if (company) {
      company.paymentStatus = "completed"; // user can now access dashboard
      await company.save({ session });
    }

    // ✅ Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { proof, transaction, company };
  } catch (error) {
    // Rollback if any error occurs
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const rejectPaymentProofService = async (proofId, adminRemarks) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const proof = await PaymentProof.findById(proofId).session(session);
    if (!proof) throw new Error("Payment proof not found");

    proof.status = "rejected";
    proof.remarks = adminRemarks || "";
    await proof.save({ session });

    const transaction = await Transaction.findOne({
      paymentProof: proof._id,
    }).session(session);
    if (transaction) {
      transaction.status = "rejected";
      await transaction.save({ session });
    }

    const company = await Company.findById(proof.companyId).session(session);
    if (company) {
      company.paymentStatus = "pending";
      await company.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return { proof, transaction, company };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
