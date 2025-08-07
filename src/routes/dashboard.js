import express from "express";
import {
  fetchDashboardStats,
  fetchNvoccDashboardStats,
} from "../controllers/dashboard.js";
import { requireAuth } from "../middleware/auth.js";
import RoleCheck from "../middleware/roleCheck.js";

const router = express.Router();

router.get("/stats", requireAuth, RoleCheck(["admin"]), fetchDashboardStats);

router.get(
  "/nvocc",
  requireAuth,
  RoleCheck(["nvocc"]),
  fetchNvoccDashboardStats
);

export default router;
