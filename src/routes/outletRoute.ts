import express from "express";
import { authMiddlewware } from "../middlewares/authMiddleware";
import {
  createOutlet,
  deleteOutlet,
  detailOutlet,
  getAllOutlet,
  updateOutlet,
} from "../controllers/outletController";

const outletRouter = express.Router();

outletRouter.post("/createOutlet", authMiddlewware, createOutlet);
outletRouter.put("/updateOutlet/:outletId", authMiddlewware, updateOutlet);
outletRouter.get("/getAllOutlet/:ownerId", authMiddlewware, getAllOutlet);
outletRouter.get("/detailOutlet/:outletId", authMiddlewware, detailOutlet);
outletRouter.delete("/deleteOutlet/:outletId", authMiddlewware, deleteOutlet);

export default outletRouter;
