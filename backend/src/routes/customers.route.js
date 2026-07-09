import { Router } from "express";
import {
  getCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customers.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorize } from "../middleware/authorize.js";

const router = Router();

router.get("/", verifyToken, getCustomers);
router.post("/", verifyToken, authorize("admin", "user"), createCustomer);
router.get("/:id", verifyToken, getCustomer);
router.put("/:id", verifyToken, authorize("admin", "user"), updateCustomer);
router.delete("/:id", verifyToken, authorize("admin"), deleteCustomer);

export default router;
