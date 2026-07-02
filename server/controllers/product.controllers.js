import pool from "../config/database.js";
import { v2 as cloudinary } from "cloudinary";
import { generateUrl } from "../utils/ImageUrlGenerator.js";
import {
  nameVerification,
  productNameVerification,
  urlValidation,
} from "../utils/regex.js";

export const addNewProduct = async (req, res, next) => {
  const { name, brand, category, description, price, colorway, images, sizes } =
    req.body;

  try {
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

    if (price <= 0) {
      return res.status(400).json({ message: "Enter a price greater than 0" });
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

    const imageUrls = await generateUrl(images);

    //Validate Cloudinary URLs returned from upload || Passed ✅
    for (const imageUrl of imageUrls) {
      if (!urlValidation(imageUrl)) {
        return res
          .status(400)
          .json({ message: "Image upload returned invalid URL" });
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
      if (size <= 0 || size >= 19) {
        return res.status(400).json({ message: "Invalid shoe size" });
      }
    }

    await pool.query("BEGIN");

    const productExist = await pool.query(
      `
      SELECT id FROM products
      WHERE name=$1 AND colorway=$2
      `,
      [name, colorway],
    );

    //Checks if product exist before insertion || Passed ✅
    if (productExist.rowCount > 0) {
      await pool.query("ROLLBACK");
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

    await client.del("products:ikicks");

    return res.status(201).json({ message: "New product added" });
  } catch (error) {
    //If any of the queries fall, the database will
    //rollback to its original state before insertion
    await pool.query("ROLLBACK");

    return next(error);
  }
};

//Displays products on landing page
export const getProductsPreview = async (req, res, next) => {
  try {
    const key = "products:ikicks";

    const cache = await client.get(key);

    if (cache) {
      return res.status(200).json(JSON.parse(cache));
    }

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

    await client.set(key, JSON.stringify(products.rows), { EX: 600 });

    return res.status(200).json(products.rows);
  } catch (error) {
    return next(error);
  }
};

export const getProductInfo = async (req, res, next) => {
  try {
    const products = await pool.query(`
            SELECT p.id, p.name, p.price, p.brand, p.category, pi.url,
            ARRAY_AGG(JSON_BUILD_OBJECT('size', size, 'quantity', quantity)) as sizes
            FROM products p 
            JOIN product_image pi
            ON p.id=pi.product_id
            JOIN product_size ps
            ON pi.product_id=ps.product_id
            WHERE pi.is_primary=true
            GROUP BY p.id, p.name, p.price, p.brand, p.category, pi.url
            `);

    if (products.rowCount === 0) {
      return res.status(404).json({ message: "No products available" });
    }

    return res.status(200).json(products.rows);
  } catch (error) {
    return next(error);
  }
};

export const getProductDetails = async (req, res, next) => {
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
        ARRAY_AGG(JSON_BUILD_OBJECT('size', size, 'quantity', quantity)) as sizes
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
    return next(error);
  }
};

export const updateProductById = async (req, res, next) => {
  const {
    id,
    name,
    brand,
    colorway,
    category,
    description,
    price,
    images,
    sizes,
  } = req.body;

  try {
    const imageUrls = await generateUrl(images);
    if (
      !id ||
      !name ||
      !brand ||
      !colorway ||
      !category ||
      !description ||
      !price ||
      !images ||
      !sizes
    ) {
      return res.status(400).json({ message: "No data provided" });
    }

    if (!productNameVerification(name)) {
      return res.status(400).json({ message: "Invalid name" });
    }

    if (isNaN(Number(price))) {
      return res.status(400).json({ message: "Price must be a number" });
    }

    if (!Array.isArray(images)) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    if (!Array.isArray(sizes)) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    await pool.query("BEGIN");

    const updateProduct = await pool.query(
      `
      UPDATE products
      SET name=$1, brand=$2, colorway=$3, category=$4, description=$5, price=$6
      WHERE id=$7
      `,
      [name, brand, colorway, category, description, price, id],
    );

    await pool.query(
      `
      DELETE FROM product_image
      WHERE product_id=$1
      `,
      [id],
    );

    for (let i = 0; i < imageUrls.length; i++) {
      await pool.query(
        `
        INSERT INTO product_image(product_id, url, is_primary)
        VALUES($1, $2, $3)
        `,
        [id, imageUrls[i], i === 0],
      );
    }

    for (const item of sizes) {
      const size = await pool.query(
        `
        SELECT id FROM product_size
        WHERE product_id=$1 AND size=$2
        `,
        [id, item.size],
      );

      if (size.rowCount > 0) {
        await pool.query(
          `
          UPDATE product_size
          SET quantity=$1
          WHERE product_id=$2 AND size=$3
          `,
          [item.quantity, id, item.size],
        );
      } else {
        await pool.query(
          `
          INSERT INTO product_size(product_id, size, quantity)
          VALUES($1, $2, $3)
          `,
          [id, item.size, item.quantity],
        );
      }
    }

    await pool.query("COMMIT");

    return res.status(200).json({ message: "Product updated" });
  } catch (error) {
    await pool.query("ROLLBACK");

    return next(error);
  }
};

export const updateQuantityBySize = async (req, res, next) => {
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
    return next(error);
  }
};

export const updatePriceById = async (req, res, next) => {
  const { productId, price } = req.body;

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
    return next(error);
  }
};

export const filterProducts = async (req, res, next) => {
  const { name, brand, minPrice, maxPrice, search } = req.query;

  try {
    const conditions = ["pi.is_primary=true"];
    const params = [];
    let count = 1;

    if (search) {
      conditions.push(`(p.brand ILIKE $${count} OR p.name ILIKE $${count})`);
      params.push(`%${search}%`);
      count++;
    }

    if (brand) {
      conditions.push(`p.brand ILIKE $${count++}`);
      params.push(`%${brand}%`);
    }

    if (name) {
      conditions.push(`p.name ILIKE $${count++}`);
      params.push(`%${name}%`);
    }

    if (minPrice && maxPrice) {
      conditions.push(`p.price BETWEEN $${count++} AND $${count++}`);
      params.push(Number(minPrice), Number(maxPrice));
    }

    const query = `
      SELECT p.id, p.name, p.brand, p.price, pi.url
        FROM products p
        JOIN product_image pi
        ON p.id=pi.product_id
        WHERE ${conditions.join(" AND ")}
        ORDER BY p.price ASC
    `;

    const products = await pool.query(query, params);

    if (products.rowCount === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json(products.rows);
  } catch (error) {
    return next(error);
  }
};
