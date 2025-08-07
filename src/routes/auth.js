import express from "express";
import {
  getMe,
  login,
  logout,
  register,
  updateUserAndCompany,
} from "../controllers/auth.js";
import { requestOtp, verifyOtp } from "../controllers/otp.js";
import { requireAuth } from "../middleware/auth.js";
import RoleCheck from "../middleware/roleCheck.js";

const router = express.Router();

// router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getMe);

router.patch("/", requireAuth, RoleCheck(["admin"]), updateUserAndCompany);

router.post("/register", register);

router.post("/otp/request", requestOtp);

// POST /api/auth/otp/verify
router.post("/otp/verify", verifyOtp);

export default router;
