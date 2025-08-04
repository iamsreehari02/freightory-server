import express from "express";
import { requireAuth } from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";
import {
  getUsersController,
  getUserCountController,
  handleGetUserById,
} from "../controllers/users.js";
import {
  deleteUserController,
  suspendUserController,
} from "../controllers/auth.js";

const router = express.Router();

router.get("/", requireAuth, roleCheck(["admin"]), getUsersController);
router.get("/count", requireAuth, roleCheck(["admin"]), getUserCountController);

router.delete(
  "/:userId",
  requireAuth,
  roleCheck(["admin"]),
  deleteUserController
);
router.patch(
  "/suspend/:userId",
  requireAuth,
  roleCheck(["admin"]),
  suspendUserController
);

router.get("/:id", requireAuth, roleCheck(["admin"]), handleGetUserById);

// router.post("/send-email", sendEmailController);

export default router;
