import pool from "../config/database.js";
import Stripe from "stripe";
import "dotenv/config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const makePayment = async (req, res) => {
  const { userId } = req.user;
  const { orderId } = req.body;

  try {
    if (!orderId) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const order = await pool.query(
      `
        SELECT total_at_purchase FROM orders
        WHERE id=$1 AND user_id=$2
        `,
      [orderId, userId],
    );

    if (order.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const paymentAmount = Math.round(order.rows[0].total_at_purchase * 100);

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: paymentAmount,
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
        metadata: {
          order_id: String(orderId),
          user_id: String(userId),
        },
      },
      {
        idempotencyKey: `order_${orderId}_${userId}`,
      },
    );

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: "Webhook signature verification failed" });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentSuccess = event.data.object;
      const paymentId = paymentSuccess.id;
      const orderId = paymentSuccess.metadata.order_id;
      const total = paymentSuccess.amount_received / 100;

      await pool.query(
        `
        INSERT INTO transactions(order_id, payment_id, total_paid, status)
        VALUES($1, $2, $3, 'completed')
        `,
        [orderId, paymentId, total],
      );

      await pool.query(
        `
        UPDATE orders
        SET status='completed' 
        WHERE id=$1
        `,
        [orderId],
      );

      break;
    }
    case "payment_intent.payment_failed": {
      const paymentFail = event.data.object;
      console.log(paymentFail);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
};
