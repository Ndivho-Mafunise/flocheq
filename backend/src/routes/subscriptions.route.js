import { Router } from "express";
import {
  checkoutSession,
  portalSession,
  getSubscription,
} from "../controllers/subscriptions.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();
router.route("/").get(verifyToken, getSubscription);
router.route("/checkout-session").post(verifyToken, checkoutSession);
router.route("/portal-session").post(verifyToken, portalSession);
export default router;
