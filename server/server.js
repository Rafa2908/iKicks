import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import "./config/database.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import "./emails/email.js";
import cartRouter from "./routes/cart.routes.js";
import shippingRouter from "./routes/shipping.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import invoiceRouter from "./routes/invoice.routes.js";
import { stripeWebhook } from "./controllers/payment.controller.js";
import "./utils/ImageUrlGenerator.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRouter from "./routes/auth.routes.js";

dotenv.config();

const required = [
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "STRIPE_SECRET_KEY",
  "RESEND_KEY",
  "DBURL",
  "CLOUDINARY_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required env variable: ${key}`);
    process.exit(1);
  }
});

const app = express();

app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(helmet());
app.use(
  express.json({ limit: "2mb" }),
  express.urlencoded({ extended: true, limit: "2mb" }),
);
app.use(cookieParser());
app.use(
  cors({
    // process.env.FRONTEND_URL ||
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.set("trust proxy", 1);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/shipping", shippingRouter);
app.use("/api/order", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/wishlist", wishlistRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
