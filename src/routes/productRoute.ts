import express from "express";
import {
  createProduct,
  deleteProduct,
  detailProduct,
  getAllProduct,
  updateProduct,
  getAllProductByCategory,
  getAllProductByOutlet,
  getAllProductByOutletCategory,
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
  "/getAllProductByCategory/:ownerId/:categoryIds",
  authMiddlewware,
  getAllProductByCategory
);

productRouter.get(
  "/getAllProductByOutletCategory/:ownerId/:outletIds/:categoryIds?",
  authMiddlewware,
  getAllProductByOutletCategory
);

productRouter.delete(
  "/deleteProduct/:productId",
  authMiddlewware,
  deleteProduct
);

export default productRouter;
