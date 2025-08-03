import { createPayPalAxiosInstance } from "../config/paypal.js";

export const capturePayPalOrder = async (orderID) => {
  const paypal = await createPayPalAxiosInstance();

  const { data } = await paypal.post(`/v2/checkout/orders/${orderID}/capture`);

  return data;
};
