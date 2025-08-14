import User from "../models/User.js";
import { sendUserFeedback } from "../services/supportEmail.js";

export async function submitFeedback(req, res) {
    try {
        const { type, message } = req.body;

        if (!type || !message) {
            return res.status(400).json({ error: "Type and message are required" });
        }

        // Get the logged-in user
        const user = await User.findById(req.user.userId).populate("companyId").select("name email");
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        await sendUserFeedback({
            name: user.companyId.companyName || user.name || "Unknown User",
            email: user.email,
            type,
            message
        });

        return res.status(200).json({ message: "Feedback sent successfully" });
    } catch (error) {
        console.error("Error sending feedback:", error);
        return res.status(500).json({ error: "Failed to send feedback" });
    }
}
