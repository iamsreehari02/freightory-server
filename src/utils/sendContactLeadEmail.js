import { sendEmailTemplate } from "../services/email.js";
import { contactLeadEmail } from "../templates/contactLeadEmail.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "sh981572@gmail.com";

export async function sendContactLeadEmail({ name, companyName, email, phone, message }) {
  const subject = `[Contact Form] New message from ${name} (${companyName || "No Company"})`;

  return await sendEmailTemplate({
    to: ADMIN_EMAIL,
    subject,
    htmlTemplate: contactLeadEmail,
    replacements: {
      NAME: name,
      COMPANY: companyName || "N/A",
      EMAIL: email,
      PHONE: phone || "N/A",
      MESSAGE: message,
    },
  });
}
