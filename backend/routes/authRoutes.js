import express from "express";
import {
  registerController,
  loginController,
  verifyOtpController,
  editProfileController,
  requestPasswordResetController,
  verifyOtpAndResetPasswordController,
} from "../controllers/authController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/verify-otp", verifyOtpController);
router.put("/edit-profile/:userId", requireSignIn, editProfileController);

router.post("/request-password-reset", requestPasswordResetController);
router.post("/verify-otp-reset-password", verifyOtpAndResetPasswordController);

export default router;
