import { Router } from "express";
import {
  addNewProduct,
  filterByPrice,
  filterProducts,
  getProductDetails,
  getProductsPreview,
  updatePriceById,
  updateQuantityBySize,
} from "../controllers/product.controllers.js";
import authMiddleware from "../middleware/auth.js";
import { authManager } from "../middleware/admin.js";

const productRouter = Router();

productRouter.route("/add").post(authMiddleware, authManager, addNewProduct);
productRouter.route("/preview").get(getProductsPreview);
productRouter.route("/details/:productId").get(getProductDetails);
productRouter
  .route("/update/quantity")
  .put(authMiddleware, authManager, updateQuantityBySize);
productRouter.route("/update/:productId").put(updatePriceById);
productRouter.route("/filter").get(filterProducts);
productRouter.route("/filter/price").get(filterByPrice);

export default productRouter;
