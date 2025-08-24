import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  addContainer,
  deleteContainer,
  fetchNextContainerId,
  getAllContainers,
  getCompanyContainers,
  getContainerByIdController,
  getLatestContainersController,
  handleGetAllContainerLogs,
  handleUpdateContainerStatus,
} from "../controllers/container.js";
import RoleCheck from "../middleware/roleCheck.js";

const router = express.Router();

router.post("/", requireAuth, RoleCheck(["nvocc"]), addContainer);
router.get("/next-id", requireAuth, RoleCheck(["nvocc"]), fetchNextContainerId);

router.get(
  "/",
  requireAuth,
  RoleCheck(["nvocc", "freight_forwarder"]),
  getAllContainers
);

router.get("/company", requireAuth, RoleCheck(["nvocc"]), getCompanyContainers);

router.patch(
  "/:id/status",
  requireAuth,
  RoleCheck(["nvocc"]),
  handleUpdateContainerStatus
);

router.patch("/:id/delete", requireAuth, RoleCheck(["nvocc"]), deleteContainer);

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

router.get(
  "/:id",
  requireAuth,
  RoleCheck(["nvocc"]),
  getContainerByIdController
);

export default router;
