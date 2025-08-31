import express from "express";
import {
  downloadInvoice,
  getTransactions,
  getTransactionsForCompany,
} from "../controllers/transactions.js";
import { requireAuth } from "../middleware/auth.js";
import RoleCheck from "../middleware/roleCheck.js";

const router = express.Router();

// Get transactions for a specific company
router.get(
  "/company",
  requireAuth,
  RoleCheck(["nvocc", "freight_forwarder"]),
  getTransactionsForCompany
);

// Get all transactions
router.get("/", requireAuth, RoleCheck(["admin"]), getTransactions);

router.get("/:id/invoice", downloadInvoice);

export default router;
