import express from "express";
import { getMe, login, logout, register, signup } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getMe);

router.post("/register", register);

export default router;
