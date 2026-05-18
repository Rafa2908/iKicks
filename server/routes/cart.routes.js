import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addToCart,
  decreaseQuantityInCart,
  increaseQuantityInCart,
} from "../controllers/cart.controllers.js";

const cartRouter = Router();

cartRouter.route("/add").post(addToCart);
cartRouter.route("/increase").put(authMiddleware, increaseQuantityInCart);
cartRouter.route("/decrease").put(authMiddleware, decreaseQuantityInCart);

export default cartRouter;
