export const contactLeadEmail = `
<html>
  <body style="font-family: Arial, sans-serif; background: #f4f4f7; padding: 20px;">
    <div style="max-width:600px; margin:auto; background:#fff; padding:20px; border-radius:8px;">
      <h2 style="color:#333;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> {{ NAME }}</p>
      <p><strong>Company:</strong> {{ COMPANY }}</p>
      <p><strong>Email:</strong> {{ EMAIL }}</p>
      <p><strong>Phone:</strong> {{ PHONE }}</p>
      <p><strong>Message:</strong></p>
      <p style="background:#f9f9f9; padding:10px; border-radius:5px;">{{ MESSAGE }}</p>
      <hr/>
      <small style="color:#888;">This email was generated from your website contact form.</small>
    </div>
  </body>
</html>
`;
