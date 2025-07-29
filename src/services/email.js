import axios from "axios";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = "admin@indlognetwork.com";

export async function sendEmailTemplate({
  to,
  subject,
  htmlTemplate,
  replacements = {},
}) {
  let html = htmlTemplate;

  for (const [key, value] of Object.entries(replacements)) {
    html = html.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), value);
  }

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Freightory",
          email: BREVO_SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(" Email sent via Brevo:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error(
      "Failed to send email via Brevo:",
      error.response?.data || error.message
    );
    throw new Error("Failed to send email");
  }
}
