import express from "express";
import { captureOrder } from "../controllers/paypal.js";
// import { verifyUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/capture", captureOrder);

export default router;
