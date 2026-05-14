import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  generateCode,
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
  resetPassword,
  updateUserInfo,
  verifyCode,
} from "../controllers/user.controller.js";
import { authManager } from "../middleware/admin.js";

const userRouter = Router();

userRouter.route("").get(authMiddleware, authManager, getAllUsers);
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter
  .route("/:userId")
  .get(authMiddleware, getUserById)
  .put(authMiddleware, updateUserInfo);

//Password Reset
userRouter.route("/auth/get-code").get(generateCode);
userRouter.route("/auth/verify-code").post(verifyCode);
userRouter.route("/auth/reset").post(resetPassword);
export default userRouter;
