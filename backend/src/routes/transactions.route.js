import { Router } from "express";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactions.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/", verifyToken, getTransactions);
router.post("/", verifyToken, authorize("admin", "user"), createTransaction);
router.put("/:id", verifyToken, authorize("admin", "user"), updateTransaction);
router.delete("/:id", verifyToken, authorize("admin"), deleteTransaction);

export default router;
