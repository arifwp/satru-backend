import express from "express";
import {
  createDiscount,
  deleteDiscount,
  getAllDiscount,
  updateDiscount,
} from "../controllers/discountController";

const discountRouter = express.Router();

discountRouter.post("/createDiscount", createDiscount);
discountRouter.put("/updateDiscount", updateDiscount);
discountRouter.post("/getAllDiscount", getAllDiscount),
  discountRouter.delete("/deleteDiscount/:discountId", deleteDiscount);

export default discountRouter;
