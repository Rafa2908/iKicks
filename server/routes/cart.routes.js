import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import { addToCart } from "../controllers/cart.controllers.js";

const cartRouter = Router();

cartRouter.route("/add").post(addToCart);

export default cartRouter;
