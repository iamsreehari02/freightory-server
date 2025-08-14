export const supportEmail = `
<html>
  <head>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #f4f4f7;
        padding: 30px;
        color: #333;
      }
      .card {
        max-width: 600px;
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
      .info {
        margin-bottom: 15px;
      }
      .info strong {
        display: inline-block;
        width: 100px;
      }
      .message {
        background-color: #f9f9f9;
        border-radius: 5px;
        padding: 15px;
        margin-top: 10px;
        white-space: pre-wrap;
        line-height: 1.5;
      }
      .footer {
        font-size: 12px;
        color: #888;
        text-align: center;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">New User Feedback</div>

      <div class="info"><strong>Name:</strong> {{ NAME }}</div>
      <div class="info"><strong>Email:</strong> {{ EMAIL }}</div>
      <div class="info"><strong>Type:</strong> {{ TYPE }}</div>

      <div><strong>Message:</strong></div>
      <div class="message">{{ MESSAGE }}</div>

      <div class="footer">
        This email was sent automatically from the feedback system.
      </div>
    </div>
  </body>
</html>
`;
