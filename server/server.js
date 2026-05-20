import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./config/database.js";
// import { dbConnect } from "./config/config.mongoose.js";

import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import { sendEmail } from "./emails/email.js";
import cartRouter from "./routes/cart.routes.js";
import shippingRouter from "./routes/shipping.routes.js";
import orderRouter from "./routes/order.routes.js";
// import wishlistRouter from "./routes/wishlist.route.js";

dotenv.config();

const app = express();

app.use(express.json(), express.urlencoded({ extended: true }));
app.use(cors());
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/shipping", shippingRouter);
app.use("/order", orderRouter);
// app.use("/wishlist", wishlistRouter);

const PORT = process.env.PORT;

// dbConnect();

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
