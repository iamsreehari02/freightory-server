import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";

export async function saveOTP(email, otp, ttl = 5 * 60 * 1000) {
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + ttl);

  await Otp.create({ email, otpHash, expiresAt });
}

export async function verifyOTP(email, inputOtp) {
  const record = await Otp.findOne({ email, used: false }).sort({
    createdAt: -1,
  });

  if (!record) return false;
  if (record.expiresAt < new Date()) return false;

  const isMatch = await bcrypt.compare(inputOtp, record.otpHash);
  if (!isMatch) return false;

  record.used = true;
  await record.save();

  return true;
}
