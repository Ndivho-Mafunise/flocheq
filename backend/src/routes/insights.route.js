import { Router } from "express";
import { getInsights } from "../controllers/insights.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get("/", verifyToken, getInsights);

export default router;
