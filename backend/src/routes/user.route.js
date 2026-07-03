import { Router } from "express";
import passport from "../config/passport.js";
import {
  signupUser,
  login,
  logout,
  googleCallback,
} from "../controllers/user.controller.js";
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

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
  }),
);
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err || !user) {
      const reason = info?.message || "google_auth_failed";
      return res.redirect(`${process.env.CLIENT_URL}/login?error=${reason}`);
    }
    req.user = user;
    return googleCallback(req, res);
  })(req, res, next);
});
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/check-auth").get(verifyToken, checkAuth);

export default router;
