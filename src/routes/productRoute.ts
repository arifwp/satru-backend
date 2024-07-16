import express from "express";
import {
  createBrand,
  createCategory,
  createProduct,
  deleteProduct,
  detailProduct,
  getAllBrand,
  getAllCategory,
  getAllProduct,
  updateProduct,
  getAllProductByCategory,
  getAllProductByOutlet,
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
productRouter.get("/getAllProduct/:ownerId", authMiddlewware, getAllProduct);

productRouter.get(
  "/getAllProductByOutlet/:ownerId/:outletIds",
  authMiddlewware,
  getAllProductByOutlet
);

productRouter.get(
  "/getAllProductByCategory/:ownerId/:outletIds/:categoryIds?",
  authMiddlewware,
  getAllProductByCategory
);

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
productRouter.get("/getAllBrand/:ownerId", authMiddlewware, getAllBrand);

export default productRouter;
