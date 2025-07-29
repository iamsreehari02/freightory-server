import User from "../models/User.js";
import { sendEmailTemplate } from "../services/email.js";
import { saveOTP, verifyOTP } from "../services/otp.js";
import { otpEmailTemplate } from "../templates/otpEmail.js";
import { generateOTP } from "../utils/otp.js";

export async function requestOtp(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "This email is not registered" });
    }
    const otp = generateOTP();
    saveOTP(email, otp);

    await sendEmailTemplate({
      to: email,
      subject: "Your OTP Code",
      htmlTemplate: otpEmailTemplate,
      replacements: {
        OTP: otp,
      },
    });

    return res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("OTP send error:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
}

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const isValid = await verifyOTP(email, otp);
    if (!isValid)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verify error:", error);
    return res.status(500).json({ message: "OTP verification failed" });
  }
}
