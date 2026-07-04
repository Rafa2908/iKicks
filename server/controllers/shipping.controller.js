import pool from "../config/database.js";
import { addHours } from "../utils/dateFormat.js";
import { addressVerification } from "../utils/regex.js";

//Shipping
export const addShippingAddress = async (req, res, next) => {
  const { userId } = req.user;
  const { address_1, address_2, city, state, zipcode } = req.body;

  try {
    //Field input validation || Passed ✅
    if (!address_1 || !city || !state || !zipcode) {
      return res
        .status(400)
        .json({ message: "No Shipping information provided" });
    }

    //Address validation || Passed ✅
    if (!addressVerification(address_1)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid street address" });
    }

    //Zipcode validation || Passed ✅
    if (isNaN(Number(zipcode))) {
      return res.status(400).json({ message: "Invalid zipcode" });
    }

    const address2 = address_2.length > 0 ? address_2 : null;

    const addressExist = await pool.query(
      `
        SELECT id FROM shipping_addresses
        WHERE user_id=$1 AND address_1=$2 AND city=$3 AND zipcode=$4
        `,
      [userId, address_1, city, zipcode],
    );

    //If exist, data won't be saved but user can move forward with order.
    if (addressExist.rowCount > 0) {
      return res.status(200).json({
        message: "Address exist",
        shippingId: addressExist.rows[0].id,
      });
    }

    const newShippingAddress = await pool.query(
      `
        INSERT INTO shipping_addresses(user_id, address_1, address_2, city, state, zipcode)
        VALUES($1, $2, $3, $4, $5, $6) RETURNING id
        `,
      [userId, address_1, address2, city, state, zipcode],
    );

    return res.status(201).json({
      shippingId: newShippingAddress.rows[0].id,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateShippingAddress = async (req, res, next) => {
  const { userId } = req.user;
  const { shippingId, address_1, address_2, city, state, zipcode } = req.body;

  try {
    //Field input validation || Passed ✅
    if (!shippingId || !address_1 || !city || !state || !zipcode) {
      return res.status(400).json({ message: "No shipping data provided" });
    }

    //Address validation || Passed ✅
    if (!addressVerification(address_1)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid address" });
    }

    //Zipcode validation || Passed ✅
    if (isNaN(Number(zipcode))) {
      return res.status(400).json({ message: "Invalid zipcode" });
    }

    const address2 = address_2.length > 0 ? address_2 : null;

    const update = await pool.query(
      `
        UPDATE shipping_addresses
        SET address_1=$1, address_2=$2, city=$3, state=$4, zipcode=$5 
        WHERE id=$6
        RETURNING id
      `,
      [address_1, address2, city, state, zipcode, shippingId],
    );

    if (update.rowCount === 0) {
      return res
        .status(400)
        .json({ message: "Error updating shipping address" });
    }

    return res.status(200).json({ message: "Shipping address updated" });
  } catch (error) {
    return next(error);
  }
};

export const deleteShippingAddress = async (req, res, next) => {
  const { userId } = req.user;
  const { shippingId } = req.body;
  try {
    if (!shippingId) {
      return res.status(400).json({ message: "No shipping data provided" });
    }

    if (isNaN(Number(shippingId))) {
      return res.status(400).json({ message: "Invalid shipping data" });
    }

    const deleteAddress = await pool.query(
      `
            DELETE FROM shipping_addresses
            WHERE id=$1 AND user_id=$2
            RETURNING id
            `,
      [shippingId, userId],
    );

    if (deleteAddress.rowCount === 0) {
      return res
        .status(400)
        .json({ message: "Error deleting shipping address" });
    }

    return res.status(200).json({ message: "Shipping address deleted" });
  } catch (error) {
    return next(error);
  }
};

export const userShippingAddresses = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const addresses = await pool.query(
      `
            SELECT id, address_1, address_2, city, state, zipcode
            FROM shipping_addresses
            WHERE user_id=$1
            `,
      [userId],
    );

    if (addresses.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No shipping addresses available" });
    }

    return res.status(200).json(addresses.rows);
  } catch (error) {
    return next(error);
  }
};

export const createShippingOrder = async (req, res, next) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: "No order data provided" });
  }

  const orderPlacedDate = new Date();
  const tentativeShipDate = addHours(orderPlacedDate, 120); // 5 days
  const tentativeDeliveryDate = addHours(tentativeShipDate, 72); // 3 days

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderInfo = await client.query(
      `SELECT shipping_address_id FROM orders WHERE id = $1`,
      [orderId],
    );

    if (orderInfo.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Order not found" });
    }

    const shippingId = orderInfo.rows[0].shipping_address_id;

    const shippingOrder = await client.query(
      `INSERT INTO shipping_orders(order_id, shipping_address_id, ship_date, delivery_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [orderId, shippingId, tentativeShipDate, tentativeDeliveryDate],
    );

    await client.query("COMMIT");

    return res.status(201).json({
      message: "Shipping order created successfully",
      shippingOrder: shippingOrder.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    return next(error);
  } finally {
    client.release();
  }
};
