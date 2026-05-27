import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import { generateInvoice } from "../controllers/invoice.controller.js";

const invoiceRouter = Router();

invoiceRouter.route("/generate").post(authMiddleware, generateInvoice);

export default invoiceRouter;
