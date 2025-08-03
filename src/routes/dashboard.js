import express from "express";
import { fetchDashboardStats } from "../controllers/dashboard.js";
import { requireAuth } from "../middleware/auth.js";
import RoleCheck from "../middleware/roleCheck.js";

const router = express.Router();

router.get("/stats", requireAuth, RoleCheck(["admin"]), fetchDashboardStats);

export default router;
