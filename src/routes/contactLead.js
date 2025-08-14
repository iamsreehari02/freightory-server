import express from "express";
import { fetchContactLeads, fetchLeadById, handleContactLead } from "../controllers/contactLead.js";
import { requireAuth } from "../middleware/auth.js";
import RoleCheck from "../middleware/roleCheck.js";

const router = express.Router();

router.post("/", handleContactLead);

router.get("/", requireAuth, RoleCheck(["admin"]), fetchContactLeads);

router.get("/:id", requireAuth, RoleCheck(["admin"]), fetchLeadById);

export default router;
