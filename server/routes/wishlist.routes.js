import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addToWishlist,
  wishlistPreview,
} from "../controllers/wishlist.controller.js";
import { getDataLimiter, updateDataLimiter } from "../utils/rateLimiter.js";

const wishlistRouter = Router();

wishlistRouter.route("/add").post(authMiddleware, updateDataLimiter, addToWishlist);
wishlistRouter.route("/preview").get(authMiddleware, getDataLimiter, wishlistPreview);

export default wishlistRouter;
