import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  addContainer,
  fetchNextContainerId,
  getAllContainers,
  getLatestContainersController,
  handleGetAllContainerLogs,
  handleUpdateContainerStatus,
} from "../controllers/container.js";
import RoleCheck from "../middleware/roleCheck.js";

const router = express.Router();

router.post("/", requireAuth, RoleCheck(["nvocc"]), addContainer);
router.get("/next-id", requireAuth, RoleCheck(["nvocc"]), fetchNextContainerId);
router.get("/", requireAuth, RoleCheck(["nvocc", "admin"]), getAllContainers);

router.patch(
  "/:id/status",
  requireAuth,
  RoleCheck(["nvocc"]),
  handleUpdateContainerStatus
);

router.get(
  "/logs",
  requireAuth,
  RoleCheck(["nvocc", "admin"]),
  handleGetAllContainerLogs
);

router.get(
  "/latest",
  requireAuth,
  RoleCheck(["nvocc"]),
  getLatestContainersController
);

export default router;
