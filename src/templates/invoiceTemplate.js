export function generateInvoiceTemplate({
  companyName,
  transactionNumber,
  transactionId,
  amount,
  country,
  date,
}) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
      <div style="max-width: 700px; margin: auto; border: 1px solid #e5e5e5; padding: 20px; border-radius: 10px;">
        <!-- Company Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="YOUR_LOGO_URL" alt="Logo" style="max-width: 150px;" />
        </div>

        <h2 style="color: #111; text-align: center;">Payment Invoice</h2>
        <hr style="border: none; border-top: 1px solid #e5e5e5;" />

        <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Company Name:</td>
            <td style="padding: 8px;">${companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Transaction Number:</td>
            <td style="padding: 8px; color: #007BFF;">${transactionNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Transaction ID:</td>
            <td style="padding: 8px;">${transactionId}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Country:</td>
            <td style="padding: 8px;">${country}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Amount Paid:</td>
            <td style="padding: 8px; font-weight: bold; color: #28a745;">$${amount}</td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Payment Date:</td>
            <td style="padding: 8px;">${date}</td>
          </tr>
        </table>

        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />

        <p style="text-align: center; color: #666;">
          Thank you for your payment! If you have any questions, please contact us.
        </p>
      </div>
    </body>
  </html>
  `;
}
