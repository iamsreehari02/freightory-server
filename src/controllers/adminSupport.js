import User from "../models/User.js";
import { sendSupportRequest } from "../services/adminSupport.js";

export async function handleSupportRequest(req, res) {
  try {
    const { subject, description } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await User.findById(req.user.userId).select("email").lean();
    if (!user || !user.email) {
      return res.status(400).json({ error: "User email not found" });
    }

    const userEmail = user.email;

    await sendSupportRequest({ subject, description, userEmail });

    return res.status(200).json({ message: "Support request sent successfully" });
  } catch (error) {
    console.error("Support request error:", error);
    return res.status(500).json({ error: "Failed to send support request" });
  }
}