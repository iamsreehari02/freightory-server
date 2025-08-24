import { supportEmail } from "../templates/supportEmail.js";
import { sendEmailTemplate } from "./email.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@indlognetwork.com";

export async function sendUserFeedback({ name, email, type, message }) {
  const subject = `[User Feedback] ${type} - from ${name}`;

  return await sendEmailTemplate({
    to: ADMIN_EMAIL,
    subject,
    htmlTemplate: supportEmail,
    replacements: {
      NAME: name,
      EMAIL: email,
      TYPE: type,
      MESSAGE: message,
    },
  });
}
