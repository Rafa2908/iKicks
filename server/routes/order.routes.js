import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import { placeOrder } from "../controllers/order.controllers.js";
authMiddleware;

const orderRouter = Router();

orderRouter.route("/place").post(authMiddleware, placeOrder);

export default orderRouter;
