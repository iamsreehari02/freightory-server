
export function adminSupportEmailTemplate({ subject, description, userEmail }) {
  return `
  <html>
  <body style="font-family: Arial, sans-serif; line-height:1.5; color:#333;">
    <h2 style="color:#2a2a2a;">New Support Request</h2>
    <p><strong>From:</strong> ${userEmail}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <hr />
    <p><strong>Description:</strong></p>
    <p style="white-space: pre-wrap;">${description}</p>
    <hr />
    <p>This email was generated automatically from your app.</p>
  </body>
  </html>
  `;
}
