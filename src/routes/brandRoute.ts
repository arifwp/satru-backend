import express from "express";
import { authMiddlewware } from "../middlewares/authMiddleware";
import {
  createBrand,
  getAllBrand,
  deleteBrand,
} from "../controllers/brandController";

const brandRouter = express.Router();

brandRouter.post("/createBrand", authMiddlewware, createBrand);
brandRouter.post("/getAllBrand", authMiddlewware, getAllBrand);
brandRouter.delete("/deleteBrand/:brandId", authMiddlewware, deleteBrand);

export default brandRouter;
