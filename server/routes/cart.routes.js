import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addToCart,
  decreaseQuantityInCart,
  deleteCartItem,
  getCartItemsPreview,
  increaseQuantityInCart,
} from "../controllers/cart.controllers.js";

const cartRouter = Router();

cartRouter.route("/add").post(addToCart);
cartRouter.route("/increase").put(authMiddleware, increaseQuantityInCart);
cartRouter.route("/decrease").put(authMiddleware, decreaseQuantityInCart);
cartRouter.route("/preview").get(authMiddleware, getCartItemsPreview);
cartRouter.route("/delete").delete(authMiddleware, deleteCartItem);

export default cartRouter;
