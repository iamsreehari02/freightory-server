import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Otp from "../models/Otp.js";

export const resetUserPassword = async (email, newPassword) => {
  const latestOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });

  if (!latestOtp || !latestOtp.used) {
    throw new Error("OTP verification required before password reset");
  }

  const hashed = await bcrypt.hash(newPassword, 12);

  const user = await User.findOneAndUpdate(
    { email },
    { password: hashed },
    { new: true }
  );

  if (!user) throw new Error("User not found");

  // Optional: clean up all OTPs for this email
  await Otp.deleteMany({ email });

  return true;
};
