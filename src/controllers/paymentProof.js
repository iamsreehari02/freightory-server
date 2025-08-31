import {
  uploadPaymentProofService,
  getAllPaymentProofsService,
  updatePaymentProofStatusService,
  approvePaymentProofService,
  rejectPaymentProofService,
} from "../services/paymentProof.js";

export const uploadPaymentProof = async (req, res) => {
  try {
    const { transactionId, notes, companyId } = req.body;
    const file = req.file;

    console.log("company in proof", companyId);

    if (!file) {
      return res.status(400).json({ success: false, message: "File missing" });
    }

    const proof = await uploadPaymentProofService(
      companyId,
      transactionId,
      notes,
      file.path
    );

    res.status(201).json({ success: true, data: proof });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPaymentProofs = async (req, res) => {
  try {
    const proofs = await getAllPaymentProofsService();
    res.status(200).json({ success: true, data: proofs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePaymentProofStatus = async (req, res) => {
  try {
    const { proofId, status, remarks } = req.body;

    if (!proofId || !status) {
      return res
        .status(400)
        .json({ success: false, message: "Missing params" });
    }

    const updatedProof = await updatePaymentProofStatusService(
      proofId,
      status,
      remarks
    );
    res.status(200).json({ success: true, data: updatedProof });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approvePaymentProofController = async (req, res) => {
  try {
    const { proofId, remarks } = req.body;
    const result = await approvePaymentProofService(proofId, remarks);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const rejectPaymentProofController = async (req, res) => {
  try {
    const { proofId, remarks } = req.body;
    const result = await rejectPaymentProofService(proofId, remarks);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
