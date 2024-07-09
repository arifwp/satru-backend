import express from "express";
import {
  createBrand,
  createCategory,
  createProduct,
} from "../controllers/productController";
import { authMiddlewware } from "../middlewares/authMiddleware";
import { configUploadProductImages } from "../middlewares/uploadMiddleware";

const productRouter = express.Router();

productRouter.post(
  "/createProduct",
  authMiddlewware,
  configUploadProductImages,
  createProduct
);
productRouter.post("/createCategory", authMiddlewware, createCategory);
productRouter.post("/createBrand", authMiddlewware, createBrand);

export default productRouter;
