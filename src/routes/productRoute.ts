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

productRouter.post(
  "/updateProduct/:productId",
  authMiddlewware,
  configUploadProductImages,
  updateProduct
);

productRouter.get("/detailProduct/:productId", authMiddlewware, detailProduct);
productRouter.post("/getAllProduct", authMiddlewware, getAllProduct);

productRouter.post(
  "/getAllProductByOutlet",
  authMiddlewware,
  getAllProductByOutlet
);

productRouter.post(
  "/getAllProductByCategory",
  authMiddlewware,
  getAllProductByCategory
);

productRouter.post(
  "/getAllProductByOutletCategory",
  authMiddlewware,
  getAllProductByOutletCategory
);

productRouter.delete(
  "/deleteProduct/:productId",
  authMiddlewware,
  deleteProduct
);

export default productRouter;
