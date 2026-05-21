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
      INSERT INTO orders(user_id, shipping_address_id, recipient_name, phone_number, total_at_purchase)
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
      INSERT INTO shipping_orders(order_id, shipping_address_id)
      VALUES($1, $2)
      `,
      [orderId, newOrder.rows[0].shipping_address_id],
    );

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

export const getOrderPreview = async (req, res) => {
  const { userId } = req.user;

  try {
    const orders = await pool.query(
      `
      SELECT o.id, o.recipient_name, o.total_at_purchase,
      json_agg(
        json_build_object
        (
          'image', pi.url, 
          'name', p.name, 
          'brand', p.brand
        )) as items
      FROM orders o 
        JOIN order_items oi
      ON o.id=oi.order_id
        JOIN product_size ps
      ON oi.size_id=ps.id
        JOIN product_image pi
      ON ps.product_id=pi.product_id
        JOIN products p
      ON pi.product_id=p.id
        WHERE o.user_id=$1 AND pi.is_primary=true
      GROUP BY o.id
      `,
      [userId],
    );

    if (orders.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(orders.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderDetails = async (req, res) => {
  const { userId } = req.user;
  const { shippingId } = req.params;

  try {
    const orders = await pool.query(
      `
        SELECT 
            o.id, 
            o.recipient_name, 
            o.total_at_purchase, 
            o.status,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                'name', p.name,
                'brand', p.brand,
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
            JOIN lateral (
            SELECT url FROM product_image 
            WHERE product_id = p.id AND is_primary = true 
            LIMIT 1
            ) pi ON true
            JOIN shipping_addresses sa ON o.shipping_address_id = sa.id
            WHERE sa.user_id=$1   
            AND sa.id=$2
        GROUP BY o.id, sa.address_1, sa.address_2, sa.city, sa.state, sa.zipcode;

            `,
      [userId, shippingId],
    );

    if (orders.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(orders.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
