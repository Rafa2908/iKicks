import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addShippingAddress,
  deleteShippingAddress,
  updateShippingAddress,
  userShippingAddresses,
} from "../controllers/shipping.controller.js";

const shippingRouter = Router();

shippingRouter.route("/add").post(authMiddleware, addShippingAddress);
shippingRouter.route("/addresses").get(authMiddleware, userShippingAddresses);
shippingRouter.route("/update").put(authMiddleware, updateShippingAddress);
shippingRouter.route("/delete").delete(authMiddleware, deleteShippingAddress);

export default shippingRouter;
