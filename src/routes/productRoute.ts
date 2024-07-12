import express from "express";
import {
  createBrand,
  createCategory,
  createProduct,
  deleteProduct,
  detailProduct,
  getAllCategory,
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

productRouter.get("/detailProduct/:productId", authMiddlewware, detailProduct);

productRouter.delete(
  "/deleteProduct/:productId",
  authMiddlewware,
  deleteProduct
);

// CATEGORY
productRouter.post("/createCategory", authMiddlewware, createCategory);
productRouter.get("/getAllCategory/:ownerId", authMiddlewware, getAllCategory);

// BRAND
productRouter.post("/createBrand", authMiddlewware, createBrand);

export default productRouter;
