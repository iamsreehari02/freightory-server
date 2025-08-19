
import {createOrder , captureOrder} from "../services/paypal.js"

export async function createPayPalOrder(req, res) {
  try {
    const { amount, currency } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const order = await createOrder(amount, currency || "USD");

    return res.json({ id: order.id });
  } catch (err) {
    console.error("PayPal createOrder error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to create PayPal order" });
  }
}

// POST /api/paypal/capture
export async function capturePayPalOrder(req, res) {
  try {
    const { orderID } = req.body;

    if (!orderID) {
      return res.status(400).json({ error: "orderID is required" });
    }

    const capture = await captureOrder(orderID);

    if (capture.status === "COMPLETED") {
      // 💾 Save to DB (userId, amount, capture.id, payer info, etc.)
      // Example:
      // await PaymentModel.create({
      //   userId: req.user.id,
      //   orderId: orderID,
      //   transactionId: capture.purchase_units[0].payments.captures[0].id,
      //   amount: capture.purchase_units[0].amount.value,
      //   currency: capture.purchase_units[0].amount.currency_code,
      //   status: capture.status,
      // });

      return res.json({ success: true, capture });
    }

    return res.status(400).json({ success: false, capture });
  } catch (err) {
    console.error("PayPal captureOrder error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to capture PayPal order" });
  }
}
