import pool from "../config/database";

//Shipping
export const addShippingAddress = async (req, res) => {
  const { userId } = req.user;
  const { recipient, address_1, address_2, city, state, zipcode } = req.body;

  try {
    if (isNaN(Number(userId))) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    if (!recipient || !address_1 || !city || !state || !zipcode) {
      return res
        .status(400)
        .json({ message: "No Shipping information provided" });
    }

    if (!addressVerification(address_1)) {
      return res
        .status(400)
        .json({ message: "Please provide a valid street address" });
    }

    if (isNaN(Number(zipcode))) {
      return res.status(400).json({ message: "Invalid zipcode" });
    }

    const address2 = address_2 ? address_2 : null;

    const addressExist = await pool.query(
      `
        SELECT id FROM shipping
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
        INSERT INTO shipping(user_id, address_1, address_2, city, state, zipcode)
        VALUES($1, $2, $3, $4, $5, $6) RETURNING id
        `,
      [userId, address_1, address2, city, state, zipcode],
    );

    return res.status(201).json({
      shippingId: newShippingAddress.rows[0].id,
      recipientName: recipient,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
