import { Router } from "express";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactions.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get("/",       verifyToken, getTransactions);
router.post("/",      verifyToken, createTransaction);
router.put("/:id",    verifyToken, updateTransaction);
router.delete("/:id", verifyToken, deleteTransaction);

export default router;
