import express from "express";
import {
  createDiscount,
  deleteDiscount,
  getAllDiscount,
  detailDiscount,
  updateDiscount,
} from "../controllers/discountController";

const discountRouter = express.Router();

discountRouter.post("/createDiscount", createDiscount);
discountRouter.post("/getAllDiscount", getAllDiscount),
  discountRouter.get("/detailDiscount/:ownerId/:discountId", detailDiscount);
discountRouter.put("/updateDiscount", updateDiscount);
discountRouter.delete("/deleteDiscount/:discountId", deleteDiscount);

export default discountRouter;
