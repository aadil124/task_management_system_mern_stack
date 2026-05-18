import express from "express";
import rateLimit from "express-rate-limit";
import {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  resendVerificationEmail,
} from "../controllers/authController.js";

import verifyToken from "../middlewares/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many requests. Try again later.",
  },
});

// public
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-verification", authLimiter, resendVerificationEmail);

// protected
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, upload.single("avatar"), updateProfile);
router.put("/change-password", verifyToken, changePassword);

export default router;
