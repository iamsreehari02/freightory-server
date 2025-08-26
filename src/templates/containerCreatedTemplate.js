export function containerEmailTemplate({
  containerNumber,
  origin,
  destination,
  createdBy,
  agentDetails,
}) {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f7f7f7; padding: 20px; margin: 0;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); padding: 20px;">
        
        <!-- Header -->
        <h2 style="color: #2a2a2a; text-align: center; margin-bottom: 10px;">🚢 New Container Created</h2>
        <p style="text-align: center; font-size: 14px; color: #555;">
          A new container has been added by <strong>${createdBy}</strong>.
        </p>

        <!-- Table -->
        <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; background: #f1f1f1;">Container Number</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${containerNumber}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; background: #f1f1f1;">Origin Port</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${origin}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; background: #f1f1f1;">Destination</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${destination}</td>
          </tr>
          ${
            agentDetails
              ? `
          <tr>
            <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold; background: #f1f1f1;">Agent Details</td>
            <td style="border: 1px solid #ddd; padding: 10px;">${agentDetails}</td>
          </tr>`
              : ""
          }
        </table>

        <!-- Footer -->
        <p style="margin-top: 20px; font-size: 14px; color: #555;">
          Login to your <strong>INDLOG NETWORK</strong> account to view more details and manage containers.
        </p>

        <!-- Button -->
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://app.indlognetwork.com/login"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #584bd4;
              color: #ffffff;
              border-radius: 5px;
              text-decoration: none;
              font-weight: bold;
              text-align: center;
              -webkit-text-size-adjust: none;
              mso-padding-alt: 0;
            ">
            View Container
          </a>
        </div>

        <p style="margin-top: 25px; font-size: 12px; color: #888; text-align: center;">
          This is an automated email. Please do not reply.
        </p>
      </div>
    </body>
  </html>
  `;
}
