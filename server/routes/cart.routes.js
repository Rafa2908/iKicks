import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  addToCart,
  cartTotal,
  clearCart,
  decreaseQuantityInCart,
  deleteCartItem,
  getCartItemsPreview,
  increaseQuantityInCart,
} from "../controllers/cart.controllers.js";
import { getDataLimiter, updateDataLimiter } from "../utils/rateLimiter.js";
import {
  positiveInt,
  positiveNumber,
  required,
  validate,
} from "../utils/validator.js";

const addToCartRules = {
  productId: [required, positiveInt],
  size: [required, positiveNumber],
};

const cartRouter = Router();

cartRouter
  .route("/add")
  .post(
    authMiddleware,
    updateDataLimiter,
    validate(addToCartRules),
    asyncHandler(addToCart),
  );
cartRouter.route("/count").get(authMiddleware, getDataLimiter, cartTotal);
cartRouter
  .route("/increase")
  .put(authMiddleware, updateDataLimiter, increaseQuantityInCart);
cartRouter
  .route("/decrease")
  .put(authMiddleware, updateDataLimiter, decreaseQuantityInCart);
cartRouter
  .route("/preview")
  .get(authMiddleware, getDataLimiter, getCartItemsPreview);
cartRouter
  .route("/delete")
  .delete(authMiddleware, updateDataLimiter, deleteCartItem);

cartRouter.route("/clear").delete(authMiddleware, updateDataLimiter, clearCart);

export default cartRouter;
