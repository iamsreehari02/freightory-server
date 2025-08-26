import express from "express";
import {
  fetchCompanies,
  fetchCompanyById,
  getPaymentSummary,
} from "../controllers/company.js";

const router = express.Router();

router.get("/", fetchCompanies);
router.get("/:id", fetchCompanyById);
router.get("/payment/summary", getPaymentSummary);

export default router;
