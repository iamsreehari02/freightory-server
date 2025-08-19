import { resetUserPassword } from "../services/resetPassword.js";

export const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    await resetUserPassword(email, newPassword);
    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset error:", err);
    return res.status(400).json({ message: err.message });
  }
};
