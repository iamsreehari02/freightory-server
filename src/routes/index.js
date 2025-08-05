import express from "express";
import authRoutes from "./auth.js";
import resetPasswordRoute from "./resetPassword.js";
import paypalRoutes from "./paypal.js";
import usersRoutes from "./users.js";
import dashboardRoutes from "./dashboard.js";
import containerRoutes from "./container.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/auth/password", resetPasswordRoute);
router.use("/paypal", paypalRoutes);
router.use("/users", usersRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/containers", containerRoutes);

export default router;
