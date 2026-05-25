import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addToWishlist,
  wishlistPreview,
} from "../controllers/wishlist.controller.js";

const wishlistRouter = Router();

wishlistRouter.route("/add").post(authMiddleware, addToWishlist);
wishlistRouter.route("/preview").get(authMiddleware, wishlistPreview);

export default wishlistRouter;
