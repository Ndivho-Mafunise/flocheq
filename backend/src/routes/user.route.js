import { Router } from "express";
import { signupUser, login, logout } from "../controllers/user.controller.js";
import {
  checkAuth,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { blockRegistration } from "../middleware/blockRegistration.js";

const router = Router();

router.route("/register").post(blockRegistration, signupUser);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/check-auth").get(verifyToken, checkAuth);

export default router;
