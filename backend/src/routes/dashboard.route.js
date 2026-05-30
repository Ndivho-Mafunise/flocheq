import { Router } from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get("/", verifyToken, getDashboardData);

export default router;
