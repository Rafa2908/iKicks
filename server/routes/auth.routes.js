import { Router } from "express";
import { tokenRefresh } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.js";

const authRouter = Router();

authRouter.route("refresh").get(tokenRefresh);

export default authRouter;
