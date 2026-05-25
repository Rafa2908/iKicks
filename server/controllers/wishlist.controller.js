import pool from "../config/database.js";

export const addToWishlist = async (req, res) => {
  const { userId } = req.user;
  const { productId } = req.body;

  try {
    if (!productId || isNaN(Number(productId))) {
      return res.status(400).json({ message: "Invalid product data" });
    }

    const product = await pool.query(`SELECT id FROM products WHERE id=$1`, [
      productId,
    ]);

    if (product.rowCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const wishlist = await pool.query(
      `
            SELECT id FROM wishlist
            where user_id=$1 AND product_id=$2
            `,
      [userId, productId],
    );

    if (wishlist.rowCount > 0) {
      await pool.query(
        `
                DELETE FROM wishlist
                WHERE user_id=$1 AND product_id=$2
                `,
        [userId, productId],
      );

      return res
        .status(200)
        .json({ message: "Product removed from wishlist", wishlisted: false });
    }

    await pool.query(
      `
            INSERT INTO wishlist(user_id, product_id)
            VALUES($1, $2)
            `,
      [userId, productId],
    );

    return res
      .status(201)
      .json({ message: "Product added to wishlist", wishlisted: true });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const wishlistPreview = async (req, res) => {
  const { userId } = req.user;

  try {
    const wishlistItems = await pool.query(
      `
            SELECT p.name, p.brand, pi.url as image
            FROM products p
            JOIN product_image pi
            ON p.id=pi.product_id
            JOIN wishlist w
            ON pi.product_id=w.product_id
            WHERE w.user_id=$1 AND pi.is_primary=true
            `,
      [userId],
    );

    if (wishlistItems.rowCount === 0) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    return res.status(200).json(wishlistItems.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
