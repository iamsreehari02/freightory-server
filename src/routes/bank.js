import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  handleAddBankDetails,
  handleGetBankDetails,
  handleUpdateBankDetails,
} from "../controllers/bank.js";
import RoleCheck from "../middleware/roleCheck.js";

const router = express.Router();

router.post("/", requireAuth, RoleCheck(["admin"]), handleAddBankDetails);

router.patch("/", requireAuth, RoleCheck(["admin"]), handleUpdateBankDetails);

router.get("/", handleGetBankDetails);

export default router;
