import { Router } from "express";
import placeOrder, {
  userOrders,
  verifyOrder,
} from "../controllers/order.controllers.js";
import authMiddleware from "../middleware/auth.js";

const orderRouter = Router();

orderRouter.route("/place").post(authMiddleware, placeOrder);
orderRouter.route("/verify").post(authMiddleware, verifyOrder);
orderRouter.route("/userorders").get(authMiddleware, userOrders);

export default orderRouter;
