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

export const increaseQuantityInCart = async (req, res) => {
  const { cartId, sizeId } = req.body;
  const { userId, email } = req.user;

  try {
    if (!cartId || !sizeId) {
      return res.status(400).json({ message: "No data provided" });
    }

    if (isNaN(Number(cartId)) || isNaN(Number(sizeId))) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    const product = await pool.query(
      `
            SELECT quantity FROM product_size
            WHERE id=$1
            `,
      [sizeId],
    );

    if (product.rowCount === 0) {
      return res.status(404).json({ message: "Product size not found" });
    }

    const productQuantity = product.rows[0].quantity;

    if (productQuantity === 0) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    const cartItem = await pool.query(
      `
            SELECT quantity FROM cart_items
            WHERE cart_id=$1 AND size_id=$2
            AND cart_id IN (SELECT id FROM cart WHERE user_id=$3)
            `,
      [cartId, sizeId, userId],
    );

    if (cartItem.rowCount === 0) {
      return res.status(404).json({ message: "Product is not in cart" });
    }

    const cartQuantity = cartItem.rows[0].quantity;

    if (cartQuantity + 1 > productQuantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    await pool.query(
      `
            UPDATE cart_items
            SET quantity=quantity+1
            WHERE cart_id=$1 AND size_id=$2
            `,
      [cartId, sizeId],
    );

    return res.status(200).json({ message: "Cart updated" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const decreaseQuantityInCart = async (req, res) => {
  const { cartId, sizeId } = req.body;
  const { userId } = req.user;

  try {
    if (!cartId || !sizeId) {
      return res.status(400).json({ message: "No data provided" });
    }

    if (isNaN(Number(cartId)) || isNaN(Number(sizeId))) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    const product = await pool.query(
      `
            SELECT quantity FROM product_size
            WHERE id=$1
            `,
      [sizeId],
    );

    if (product.rowCount === 0) {
      return res.status(404).json({ message: "Product size not found" });
    }

    const productQuantity = product.rows[0].quantity;

    const cartItem = await pool.query(
      `
            SELECT quantity FROM cart_items
            WHERE cart_id=$1 AND size_id=$2
            AND cart_id IN (SELECT id FROM cart WHERE user_id=$3)
            `,
      [cartId, sizeId, userId],
    );

    if (cartItem.rowCount === 0) {
      return res.status(404).json({ message: "Product is not in cart" });
    }

    const cartQuantity = cartItem.rows[0].quantity;

    if (cartQuantity === 1) {
      await pool.query(
        `
                DELETE FROM cart_items
                WHERE cart_id=$1 AND size_id=$2
                `,
        [cartId, sizeId],
      );

      return res.status(200).json({ message: "Product removed from cart" });
    }

    await pool.query(
      `
            UPDATE cart_items
            SET quantity=quantity-1
            WHERE cart_id=$1 AND size_id=$2
            `,
      [cartId, sizeId],
    );

    return res.status(200).json({ message: "Cart updated" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCartItemsPreview = async (req, res) => {
  const { userId } = req.user;

  try {
    const cart = await pool.query(
      `
            SELECT id FROM cart WHERE user_id=$1
            `,
      [userId],
    );

    if (cart.rowCount === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartId = cart.rows[0].id;

    const cartDetails = await pool.query(
      `
            SELECT 
                json_agg(
                    json_build_object(
                        'name', p.name,
                        'brand', p.brand,
                        'quantity', ci.quantity,
                        'size', ps.size,
                        'image', pi.url,
                        'total', (ci.quantity * ci.price_at_add)
                )
                ) AS products,
                SUM(ci.quantity * ci.price_at_add) AS subtotal
            FROM products p
            JOIN product_image pi
                ON p.id = pi.product_id
            JOIN product_size ps
                ON p.id = ps.product_id
            JOIN cart_items ci
                ON ps.id = ci.size_id
            WHERE ci.cart_id = $1
                AND ci.cart_id IN (
                    SELECT id
                    FROM cart
                    WHERE user_id = $2
                )
                AND pi.is_primary = true;
            `,
      [cartId, userId],
    );

    if (!cartDetails.rows[0].products) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    return res.status(200).json(cartDetails.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCartItem = async (req, res) => {
  const { userId } = req.user;
  const { sizeId } = req.body;
  try {
    if (!sizeId || isNaN(Number(sizeId))) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    const deletedItem = await pool.query(
      `
            DELETE FROM cart_items
            WHERE cart_id=(SELECT id FROM cart WHERE user_id=$1) 
            AND size_id=$2
            RETURNING id
            `,
      [userId, sizeId],
    );

    if (deletedItem.rowCount === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    return res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
