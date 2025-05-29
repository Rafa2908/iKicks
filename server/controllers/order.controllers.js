import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/order.models.js";
import User from "../models/user.models.js";
import { orderConfirmationEmail } from "../emails/sendEmail.js";

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const stripePayment = async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
    });
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const newOrder = new Order({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();

    // Calculate the subtotal (sum of all item prices)
    const subtotal = req.body.items.reduce((total, sneaker) => {
      return total + sneaker.price * sneaker.quantity;
    }, 0);

    // Calculate the 10% tax
    const taxRate = 0.1; // 10% tax
    const taxAmount = Math.round(subtotal * taxRate * 100); // Calculate tax and convert to cents

    // Calculate the total amount including tax
    const totalAmount = Math.round(subtotal * 100 + taxAmount);

    const line_items = req.body.items.map((sneaker) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: sneaker.name,
        },
        unit_amount: sneaker.price * 100, // Price in cents
      },
      quantity: sneaker.quantity,
    }));

    // Add tax as a separate line item
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Tax (10%)",
        },
        unit_amount: taxAmount,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
  }
};

export const verifyOrder = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success === "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });

      await User.findByIdAndUpdate(userId, {
        cartData: {},
      });

      const orderConfirmation = await Order.findById(orderId);

      const findUser = await User.findById(orderConfirmation.userId);

      orderConfirmationEmail(findUser, orderConfirmation);

      res.status(200).json({ success: true, message: "Paid" });
    } else {
      await Order.findByIdAndDelete(orderId);

      res.status(200).json({ success: false, message: "Not paid" });
    }
  } catch (error) {
    console.error("Error in verifyOrder:", error);
    res.status(400).json(error);
  }
};

export const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.body.userId });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(400).json(error);
  }
};

export default placeOrder;
