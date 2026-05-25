import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addShippingAddress,
  deleteShippingAddress,
  updateShippingAddress,
  userShippingAddresses,
} from "../controllers/shipping.controller.js";
import { getDataLimiter, updateDataLimiter } from "../utils/rateLimiter.js";

const shippingRouter = Router();

shippingRouter.route("/add").post(authMiddleware, updateDataLimiter, addShippingAddress);
shippingRouter.route("/addresses").get(authMiddleware, getDataLimiter, userShippingAddresses);
shippingRouter.route("/update").put(authMiddleware, updateDataLimiter, updateShippingAddress);
shippingRouter.route("/delete").delete(authMiddleware, updateDataLimiter, deleteShippingAddress);

export default shippingRouter;
