import express from "express";
import RoleCheck from "../middleware/roleCheck.js";
import { requireAuth } from "../middleware/auth.js";
import {
    createBranchController, deleteBranchController,
    getBranchByIdController,
    getBranchesByCompanyController,
} from "../controllers/branch.js";

const router = express.Router();

router.post("/", requireAuth, RoleCheck(["freight_forwarder"]), createBranchController);
router.delete("/:id", requireAuth, RoleCheck(["freight_forwarder"]), deleteBranchController);
router.get("/:id", requireAuth, RoleCheck(["freight_forwarder"]), getBranchByIdController);
router.get("/company/:companyId", requireAuth, RoleCheck(["freight_forwarder"]), getBranchesByCompanyController);

export default router;
