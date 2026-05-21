import { Router } from "express";
import { signupUser, login, logout } from "../controllers/user.controller.js";
import {
    checkAuth,
  forgetPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.route("/register").post(signupUser);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/check-auth").get(verifyToken, checkAuth);

export default router;
