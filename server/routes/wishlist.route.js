import { Router } from "express";
import {
  addSneakerToWishlist,
  deleteSneakerFromWishlist,
} from "../controllers/wishlist.controller.js";
import authMiddleware from "../middleware/auth.js";

const wishlistRouter = Router();

wishlistRouter
  .route("/")
  .post(authMiddleware, addSneakerToWishlist)
  .delete(authMiddleware, deleteSneakerFromWishlist);

export default wishlistRouter;
