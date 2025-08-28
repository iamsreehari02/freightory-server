import express from "express";
import {
  getTransactions,
  getTransactionsForCompany,
} from "../controllers/transactions.js";

const router = express.Router();

// Get transactions for a specific company
router.get("/company/:companyId", getTransactionsForCompany);

// Get all transactions
router.get("/", getTransactions);

export default router;
