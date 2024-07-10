import express from "express";
import { authMiddlewware } from "../middlewares/authMiddleware";
import {
  createOutlet,
  deleteOutlet,
  detailOutlet,
  updateOutlet,
} from "../controllers/outletController";

const outletRouter = express.Router();

outletRouter.post("/createOutlet", authMiddlewware, createOutlet);
outletRouter.put("/updateOutlet/:outletId", authMiddlewware, updateOutlet);
outletRouter.get("/detailOutlet/:outletId", authMiddlewware, detailOutlet);
outletRouter.delete("/deleteOutlet/:outletId", authMiddlewware, deleteOutlet);

export default outletRouter;
