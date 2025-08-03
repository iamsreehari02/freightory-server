import express from "express";
import { getMe, login, logout, register, signup } from "../controllers/auth.js";
import { requestOtp, verifyOtp } from "../controllers/otp.js";

const router = express.Router();

// router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getMe);

router.post("/register", register);

router.post("/otp/request", requestOtp);

// POST /api/auth/otp/verify
router.post("/otp/verify", verifyOtp);

export default router;
