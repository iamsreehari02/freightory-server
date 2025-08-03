import axios from "axios";

export const getPayPalAccessToken = async () => {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const { data } = await axios.post(
    `${process.env.PAYPAL_API_BASE}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return data.access_token;
};

export const createPayPalAxiosInstance = async () => {
  const token = await getPayPalAccessToken();

  return axios.create({
    baseURL: process.env.PAYPAL_API_BASE,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
