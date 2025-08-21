import express from "express";
import { fetchCompanies, fetchCompanyById } from "../controllers/company.js";

const router = express.Router();

router.get("/", fetchCompanies);
router.get("/:id", fetchCompanyById);

export default router;
