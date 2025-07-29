import express from "express";
import authRoutes from "./auth.js";
import resetPasswordRoute from "./resetPassword.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/auth/password", resetPasswordRoute);

export default router;
