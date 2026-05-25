import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addToCart,
  decreaseQuantityInCart,
  deleteCartItem,
  getCartItemsPreview,
  increaseQuantityInCart,
} from "../controllers/cart.controllers.js";
import { getDataLimiter, updateDataLimiter } from "../utils/rateLimiter.js";

const cartRouter = Router();

cartRouter.route("/add").post(updateDataLimiter, addToCart);
cartRouter.route("/increase").put(authMiddleware, updateDataLimiter, increaseQuantityInCart);
cartRouter.route("/decrease").put(authMiddleware, updateDataLimiter, decreaseQuantityInCart);
cartRouter.route("/preview").get(authMiddleware, getDataLimiter, getCartItemsPreview);
cartRouter.route("/delete").delete(authMiddleware, updateDataLimiter, deleteCartItem);

export default cartRouter;
