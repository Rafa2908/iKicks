import pool from "../config/database.js";
import { generateUrl } from "../utils/ImageUrlGenerator.js";
import {
  nameVerification,
  productNameVerification,
  urlValidation,
} from "../utils/regex.js";

export const addNewProduct = async (req, res) => {
  const { name, brand, category, description, price, colorway, images, sizes } =
    req.body;

  try {
    //Upload images to Cloudinary
    const imageUrls = await generateUrl(images);

    //Database transaction begins
    await pool.query("BEGIN");

    //Data entry validation ||
    if (
      !name ||
      !brand ||
      !category ||
      !description ||
      !price ||
      !colorway ||
      !images ||
      !sizes
    ) {
      return res.status(400).json({ message: "No data provided" });
    }

    //Name regex validation || Passed ✅
    if (!productNameVerification(name) || !nameVerification(category)) {
      return res.status(400).json({ message: "Invalid data" });
    }

    //Price number format validation || Passed ✅
    if (!Number.isFinite(price)) {
      return res.status(400).json({ message: "Enter a numerical value" });
    }

    //Check if images is an array || Passed ✅
    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "No image data provided" });
    }

    //Check if array is greater than 4 || Passed ✅
    if (images.length > 4) {
      return res
        .status(400)
        .json({ message: "Only 4 pictures allowed per product" });
    }

    //Image URL validation || Passed ✅
    for (const image of images) {
      if (!urlValidation(image)) {
        return res.status(400).json({ message: `${image} is not valid` });
      }
    }

    //Check if sizes is an array || Passed ✅
    if (!Array.isArray(sizes) || sizes.length === 0) {
      return res.status(400).json({ message: "No size data provided" });
    }

    for (const { size, quantity } of sizes) {
      //Size & Quantity number format validation || Passed ✅
      if (!Number.isFinite(size) || !Number.isFinite(quantity)) {
        return res
          .status(400)
          .json({ message: "Enter a numerical value for size/quantity" });
      }

      //Check if quantity is negative || Passed ✅
      if (quantity < 0) {
        return res.status(400).json({ message: "Quantity cannot be negative" });
      }

      //Check if size is negative or zero || Passed ✅
      if (size < 0 || size === 0) {
        return res
          .status(400)
          .json({ message: "Size cannot be negative nor zero" });
      }
    }

    const productExist = await pool.query(
      `
      SELECT id FROM products
      WHERE name=$1 AND colorway=$2
      `,
      [name, colorway],
    );

    //Checks if product exist before insertion || Passed ✅
    if (productExist.rowCount > 0) {
      return res.status(409).json({ message: "Product already exist" });
    }
    //Insert new product to Products' table
    const newProduct = await pool.query(
      `
            INSERT INTO products(name, brand, category, description, price, colorway)
            VALUES($1, $2, $3, $4, $5, $6) RETURNING id
            `,
      [name, brand, category, description, price, colorway],
    );

    //Save product id for image, size and quantity insertion
    const productId = newProduct.rows[0].id;

    //For loop to insert images into database
    for (let i = 0; i < imageUrls.length; i++) {
      await pool.query(
        `
          INSERT INTO product_image(product_id, url, is_primary)
          VALUES($1, $2, $3)
        `,
        [productId, imageUrls[i], i === 0],
      );
    }

    //Insert product size and their quantities in the database
    for (const { size, quantity } of sizes) {
      await pool.query(
        `
                INSERT INTO product_size(product_id, size, quantity)
                VALUES($1, $2, $3)
                `,
        [productId, size, quantity],
      );
    }

    //Data is committed to database after successfull insertion
    await pool.query("COMMIT");

    return res.status(201).json({ message: "New product added" });
  } catch (error) {
    console.error(error);

    //If any of the queries fall, the database will
    //rollback to its original state before insertion
    await pool.query("ROLLBACK");

    return res.status(500).json({ message: "Internal server error" });
  }
};

//Displays products on landing page
export const getProductsPreview = async (req, res) => {
  try {
    const products = await pool.query(`
            SELECT p.id, p.name, p.price, pi.url
            FROM products p 
            JOIN product_image pi
            ON p.id=pi.product_id
            WHERE pi.is_primary=true 
            `);

    if (products.rowCount === 0) {
      return res.status(404).json({ message: "No products available" });
    }

    return res.status(200).json(products.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProductDetails = async (req, res) => {
  const { productId } = req.params;
  try {
    if (!productId || isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product" });
    }

    const product = await pool.query(
      `   SELECT 
          p.id,
          p.name,
          p.brand,
          p.colorway,
          p.category,
          p.description,
          p.price,
          i.images,
          s.sizes
      FROM products p
      LEFT JOIN(
        SELECT product_id,
        ARRAY_AGG(url) as images
        FROM product_image
        GROUP BY product_id
      ) i ON p.id=i.product_id
      LEFT JOIN(
        SELECT product_id,
        JSON_OBJECT_AGG(size, JSON_BUILD_OBJECT('quantity', quantity)) as sizes
        FROM product_size
        GROUP BY product_id
      ) s ON p.id=s.product_id
      WHERE p.id=$1
        `,
      [productId],
    );

    if (product.rowCount === 0) {
      return res.status(404).json({ message: "No product data available" });
    }

    return res.status(200).json(product.rows[0]);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateQuantityBySize = async (req, res) => {
  const { productId, size, quantity } = req.body;

  try {
    //No data provided validation || Passed ✅
    if (!productId || !size || !quantity) {
      return res.status(400).json({ message: "No data provided" });
    }

    //Checks if data provided is a number || Passed ✅
    if (isNaN(Number(size)) || isNaN(productId) || isNaN(quantity)) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    //Checks if quantity is nonnegative || Passed ✅
    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const update = await pool.query(
      `
      UPDATE product_size
      SET quantity=$1
      WHERE product_id=$2 AND size=$3
      RETURNING id
    `,
      [quantity, productId, size],
    );

    //Checks if product and size exist || Passed ✅
    if (update.rowCount === 0) {
      return res.status(400).json({ message: "Error updating product" });
    }

    return res.status(200).json({ message: "Product updated" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePriceById = async (req, res) => {
  const { productId } = req.params;
  const { price } = req.body;

  try {
    //Checks if price data is provided || Passed ✅
    if (!price) {
      return res.status(400).json({ message: "No price data provided" });
    }

    //Checks if price is a number || Passed ✅
    if (isNaN(price)) {
      return res
        .status(400)
        .json({ message: "Price must be a numerical value" });
    }

    //Checks if price is negative || Passed ✅
    if (price < 0) {
      return res.status(400).json({ message: "Price cannot be negative" });
    }

    const update = await pool.query(
      `
      UPDATE products
      SET price=$1
      WHERE id=$2
      RETURNING id
      `,
      [price, productId],
    );

    //Checks if update was successful || Passed ✅
    if (update.rowCount === 0) {
      return res.status(400).json({ message: "Error updating price" });
    }

    return res.status(200).json({ message: "Price updated" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const filterProducts = async (req, res) => {
  const { input } = req.body;

  try {
    if (!input) {
      return res.status(400).json({ message: "Data not provided" });
    }

    const brands = await pool.query(
      `
      SELECT p.id, p.name, p.price, pi.url
      FROM products p
      JOIN product_image pi
      ON p.id=pi.product_id
      WHERE pi.is_primary=true
      AND (brand ILIKE $1 OR name ILIKE $1)
      `,
      [`%${input}%`],
    );

    //Checks if brand exists || Passed ✅
    if (brands.rowCount === 0) {
      return res.status(400).json({ message: "No product available" });
    }

    return res.status(200).json(brands.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const filterByPrice = async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  try {
    if (!minPrice || !maxPrice) {
      return res.status(400).json({ message: "Price range not provided" });
    }

    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return res.status(400).json({ message: "Enter a numerical value" });
    }
    const product = await pool.query(
      `
      SELECT p.id, p.name, p.price, pi.url
      FROM products p
      JOIN product_image pi
      ON p.id=pi.product_id
      WHERE pi.is_primary=true
      AND price BETWEEN $1 AND $2
      `,
      [minPrice, maxPrice],
    );

    if (product.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "No product available within this range" });
    }

    return res.status(200).json(product.rows);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};
