import { Router } from "express";
import {
  addNewProduct,
  filterProducts,
  getProductDetails,
  getProductInfo,
  getProductsPreview,
  updatePriceById,
  updateProductById,
  updateQuantityBySize,
} from "../controllers/product.controllers.js";
import authMiddleware from "../middleware/auth.js";
import { authManager } from "../middleware/admin.js";
import { getDataLimiter, updateDataLimiter } from "../utils/rateLimiter.js";

const productRouter = Router();

productRouter
  .route("/add")
  .post(authMiddleware, authManager, updateDataLimiter, addNewProduct);
productRouter
  .route("/info")
  .get(authMiddleware, authManager, getDataLimiter, getProductInfo);
productRouter.route("/preview").get(getDataLimiter, getProductsPreview);
productRouter
  .route("/details/:productId")
  .get(getDataLimiter, getProductDetails);
productRouter
  .route("/update/quantity")
  .put(authMiddleware, authManager, updateDataLimiter, updateQuantityBySize);
productRouter
  .route("/update/price")
  .put(authMiddleware, authManager, updateDataLimiter, updatePriceById);
productRouter
  .route("/update/item")
  .put(authMiddleware, authManager, updateDataLimiter, updateProductById);
productRouter.route("/filter").get(getDataLimiter, filterProducts);

export default productRouter;
