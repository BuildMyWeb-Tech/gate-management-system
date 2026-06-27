import { Router } from "express";
import { login, getGates, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { loginRateLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Public
router.post("/login", loginRateLimiter, login);
router.get("/gates", getGates);          // called before login to populate dropdown

// Protected
router.get("/me", protect, getMe);

export default router;