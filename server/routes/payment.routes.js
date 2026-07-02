import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import {
  bankTransferPayment,
  cashPayment,
  makePayment,
  updatePayment,
} from "../controllers/payment.controller.js";
import { paymentLimiter } from "../utils/rateLimiter.js";

const paymentRouter = Router();

paymentRouter
  .route("/process")
  .post(authMiddleware, paymentLimiter, makePayment);

paymentRouter.route("/cash").post(authMiddleware, paymentLimiter, cashPayment);

paymentRouter
  .route("/bank")
  .post(authMiddleware, paymentLimiter, bankTransferPayment);

paymentRouter
  .route("/method/update")
  .patch(authMiddleware, paymentLimiter, updatePayment);

export default paymentRouter;
