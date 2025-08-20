import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";

export async function saveOTP(email, otp, ttl = 5 * 60 * 1000) {
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + ttl);

  await Otp.create({ email, otpHash, expiresAt });
}

export async function verifyOTP(email, inputOtp) {
  try {
    const record = await Otp.findOne({ email, used: false }).sort({
      createdAt: -1,
    });

    if (!record) {
      console.error(
        `OTP verification failed: No OTP record found for ${email}`
      );
      return false;
    }

    if (record.expiresAt < new Date()) {
      console.error(`OTP verification failed: OTP expired for ${email}`);
      return false;
    }

    const isMatch = await bcrypt.compare(inputOtp, record.otpHash);
    if (!isMatch) {
      console.error(`OTP verification failed: Incorrect OTP for ${email}`);
      return false;
    }

    record.used = true;
    await record.save();

    console.log(`OTP verification successful for ${email}`);
    return true;
  } catch (err) {
    console.error(`OTP verification error for ${email}:`, err);
    return false;
  }
}
