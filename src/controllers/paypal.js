import { capturePayPalOrder } from "../services/paypal.js";

export const captureOrder = async (req, res) => {
  try {
    const { orderID } = req.body;

    const data = await capturePayPalOrder(orderID);

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, error: "Payment capture failed" });
  }
};
