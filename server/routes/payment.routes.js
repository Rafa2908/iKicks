import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import { makePayment } from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.route("/process").post(authMiddleware, makePayment);

export default paymentRouter;
