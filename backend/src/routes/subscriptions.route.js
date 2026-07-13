import { Router } from "express";
import { checkoutSession } from "../controllers/subscriptions.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();
router.route("/checkout-session").post(verifyToken, checkoutSession);
export default router;
