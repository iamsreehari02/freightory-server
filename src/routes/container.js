import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  addContainer,
  fetchNextContainerId,
  getAllContainers,
} from "../controllers/container.js";
import RoleCheck from "../middleware/roleCheck.js";

const router = express.Router();

router.post("/", requireAuth, RoleCheck(["nvocc"]), addContainer);
router.get("/next-id", requireAuth, RoleCheck(["nvocc"]), fetchNextContainerId);
router.get("/", requireAuth, RoleCheck(["nvocc", "admin"]), getAllContainers);

export default router;
