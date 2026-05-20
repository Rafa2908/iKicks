import pool from "../config/database.js";
import { fullNameVerification, phoneVerification } from "../utils/regex.js";

export const placeOrder = async (req, res) => {
  const { userId } = req.user;
  const { addressId, recipientName, phoneNumber } = req.body;
  try {
    //Data validation || Passed ✅
    if (!addressId || !recipientName || !phoneNumber) {
      return res.status(400).json({ message: "No data provided" });
    }

    //Checks if shipping Id is valid || Passed ✅
    if (isNaN(Number(addressId))) {
      return res.status(400).json({ message: "Invalid shipping information" });
    }

    //Recipient name validation || Passed ✅
    if (!fullNameVerification(recipientName)) {
      return res.status(400).json({ message: "Invalid name" });
    }

    //Phone number validation || Passed ✅
    if (!phoneVerification(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    await pool.query("BEGIN");

    const cart = await pool.query(
      `
      SELECT c.id FROM cart c
      JOIN shipping s
      ON c.user_id=s.user_id
      WHERE c.user_id=$1 AND s.id=$2
      `,
      [userId, addressId],
    );

    if (cart.rowCount === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartId = cart.rows[0].id;

    const cartItems = await pool.query(
      `
      SELECT 
        json_agg(
          json_build_object(
            'size_id', size_id,
            'price_at_add', price_at_add,
            'quantity', quantity
          )
        ) AS items,
        SUM(price_at_add * quantity) AS total
      FROM cart_items
      WHERE cart_id=$1;
      `,
      [cartId],
    );

    if (!cartItems.rows[0].items) {
      await pool.query("ROLLBACK");
      return res.status(404).json({ message: "Cart is empty" });
    }

    const total = cartItems.rows[0].total;

    const newOrder = await pool.query(
      `
      INSERT INTO orders(user_id, address_id, recipient_name, phone_number, total_at_purchase)
      VALUES($1, $2, $3, $4, $5) RETURNING id
      `,
      [userId, addressId, recipientName, phoneNumber, total],
    );

    const orderId = newOrder.rows[0].id;

    for (const item of cartItems.rows[0].items) {
      await pool.query(
        `
        INSERT INTO order_items(order_id, size_id, quantity, price_at_purchase)
        VALUES($1, $2, $3, $4)
        `,
        [orderId, item.size_id, item.quantity, item.price_at_add],
      );

      const update = await pool.query(
        `
      UPDATE product_size
      SET quantity = quantity - $1
      WHERE id=$2 AND quantity >= $1
      RETURNING id
      `,
        [item.quantity, item.size_id],
      );

      if (update.rowCount === 0) {
        await pool.query("ROLLBACK");
        return res.status(400).json({ message: "Error submitting order" });
      }
    }

    await pool.query(
      `
      DELETE FROM cart_items
      WHERE cart_id=$1
      `,
      [cartId],
    );

    await pool.query("COMMIT");

    return res.status(201).json({ message: "Order processed successfully" });
  } catch (error) {
    console.error(error);

    await pool.query("ROLLBACK");

    return res.status(500).json({ message: "Internal server error" });
  }
};
