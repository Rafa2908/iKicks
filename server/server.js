import express from "express";
import dotenv from "dotenv";
import cors from "cors";
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
import { stripeWebhook } from "./controllers/payment.controller.js";

dotenv.config();

const app = express();

app.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

app.use(express.json(), express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/shipping", shippingRouter);
app.use("/order", orderRouter);
app.use("/payment", paymentRouter);
app.use("/wishlist", wishlistRouter);

const PORT = process.env.PORT;

// dbConnect();

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
