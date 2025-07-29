export const otpEmailTemplate = `
  <html>
    <head>
      <style>
        .container {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f4f4f7;
          padding: 30px;
          color: #333;
        }
        .card {
          max-width: 500px;
          margin: auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          padding: 30px;
        }
        .header {
          font-size: 20px;
          font-weight: 600;
          color: #0050b3;
          margin-bottom: 20px;
        }
        .otp {
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 4px;
          color: #0050b3;
          margin: 20px 0;
        }
        .footer {
          font-size: 12px;
          color: #888;
          text-align: center;
          margin-top: 30px;
        }
        .brand {
          font-size: 14px;
          font-weight: bold;
          color: #444;
          text-align: center;
          margin-top: 40px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">Password Reset Request</div>
          <p>Hello,</p>
          <p>We received a request to reset your password for your Freightory account.</p>
          <p>Please use the following one-time password (OTP) to continue:</p>
          <div class="otp">{{ OTP }}</div>
          <p>This code is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
          <hr />
          <p class="footer">
            If you didn't request a password reset, you can safely ignore this email.
          </p>
          <div class="brand">— Freightory Team</div>
        </div>
      </div>
    </body>
  </html>
`;
