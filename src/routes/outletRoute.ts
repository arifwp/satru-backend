import express from "express";
import { authMiddlewware } from "../middlewares/authMiddleware";
import {
  createOutlet,
  deleteOutlet,
  detailOutlet,
  getAllOutlet,
  getTax,
  updateOutlet,
  updateTax,
} from "../controllers/outletController";

const outletRouter = express.Router();

outletRouter.post("/createOutlet", authMiddlewware, createOutlet);
outletRouter.put("/updateOutlet/:outletId", authMiddlewware, updateOutlet);
outletRouter.put("/updateTax", authMiddlewware, updateTax);
outletRouter.get("/getAllOutlet/:ownerId", authMiddlewware, getAllOutlet);
outletRouter.get("/detailOutlet/:outletId", authMiddlewware, detailOutlet);
outletRouter.get("/getTax/:ownerId", authMiddlewware, getTax);
outletRouter.delete("/deleteOutlet/:outletId", authMiddlewware, deleteOutlet);

export default outletRouter;
