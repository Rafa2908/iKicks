import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import { registerUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
// userRouter.route("/login").post(loginUSer);
// userRouter.route("/profile").get(authMiddleware, getUserById);

export default userRouter;
