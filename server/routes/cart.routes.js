import { Router } from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controllers.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = Router();

cartRouter.route("/add").post(authMiddleware, addToCart);
cartRouter.route("/remove").post(authMiddleware, removeFromCart);
cartRouter.route("/get").get(authMiddleware, getCart);

export default cartRouter;
