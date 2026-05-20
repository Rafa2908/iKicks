import pool from "../config/database.js";
import Stripe from "stripe";
import "dotenv/config"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

//Payment

export const makePayment = async (req, res) => {
    const {userId} = req.user,
    const {orderId} = req.body;

    try {
        
        if (!orderId) {
            return res.status(400).json({message: "Invalid order data"})
        }

        const order = await pool.query(`
            SELECT total_purchase FROM orders
            WHERE id=$1 AND user_id=$2
            `, [orderId, userId])

        if (order.rowCount === 0) {
            return res.status(404).json({message: "Order not found"})
        }

        const amount = Math.round(order.rows[0].total_purchase);

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            metadata: {
                order_id: String(orderId),
                user_id: String(userId)
            }
        }, {
            idempotencyKey: `order_${orderId}_${userId}`
        })

        return res.status(200).json({clientSecretKey: paymentIntent.client_secret})

    } catch (error) {
        console.error(error);
        
        return res.status(500).json({message: "Internal server error"})
    }
}