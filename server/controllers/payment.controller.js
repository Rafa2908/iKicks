import pool from "../config/database.js";
import Stripe from "stripe";
import "dotenv/config";
import { generateInvoice } from "./invoice.controller.js";
import { sendOrderConfirmation } from "../emails/email.js";

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
      const userId = paymentSuccess.metadata.user_id;
      const total = paymentSuccess.amount_received / 100;

      const paymentExist = await pool.query(
        `
        SELECT id, status FROM transactions WHERE order_id=$1
        `,
        [orderId],
      );

      if (paymentExist.rowCount > 0) {
        if (paymentExist.rows[0].status === "completed") {
          return res.status(200).json({ message: "Payment exist" });
        }

        if (paymentExist.rows[0].status === "failed") {
          await pool.query(
            `
            UPDATE transactions
            SET payment_id=$1, status='completed'
            WHERE order_id=$2
            `,
            [paymentId, orderId],
          );

          await pool.query(
            `
            UPDATE orders
            SET status='completed'
            WHERE id=$1
            `,
            [orderId],
          );

          return res.status(200).json({ received: true });
        }
      } else {
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

        const userResult = await pool.query(
          `SELECT email FROM users WHERE id=$1`,
          [userId],
        );

        const order = await pool.query(
          `
          SELECT
            o.id,
            o.recipient_name,
            o.phone_number,
            o.total_at_purchase,
            o.status,
            o.created_at,
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'name', p.name,
                'brand', p.brand,
                'colorway', p.colorway,
                'price', oi.price_at_purchase,
                'size', ps.size,
                'quantity', oi.quantity,
                'image', pi.url
              )
            ) AS items,
            JSON_BUILD_OBJECT(
              'address_1', sa.address_1,
              'address_2', sa.address_2,
              'city', sa.city,
              'state', sa.state,
              'zipcode', sa.zipcode
            ) AS ship_to
          FROM orders o
          JOIN order_items oi ON o.id = oi.order_id
          JOIN product_size ps ON oi.size_id = ps.id
          JOIN products p ON ps.product_id = p.id
          JOIN LATERAL (
            SELECT url FROM product_image
            WHERE product_id = p.id AND is_primary = true
            LIMIT 1
          ) pi ON true
          JOIN shipping_addresses sa ON o.shipping_address_id = sa.id
          WHERE o.id=$1 AND sa.user_id=$2
          GROUP BY o.id, sa.address_1, sa.address_2, sa.city, sa.state, sa.zipcode
          `,
          [orderId, userId],
        );

        if (order.rowCount > 0 && userResult.rowCount > 0) {
          await sendOrderConfirmation(order.rows[0], userResult.rows[0].email);
        }
      }

      break;
    }
    case "payment_intent.payment_failed": {
      const paymentFail = event.data.object;
      const paymentId = paymentFail.id;
      const orderId = paymentFail.metadata.order_id;
      const total = paymentFail.amount_received / 100;

      await pool.query(
        `
        INSERT INTO transactions(order_id, payment_id, total_paid, status)
        VALUES($1, $2, $3, 'failed')
        `,
        [orderId, paymentId, total],
      );

      await pool.query(
        `
        UPDATE orders
        SET status='failed' 
        WHERE id=$1
        `,
        [orderId],
      );
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return res.status(200).json({ received: true });
};
