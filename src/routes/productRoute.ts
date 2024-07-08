import express from "express";
import {
  createCategory,
  createProduct,
  createBrand,
} from "../controllers/productController";

const productRouter = express.Router();

productRouter.post("/createProduct", createProduct);
productRouter.post("/createCategory", createCategory);
productRouter.post("/createBrand", createBrand);

export default productRouter;
