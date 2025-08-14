import { supportEmail } from "../templates/supportEmail.js";
import { sendEmailTemplate } from "./email.js";

const ADMIN_EMAIL = "sh981572@gmail.com"; // hardcoded admin receiver

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
