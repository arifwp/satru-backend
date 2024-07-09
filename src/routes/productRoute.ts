import express from "express";
import {
  createBrand,
  createCategory,
  createProduct,
  updateProduct,
} from "../controllers/productController";
import { authMiddlewware } from "../middlewares/authMiddleware";
import { configUploadProductImages } from "../middlewares/uploadMiddleware";

const productRouter = express.Router();

// PRODUCT
productRouter.post(
  "/createProduct",
  authMiddlewware,
  configUploadProductImages,
  createProduct
);
productRouter.put(
  "/updateProduct/:productId",
  authMiddlewware,
  configUploadProductImages,
  updateProduct
);

// CATEGORY
productRouter.post("/createCategory", authMiddlewware, createCategory);

// BRAND
productRouter.post("/createBrand", authMiddlewware, createBrand);

export default productRouter;
