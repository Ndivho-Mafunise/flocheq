import { Router } from "express";
import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoices.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get("/",       verifyToken, getInvoices);
router.post("/",      verifyToken, createInvoice);
router.put("/:id",    verifyToken, updateInvoice);
router.delete("/:id", verifyToken, deleteInvoice);

export default router;
