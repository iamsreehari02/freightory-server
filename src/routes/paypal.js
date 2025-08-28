import express from "express";
import {
  createPayPalOrder,
  capturePayPalOrder,
  handlePayPalWebhook,
} from "../controllers/paypal.js";
// import { verifyUser } from "../middlewares/auth.middleware.js"; // optional if auth is needed

const router = express.Router();

// Create a new PayPal order
router.post("/create", createPayPalOrder);

// Capture an existing PayPal order
router.post("/capture", capturePayPalOrder);

router.post("/webhook", handlePayPalWebhook);

export default router;
