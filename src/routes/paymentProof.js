import express from "express";
import multer from "multer";
import {
  uploadPaymentProof,
  getAllPaymentProofs,
  updatePaymentProofStatus,
  approvePaymentProofController,
  rejectPaymentProofController,
} from "../controllers/paymentProof.js";
import { requireAuth } from "../middleware/auth.js";
import RoleCheck from "../middleware/roleCheck.js";

const router = express.Router();
const upload = multer({ dest: "tmp/" });

// Upload payment proof (user)
router.post("/upload", upload.single("file"), uploadPaymentProof);

router.get("/", requireAuth, RoleCheck(["admin"]), getAllPaymentProofs);

router.patch(
  "/status",
  requireAuth,
  RoleCheck(["admin"]),
  updatePaymentProofStatus
);

router.post(
  "/approve",
  requireAuth,
  RoleCheck(["admin"]),
  approvePaymentProofController
);

router.post(
  "/reject",
  requireAuth,
  RoleCheck(["admin"]),
  rejectPaymentProofController
);

export default router;
