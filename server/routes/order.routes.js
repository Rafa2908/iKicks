import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getOrderDetails,
  getOrderPreview,
  placeOrder,
} from "../controllers/order.controllers.js";
import { getDataLimiter, orderLimiter } from "../utils/rateLimiter.js";

const orderRouter = Router();

orderRouter.route("/place").post(authMiddleware, orderLimiter, placeOrder);
orderRouter.route("/preview").get(authMiddleware, getDataLimiter, getOrderPreview);
orderRouter.route("/details/:shippingId").get(authMiddleware, getDataLimiter, getOrderDetails);

export default orderRouter;
