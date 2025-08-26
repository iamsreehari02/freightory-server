import express from "express";
import authRoutes from "./auth.js";
import resetPasswordRoute from "./resetPassword.js";
import paypalRoutes from "./paypal.js";
import usersRoutes from "./users.js";
import dashboardRoutes from "./dashboard.js";
import containerRoutes from "./container.js";
import portRoutes from "./port.js";
import supportEmailRoutes from "./supportEmail.js";
import contactLeadRoutes from "./contactLead.js";
import branchRoutes from "./branch.js";
import companyRoutes from "./company.js";
import bankRoutes from "./bank.js";
import paymentProofRoutes from "./paymentProof.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/auth/password", resetPasswordRoute);
router.use("/paypal", paypalRoutes);
router.use("/users", usersRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/containers", containerRoutes);
router.use("/port", portRoutes);
router.use("/support", supportEmailRoutes);
router.use("/leads", contactLeadRoutes);
router.use("/branch", branchRoutes);
router.use("/companies", companyRoutes);
router.use("/bank", bankRoutes);
router.use("/payment-proof", paymentProofRoutes);

export default router;
