import axios from "axios";

const base = process.env.PAYPAL_API_BASE; // https://api-m.sandbox.paypal.com or https://api-m.paypal.com
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

// 🔑 Get OAuth2 token
async function getAccessToken() {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const { data } = await axios.post(
    `${base}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return data.access_token;
}

export async function createOrder(amount, currency = "USD") {

  const token = await getAccessToken();

  const { data } = await axios.post(
    `${base}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toString(),
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data; // contains id (orderID)
}

export async function captureOrder(orderId) {
  const token = await getAccessToken();

  const { data } = await axios.post(
    `${base}/v2/checkout/orders/${orderId}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return data; // contains payment status, payer info, transaction ID etc.
}
