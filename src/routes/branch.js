import express from "express";
import RoleCheck from "../middleware/roleCheck.js";
import { requireAuth } from "../middleware/auth.js";
import {
    createBranchController, deleteBranchController,
    getBranchByIdController,
    getBranchesByCompanyController,
    getLatestBranch,
    getUpcomingRenewalsController
} from "../controllers/branch.js";
import { handleGetAllBranchLogs } from "../controllers/branchLog.js";

const router = express.Router();

router.post("/", requireAuth, RoleCheck(["freight_forwarder"]), createBranchController);

router.get(
  "/upcoming-renewals",
  requireAuth,
  RoleCheck(["freight_forwarder"]),
  getUpcomingRenewalsController
);

router.get("/company", requireAuth, RoleCheck(["freight_forwarder"]), getBranchesByCompanyController);
router.get("/company/latest", requireAuth, RoleCheck(["freight_forwarder"]), getLatestBranch);


router.get(
  "/logs",
  requireAuth,
  RoleCheck(["freight_forwarder"]),
  handleGetAllBranchLogs
);


router.delete("/:id", requireAuth, RoleCheck(["freight_forwarder"]), deleteBranchController);
router.get("/:id", requireAuth, RoleCheck(["freight_forwarder"]), getBranchByIdController);


export default router;
