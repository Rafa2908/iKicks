import { Router } from "express";
import {
  registerUser,
  loginUSer,
  getUserById,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUSer);
userRouter.route("/profile").get(authMiddleware, getUserById);

export default userRouter;
