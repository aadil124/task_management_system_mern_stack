import express from "express";
import verifyToken from "../middlewares/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

// AUTH CONTROLLERS
import {
  signup,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/auth/signupController.js";

import { login } from "../controllers/auth/loginController.js";

import {
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/auth/passwordController.js";

import {
  getProfile,
  updateProfile,
} from "../controllers/auth/profileController.js";

const router = express.Router();

/* PUBLIC ROUTES */
router.post("/signup", signup);
router.post("/login", login);

router.get("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/* PROTECTED ROUTES */
router.get("/profile", verifyToken, getProfile);

router.put("/profile", verifyToken, upload.single("avatar"), updateProfile);

router.put("/change-password", verifyToken, changePassword);

export default router;
