import { Router } from "express";
import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoices.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/", verifyToken, getInvoices);
router.post("/", verifyToken, authorize("admin", "user"), createInvoice);
router.put("/:id", verifyToken, authorize("admin", "user"), updateInvoice);
router.delete("/:id", verifyToken, authorize("admin", "user"), deleteInvoice);

export default router;
