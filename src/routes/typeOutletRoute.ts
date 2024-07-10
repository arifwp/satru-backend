import express from "express";
import {
  createTypeOutlet,
  getAllTypeOutlet,
} from "../controllers/typeOutletController";
import { authMiddlewware } from "../middlewares/authMiddleware";

const typeOutletRouter = express.Router();

typeOutletRouter.post("/createTypeOutlet", authMiddlewware, createTypeOutlet);
typeOutletRouter.get("/getAllTypeOutlet", authMiddlewware, getAllTypeOutlet);

export default typeOutletRouter;
