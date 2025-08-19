import { adminSupportEmailTemplate } from "../templates/adminSupport.js";
import { sendEmailTemplate } from "./email.js";

export async function sendSupportRequest({ subject, description, userEmail }) {
  const html = adminSupportEmailTemplate({ subject, description, userEmail });

  const to = process.env.SUPPORT_EMAIL || "sh981572@gmail.com";

  await sendEmailTemplate({
    to,
    subject: `Support Request: ${subject}`,
    htmlTemplate: html,
  });
}