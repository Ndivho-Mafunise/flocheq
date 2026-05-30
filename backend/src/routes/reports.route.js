import { Router } from "express";
import { getReports } from "../controllers/reports.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get("/", verifyToken, getReports);

export default router;
