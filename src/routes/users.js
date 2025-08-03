import express from "express";
import { requireAuth } from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";
import {
  getUsersController,
  getUserCountController,
} from "../controllers/users.js";

const router = express.Router();

router.get("/", requireAuth, roleCheck(["admin"]), getUsersController);
router.get("/count", requireAuth, roleCheck(["admin"]), getUserCountController);

export default router;
