import express from "express";
import { authMiddlewware } from "../middlewares/authMiddleware";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
} from "../controllers/categoryController";

const categoryRouter = express.Router();

categoryRouter.post("/createCategory", authMiddlewware, createCategory);
categoryRouter.post("/getAllCategory", authMiddlewware, getAllCategory);
categoryRouter.delete(
  "/deleteCategory/:categoryId",
  authMiddlewware,
  deleteCategory
);

export default categoryRouter;
