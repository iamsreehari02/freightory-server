import express from "express";
import { submitFeedback } from "../controllers/supportEmail.js";
import { requireAuth } from "../middleware/auth.js";
import { handleSupportRequest } from "../controllers/adminSupport.js";
import RoleCheck from "../middleware/roleCheck.js";

const router = express.Router();

router.post("/", requireAuth, submitFeedback);
router.post("/admin", requireAuth , RoleCheck(["admin"]), handleSupportRequest);

export default router;
