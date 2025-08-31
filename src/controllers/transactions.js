import {
  getTransactionsByCompany,
  getAllTransactions,
  getInvoiceByTransactionId,
} from "../services/transactions.js";

export const getTransactionsForCompany = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { latest } = req.query; // e.g., /transactions?latest=true

    const transactions = await getTransactionsByCompany(
      companyId,
      latest === "true"
    );
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
    const { latest } = req.query;

    // Pass latest flag to service
    const transactions = await getAllTransactions(latest === "true");

    return res.json({ success: true, transactions });
  } catch (err) {
    console.error("Error fetching all transactions:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await getInvoiceByTransactionId(id);

    const pdfBuffer = Buffer.isBuffer(transaction.invoicePdf)
      ? transaction.invoicePdf
      : transaction.invoicePdf.buffer;

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${transaction.invoiceFileName || "invoice.pdf"}"`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to download invoice" });
  }
};
