import Company from "../models/Company.js";
import Transaction from "../models/Transaction.js";
import { sendEmailTemplate } from "../services/email.js";
import { createOrder, captureOrder } from "../services/paypal.js";
import { uploadPDFBufferToCloudinary } from "../services/uploadPDF.js";
// import { generateInvoiceTemplate } from "../templates/invoiceTemplate.js";
import { getNextTransactionNumber } from "../utils/transactionCounter.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { generatePDFBuffer } from "../utils/pdfGenerator.js";
import User from "../models/User.js";
import { formatCurrency } from "../utils/currency.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createPayPalOrder(req, res) {
  try {
    const { amount, currency, companyId } = req.body;

    if (!amount || !companyId) {
      return res
        .status(400)
        .json({ error: "Amount and companyId are required" });
    }

    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ error: "Company not found" });

    // Prevent duplicate payment
    if (company.paymentStatus === "completed") {
      return res.status(400).json({ error: "Payment already completed" });
    }

    const order = await createOrder(amount, currency || "USD");

    company.paymentDetails = { orderId: order.id };
    company.paymentStatus = "pending";
    await company.save();

    return res.json({ id: order.id });
  } catch (err) {
    console.error(
      "PayPal createOrder error:",
      err.response?.data || err.message
    );
    return res.status(500).json({ error: "Failed to create PayPal order" });
  }
}

// export async function capturePayPalOrder(req, res) {
//   try {
//     const { orderID, companyId } = req.body;

//     if (!orderID || !companyId) {
//       return res
//         .status(400)
//         .json({ error: "orderID and companyId are required" });
//     }

//     // Capture payment from PayPal
//     const capture = await captureOrder(orderID);

//     if (capture.status === "COMPLETED") {
//       const captureData = capture.purchase_units[0].payments.captures[0];

//       // Update company record
//       const updatedCompany = await Company.findByIdAndUpdate(
//         companyId,
//         {
//           paymentStatus: "completed",
//           paymentDetails: {
//             orderId: orderID,
//             transactionId: captureData.id,
//           },
//         },
//         { new: true }
//       );

//       let transaction;
//       try {
//         // Step 1: create transaction without number
//         transaction = await Transaction.create({
//           transactionNumber: "",
//           transactionId: captureData.id,
//           company: companyId,
//           companyName: updatedCompany.companyName,
//           country: updatedCompany.country,
//           amount: captureData.amount.value,
//           paymentMode: "online",
//           status: capture.status.toLowerCase(),
//           createdAt: new Date(),
//         });

//         // Step 2: generate next number
//         const transactionNumber = await getNextTransactionNumber(
//           companyId,
//           true
//         );

//         // Step 3: update transaction with real number
//         transaction.transactionNumber = transactionNumber;
//         await transaction.save();
//       } catch (err) {
//         console.error("Transaction creation failed:", err);
//         // counter not incremented yet, safe
//       }

//       return res.json({
//         success: true,
//         company: updatedCompany,
//         capture,
//       });
//     }

//     return res.status(400).json({ success: false, capture });
//   } catch (err) {
//     console.error(
//       "PayPal captureOrder error:",
//       err.response?.data || err.message
//     );
//     return res.status(500).json({ error: "Failed to capture PayPal order" });
//   }
// }

// export async function capturePayPalOrder(req, res) {
//   try {
//     const { orderID, companyId } = req.body;

//     if (!orderID || !companyId) {
//       return res
//         .status(400)
//         .json({ error: "orderID and companyId are required" });
//     }

//     const capture = await captureOrder(orderID);

//     if (capture.status === "COMPLETED") {
//       const captureData = capture.purchase_units[0].payments.captures[0];

//       const updatedCompany = await Company.findByIdAndUpdate(
//         companyId,
//         {
//           paymentStatus: "completed",
//           paymentDetails: {
//             orderId: orderID,
//             transactionId: captureData.id,
//           },
//         },
//         { new: true }
//       );

//       // Create transaction
//       let transaction = await Transaction.create({
//         transactionNumber: "",
//         transactionId: captureData.id,
//         company: companyId,
//         companyName: updatedCompany.companyName,
//         country: updatedCompany.country,
//         amount: captureData.amount.value,
//         paymentMode: "online",
//         status: capture.status.toLowerCase(),
//         createdAt: new Date(),
//       });

//       const transactionNumber = await getNextTransactionNumber(companyId, true);
//       transaction.transactionNumber = transactionNumber;

//       // ✅ Generate PDF Invoice
//       const html = generateInvoiceTemplate({
//         companyName: updatedCompany.companyName,
//         transactionNumber,
//         transactionId: captureData.id,
//         amount: captureData.amount.value,
//         country: updatedCompany.country,
//         date: new Date().toLocaleDateString(),
//       });

//       const pdfPath = path.join("tmp", `invoice-${transactionNumber}.pdf`);
//       await generatePDF(html, pdfPath);

//       // ✅ Upload to Cloudinary
//       const invoiceUrl = await uploadPDFToCloudinary(pdfPath);
//       transaction.invoiceUrl = invoiceUrl;
//       await transaction.save();

//       const user = await User.findOne({ companyId: companyId }).select(
//         "email name"
//       );

//       if (!user) {
//         console.error("No user found for company:", companyId);
//       } else {
//         await sendEmailTemplate({
//           to: user.email,
//           subject: "Your Payment Invoice",
//           htmlTemplate: `
//       <p>Hi ${user.name || updatedCompany.companyName},</p>
//       <p>Thanks for your payment of ₹${transaction.amount}.</p>
//       <p>You can download your invoice here:</p>
//       <a href="${transaction.invoiceUrl}">Download Invoice</a>
//       <br><br>
//       <p>Regards,<br/>INDLOG NETWORK</p>
//     `,
//         });
//       }

//       return res.json({
//         success: true,
//         company: updatedCompany,
//         transaction,
//         invoiceUrl,
//       });
//     }

//     return res.status(400).json({ success: false, capture });
//   } catch (err) {
//     console.error("PayPal captureOrder error:", err);
//     return res.status(500).json({ error: "Failed to capture PayPal order" });
//   }
// }

export async function capturePayPalOrder(req, res) {
  try {
    const { orderID, companyId } = req.body;

    if (!orderID || !companyId) {
      return res
        .status(400)
        .json({ error: "orderID and companyId are required" });
    }

    const capture = await captureOrder(orderID);

    if (capture.status === "COMPLETED") {
      const captureData = capture.purchase_units[0].payments.captures[0];

      const updatedCompany = await Company.findByIdAndUpdate(
        companyId,
        {
          paymentStatus: "completed",
          paymentDetails: {
            orderId: orderID,
            transactionId: captureData.id,
          },
        },
        { new: true }
      );

      const currency = updatedCompany.currency || "$";

      const formattedAmount = formatCurrency(
        updatedCompany.totalRegistrationCost,
        currency
      );

      let transaction = await Transaction.create({
        transactionNumber: "",
        transactionId: captureData.id,
        company: companyId,
        country: updatedCompany.country,
        amount: updatedCompany.totalRegistrationCost,
        paymentMode: "online",
        status: capture.status.toLowerCase(),
        createdAt: new Date(),
      });

      const transactionNumber = await getNextTransactionNumber(true);
      transaction.transactionNumber = transactionNumber;

      const invoiceData = {
        companyName: updatedCompany.companyName,
        transactionNumber,
        transactionId: captureData.id,
        amount: updatedCompany.totalRegistrationCost,
        currency: updatedCompany.currency,
        country: updatedCompany.country,
        headOfficeAddress: updatedCompany.headOfficeAddress,
        pinCode: updatedCompany.pinCode,
        website: updatedCompany.website,
        date: new Date().toLocaleDateString(),
        baseRegistrationFee: updatedCompany.baseRegistrationFee || 0,
        branchCount: updatedCompany.branchCount || 0,
        costPerBranch: updatedCompany.costPerBranch || 0,
        totalRegistrationCost: updatedCompany.totalRegistrationCost || 0,
      };

      let pdfBuffer = await generatePDFBuffer(invoiceData);

      if (!(pdfBuffer instanceof Buffer)) {
        pdfBuffer = Buffer.from(pdfBuffer);
      }

      transaction.invoicePdf = pdfBuffer;
      await transaction.save();
      const user = await User.findOne({ companyId }).select("email name");

      if (user) {
        await sendEmailTemplate({
          to: user.email,
          subject: "Your Payment Invoice",
          htmlTemplate: `
      <p>Hi ${user.name || updatedCompany.companyName},</p>
      <p>Thanks for your payment of ${formattedAmount}.</p>
      <p>You can download your invoice here:</p>
      <a href="${process.env.BACKEND_URL}/api/transactions/${transaction.transactionId}/invoice">
        Download Invoice
      </a>
      <br><br>
      <p>Regards,<br/>INDLOG NETWORK</p>
    `,
        });
      }

      return res.json({
        success: true,
        company: updatedCompany,
        transaction,
        invoiceUrl: transaction.invoiceUrl,
      });
    }

    return res.status(400).json({ success: false, capture });
  } catch (err) {
    console.error("PayPal captureOrder error:", err);
    return res.status(500).json({ error: "Failed to capture PayPal order" });
  }
}

export const handlePayPalWebhook = async (req, res) => {
  try {
    const event = req.body;

    // Optional: verify signature for security (recommended)
    // await verifyPayPalWebhook(req);

    console.log("webhook triggered");

    // Only process completed payments
    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const capture = event.resource;
      const orderId =
        capture.supplementary_data?.related_ids?.order_id || capture.id;

      // Update company payment status
      const company = await Company.findOneAndUpdate(
        { "paymentDetails.orderId": orderId },
        {
          paymentStatus: "completed",
          paymentDetails: {
            orderId,
            transactionId: capture.id,
          },
        },
        { new: true }
      );

      if (!company) {
        console.warn("Company not found for orderId:", orderId);
      }

      return res.status(200).send("Webhook processed");
    }

    // Handle other events if needed
    return res.status(200).send("Event ignored");
  } catch (err) {
    console.error("PayPal webhook error:", err);
    return res.status(500).send("Server error");
  }
};
