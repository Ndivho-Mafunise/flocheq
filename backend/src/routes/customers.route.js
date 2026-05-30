import { Router } from "express";
import {
  getCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customers.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = Router();

router.get("/",     verifyToken, getCustomers);
router.post("/",    verifyToken, createCustomer);
router.get("/:id",  verifyToken, getCustomer);
router.put("/:id",  verifyToken, updateCustomer);
router.delete("/:id", verifyToken, deleteCustomer);

export default router;
