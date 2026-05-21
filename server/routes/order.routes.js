import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  getOrderDetails,
  getOrderPreview,
  placeOrder,
} from "../controllers/order.controllers.js";
authMiddleware;

const orderRouter = Router();

orderRouter.route("/place").post(authMiddleware, placeOrder);
orderRouter.route("/preview").get(authMiddleware, getOrderPreview);
orderRouter.route("/details/:shippingId").get(authMiddleware, getOrderDetails);

export default orderRouter;
