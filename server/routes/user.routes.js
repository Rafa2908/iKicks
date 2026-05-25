import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  activateUserAccount,
  deactivateUserAccount,
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
import {
  accountStatusLimiter,
  adminDataLimiter,
  authLimiter,
  codeVerifyLimiter,
  generateCodeLimiter,
  getDataLimiter,
  resetPasswordLimiter,
  signInLimiter,
  updateDataLimiter,
} from "../utils/rateLimiter.js";

const userRouter = Router();

userRouter
  .route("/admin")
  .get(authMiddleware, adminDataLimiter, authManager, getAllUsers);
userRouter.route("/register").post(authLimiter, registerUser);
userRouter.route("/login").post(signInLimiter, loginUser);
userRouter
  .route("/:userId")
  .get(authMiddleware, getDataLimiter, getUserById)
  .put(authMiddleware, updateDataLimiter, updateUserInfo);
userRouter
  .route("/deactivate/:userId")
  .put(authMiddleware, accountStatusLimiter, deactivateUserAccount);
userRouter
  .route("/activate/:userId")
  .put(authMiddleware, accountStatusLimiter, activateUserAccount);

//Password Reset
userRouter.route("/auth/get-code").post(generateCodeLimiter, generateCode);
userRouter.route("/auth/verify-code").post(codeVerifyLimiter, verifyCode);
userRouter.route("/auth/reset").post(resetPasswordLimiter, resetPassword);

export default userRouter;
