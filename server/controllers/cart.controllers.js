import pool from "../config/database.js";

export const addToCart = async (req, res) => {
  const { userId, productId, size } = req.body;

  try {
    await pool.query("BEGIN");

    //Checks if data is provided || Passed ✅
    if (!userId || !productId || !size) {
      return res.status(400).json({ message: "No data provided" });
    }

    //Checks if data provided is valid || Passed ✅
    if (
      !Number.isFinite(Number(userId)) ||
      !Number.isFinite(productId) ||
      !Number.isFinite(size)
    ) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    //Checks if user cart exist
    const userCart = await pool.query(
      `
      SELECT id FROM cart WHERE user_id=$1
      `,
      [userId],
    );

    //If user cart doesn't exist, error message is displayed
    if (userCart.rowCount === 0) {
      return res.status(400).json({ message: "Cart data not available" });
    }

    const cartId = userCart.rows[0].id;

    //Query products' data
    const product = await pool.query(
      `
      SELECT ps.id as size_id, p.price, ps.quantity
      FROM product_size ps
      JOIN products p
      ON ps.product_id=p.id
      WHERE product_id=$1 AND size=$2
      `,
      [productId, size],
    );

    //Checks if product and size exist
    if (product.rowCount === 0) {
      return res.status(400).json({ message: "Product size not available" });
    }

    //Checks if product's quantity is nonnegative or zero
    if (product.rows[0].quantity <= 0) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    const sizeId = product.rows[0].size_id;

    //Checks if user already added items to the cart
    const cartItems = await pool.query(
      `
      SELECT quantity FROM cart_items
      WHERE cart_id=$1 AND size_id=$2
      `,
      [cartId, sizeId],
    );

    //If items were already added, certain conditions will be checked
    if (cartItems.rowCount > 0) {
      //If quantity in cart + 1 is greater than current stock, error message will display
      if (cartItems.rows[0].quantity + 1 > product.rows[0].quantity) {
        return res.status(400).json({ message: "Cannot add more to the cart" });
      } else {
        //Product quantity will be updated to quantity+1
        await pool.query(
          `
          UPDATE cart_items
          SET quantity=quantity+1
          WHERE cart_id=$1 AND size_id=$2
          `,
          [cartId, sizeId],
        );

        return res.status(200).json({ message: "Cart updated" });
      }
    }

    const cart = await pool.query(
      `
      INSERT INTO cart_items(cart_id, size_id, price_at_add, quantity)
      VALUES($1, $2, $3, 1)
      `,
      [cartId, sizeId, product.rows[0].price],
    );

    await pool.query("COMMIT");

    return res.status(201).json({ message: "Product added to cart" });
  } catch (error) {
    console.error(error);

    await pool.query("ROLLBACK");

    return res.status(500).json({ message: "Internal server error" });
  }
};
