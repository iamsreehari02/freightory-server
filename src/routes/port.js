import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { getPorts } from "../controllers/port.js";
import RoleCheck from "../middleware/roleCheck.js";

const router = express.Router();

router.get("/", requireAuth, RoleCheck(["nvocc"]), getPorts);

export default router;
