import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import { makePayment } from "../controllers/payment.controller.js";
import { paymentLimiter } from "../utils/rateLimiter.js";

const paymentRouter = Router();

paymentRouter.route("/process").post(authMiddleware, paymentLimiter, makePayment);

export default paymentRouter;
